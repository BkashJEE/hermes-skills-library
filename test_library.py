"""Exercise real Hermes reads/writes in a disposable home, never live profiles."""
import asyncio
import importlib.util
import os
from pathlib import Path
import tempfile
import subprocess
import unittest

TEST_HOME = tempfile.TemporaryDirectory(prefix='hermes-skills-library-test-')
os.environ['HERMES_HOME'] = TEST_HOME.name
os.environ.pop('HERMES_PROFILE', None)
os.environ['HERMES_DISABLE_DOTENV'] = '1'
root = Path(TEST_HOME.name)
for name in ('alice', 'bob'):
    p = root / 'profiles' / name
    (p / 'skills').mkdir(parents=True)
    (p / 'config.yaml').write_text('skills:\n  disabled: []\n')
(root / 'config.yaml').write_text('skills:\n  disabled: []\n')

spec = importlib.util.spec_from_file_location('library_api', Path(__file__).parent/'dashboard/plugin_api.py')
api = importlib.util.module_from_spec(spec)
spec.loader.exec_module(api)
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient
app = FastAPI()
app.include_router(api.router)
client = TestClient(app)

class LibraryTest(unittest.TestCase):
    def test_community_directory_is_public_and_profile_independent(self):
        from urllib.parse import urlparse
        response = client.get('/community')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['main_url'], 'https://hermes-agent.nousresearch.com/docs/user-stories')
        self.assertRegex(data['source_revision'], r'^[0-9a-f]{40}$')
        projects = data['projects']
        self.assertTrue(projects)
        self.assertEqual(len({p['id'] for p in projects}), len(projects))
        for project in projects:
            url = urlparse(project['url'])
            self.assertEqual(url.scheme, 'https')
            self.assertTrue(url.hostname)
            self.assertFalse(url.username or url.password)
            self.assertEqual(project['docs_url'], data['source_url'])
            self.assertTrue(project['source'])
            self.assertTrue(project['author'])
            self.assertTrue(project['highlights'])
            self.assertIn(project['category'], {c['id'] for c in data['categories']})
            self.assertNotIn('installed', project)

    def test_community_refresh_endpoint_preserves_offline_reads(self):
        from unittest.mock import patch
        data = client.get('/community').json()
        data['checked_at'] = '2026-09-20T12:00:00+00:00'
        with patch.object(api._stories, 'refresh', return_value=data) as refresh:
            response = client.get('/community?refresh=true')
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), data)
            refresh.assert_called_once()
        with patch.object(api._stories, 'refresh', side_effect=TimeoutError('offline')):
            self.assertEqual(client.get('/community?refresh=true').status_code, 502)
            self.assertEqual(client.get('/community').status_code, 200)

    @classmethod
    def setUpClass(cls):
        cls.source = root/'source'
        skill = cls.source/'lesson-outline'
        (skill/'references').mkdir(parents=True)
        (skill/'SKILL.md').write_text('---\nname: lesson-outline\ndescription: Make a lesson outline.\n---\n# Lessons\nWrite a learning objective and three discussion questions.\n')
        (skill/'references'/'example.txt').write_text('Example lesson resource')
        api.sources = lambda: [{'path':str(cls.source),'label':'Test source'}]
        api._CACHE = (0,{})
        cls.ident = next(iter(api.local_catalog()))

    def test_01_install_preserves_resources_and_profile_isolation(self):
        response = client.post('/install',json={'target':'alice','identifier':self.ident})
        self.assertEqual(response.status_code,200,response.text)
        path = root/'profiles/alice/skills/library/lesson-outline'
        self.assertTrue((path/'SKILL.md').exists())
        self.assertEqual((path/'references/example.txt').read_text(),'Example lesson resource')
        self.assertFalse((root/'profiles/bob/skills/library/lesson-outline').exists())
        self.assertFalse((root/'skills/library/lesson-outline').exists())
        for profile,expected in [('alice',True),('bob',False),('alice',True)]:
            data=client.get('/catalog',params={'target':profile})
            self.assertEqual(data.status_code,200,data.text)
            row=next(x for x in data.json()['skills'] if x['id']==self.ident)
            self.assertEqual(row['installed'],expected)

    def test_02_existing_skill_is_not_overwritten(self):
        md=root/'profiles/alice/skills/library/lesson-outline/SKILL.md'
        md.write_text(md.read_text()+'\nPersonal edit\n')
        response=client.post('/install',json={'target':'alice','identifier':self.ident})
        self.assertEqual(response.status_code,409,response.text)
        self.assertIn('Personal edit',md.read_text())

    def test_03_toggle_and_preview_scope(self):
        response=client.put('/toggle',json={'target':'alice','name':'lesson-outline','enabled':False})
        self.assertEqual(response.status_code,200,response.text)
        for profile,expected in [('alice',False),('bob',None),('alice',False)]:
            data=client.get('/catalog',params={'target':profile}).json()
            items=[r for r in data['skills'] if r['kind']=='installed' and r['name']=='lesson-outline']
            self.assertEqual(items[0]['enabled'] if items else None,expected)
        self.assertEqual(client.get('/preview',params={'target':'bob','identifier':'installed:lesson-outline'}).status_code,404)
        self.assertIn('Personal edit',client.get('/preview',params={'target':'alice','identifier':'installed:lesson-outline'}).json()['content'])

    def test_04_invalid_target_and_unknown_skill(self):
        for name in ('../alice','does-not-exist',''):
            self.assertIn(client.post('/install',json={'target':name,'identifier':self.ident}).status_code,(400,404,422))
        self.assertEqual(client.post('/install',json={'target':'bob','identifier':'local:unknown'}).status_code,404)

    def test_05_symlink_bundle_rejected(self):
        bad=root/'bad'
        bad.mkdir()
        (bad/'SKILL.md').write_text('# Link test')
        (bad/'leak').symlink_to(root/'profiles/alice/config.yaml')
        with self.assertRaises(HTTPException): api.bundle_files(bad)

    def test_06_os_and_dependencies(self):
        info=api.compatibility({'metadata':{'openclaw':{'os':['darwin'],'requires':{'bins':['missing-binary-hsl-test']}}}})
        self.assertTrue(info['unsupported'])
        self.assertIn('missing-binary-hsl-test',' '.join(info['requirements']))

    def test_07_plugin_import_and_profile_isolation(self):
        repo = root/'sample-plugin'
        repo.mkdir()
        (repo/'plugin.yaml').write_text('name: library-test-plugin\nversion: 1.0.0\ndescription: Test plugin package.\nkind: standalone\nprovides_tools: []\nprovides_hooks: []\n')
        for args in [('init',), ('add', '.'), ('-c','user.name=Test','-c','user.email=test@example.invalid','commit','-m','fixture')]:
            subprocess.run(['git', *args], cwd=repo, check=True, capture_output=True)
        response = client.post('/plugins/install', json={'target':'alice','identifier':repo.as_uri()})
        self.assertEqual(response.status_code, 200, response.text)
        self.assertFalse(response.json()['enabled'])
        self.assertTrue((root/'profiles/alice/plugins/library-test-plugin/plugin.yaml').exists())
        for profile, expected in [('alice', True), ('bob', False), ('alice', True)]:
            response = client.get('/plugins/catalog', params={'target':profile})
            self.assertEqual(response.status_code, 200, response.text)
            matches = [r for r in response.json()['plugins'] if r['name']=='library-test-plugin']
            self.assertEqual(bool(matches), expected)
            if matches:
                self.assertFalse(matches[0]['enabled'])
        second = client.post('/plugins/install', json={'target':'alice','identifier':repo.as_uri()})
        self.assertEqual(second.status_code, 400, second.text)

    def test_08_plugin_invalid_target_and_toggle(self):
        self.assertIn(client.post('/plugins/install',json={'target':'../bob','identifier':'owner/repo'}).status_code, (400,404))
        self.assertEqual(client.put('/plugins/toggle',json={'target':'bob','name':'library-test-plugin','enabled':True}).status_code, 404)
        response = client.put('/plugins/toggle',json={'target':'alice','name':'library-test-plugin','enabled':True})
        self.assertEqual(response.status_code, 200, response.text)
        for profile, expected in [('alice', True), ('bob', None), ('alice', True)]:
            rows=client.get('/plugins/catalog',params={'target':profile}).json()['plugins']
            row=next((r for r in rows if r['name']=='library-test-plugin'),None)
            self.assertEqual(row['enabled'] if row else None, expected)

    def test_09_author_attribution_does_not_guess_authorship(self):
        self.assertEqual(api.attribution({'author': {'name': 'Ada'}, 'maintainer': 'Team'})['authors'], ['Ada'])
        self.assertEqual(api.attribution({'authors': ['Ada', {'name': 'Lin'}, 'Ada']})['authors'], ['Ada', 'Lin'])
        self.assertEqual(api.attribution({'metadata': {'author': 'Ada'}})['authors'], ['Ada'])
        self.assertEqual(api.attribution({'maintainer': 'Team'})['author_kind'], 'maintainer')
        self.assertEqual(api.attribution({'repo': 'https://github.com/team/project'})['author_kind'], 'repository owner')
        self.assertEqual(api.attribution({'repo': 'https://example.com/team/project'})['authors'], [])
        self.assertEqual(api.attribution({'source': 'This agent'})['authors'], [])
        md = root/'profiles/alice/skills/library/lesson-outline/SKILL.md'
        md.write_text(md.read_text().replace('name: lesson-outline', 'name: lesson-outline\nauthor: Ada'))
        rows = client.get('/catalog', params={'target': 'alice'}).json()['skills']
        row = next(r for r in rows if r['id'] == 'installed:lesson-outline')
        self.assertEqual(row['authors'], ['Ada'])

if __name__=='__main__':
    unittest.main()
