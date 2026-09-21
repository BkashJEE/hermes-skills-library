"""Refresh and offline-cache checks; no network or live Hermes profile access."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('stories', Path(__file__).parent / 'dashboard/stories.py')
stories = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stories)
SHA = 'a' * 40
STORY = dict(id='story-1', headline='Built a research assistant', author='Builder',
             category='research', source='github', url='https://github.com/example/project',
             date='2026-09-20', quote='Do not persist this quotation')


class StoriesTest(unittest.TestCase):
    def setUp(self):
        self.home = tempfile.TemporaryDirectory()
        self.addCleanup(self.home.cleanup)
        self.path = Path(self.home.name) / 'cache/user-stories.json'
        self.cache = patch.object(stories, 'cache_path', return_value=self.path)
        self.cache.start()
        self.addCleanup(self.cache.stop)

    def refresh(self, rows=None):
        with patch.object(stories, 'fetch_json', side_effect=[[{'sha': SHA}], rows or [STORY]]) as fetch:
            result = stories.refresh()
        self.assertEqual(fetch.call_args_list[0].args, (stories._LATEST,))
        self.assertEqual(fetch.call_args_list[1].args, (f'https://raw.githubusercontent.com/NousResearch/hermes-agent/{SHA}/website/src/data/userStories.json',))
        return result

    def test_refresh_persists_latest_metadata_without_quotes(self):
        first = self.refresh()
        second = self.refresh([STORY, {**STORY, 'id': 'story-2'}])
        self.assertEqual(len(second['projects']), 2)
        self.assertNotIn('quote', self.path.read_text())
        with patch.object(stories, 'fetch_json', side_effect=AssertionError('No network on read')):
            self.assertEqual(stories.read_cached(), second)
        self.assertTrue(first['checked_at'])
        self.assertEqual(second['source_revision'], SHA)

    def test_failed_refresh_preserves_last_good_cache(self):
        self.refresh()
        saved = self.path.read_bytes()
        bad_responses = [TimeoutError('offline'), [[{'sha': SHA}], []],
                         [[{'sha': SHA}], [{**STORY, 'url': 'javascript:alert(1)'}]],
                         [[{'sha': '../main'}]], [[{'sha': SHA}], [STORY, STORY]]]
        for response in bad_responses:
            with self.subTest(response=response), patch.object(stories, 'fetch_json', side_effect=response):
                with self.assertRaises((TimeoutError, ValueError)):
                    stories.refresh()
            self.assertEqual(self.path.read_bytes(), saved)
        # The lock is released after failure, so retry succeeds.
        self.refresh()

    def test_invalid_cache_falls_back(self):
        self.assertIsNone(stories.read_cached())
        self.path.parent.mkdir(parents=True)
        for value in ('broken json', '[]', '{"revision": "wrong"}'):
            self.path.write_text(value)
            self.assertIsNone(stories.read_cached())

    def test_new_category_is_browsable(self):
        data = self.refresh([{**STORY, 'category': 'new-use-case', 'source': 'new-source'}])
        self.assertIn('new-use-case', [c['id'] for c in data['categories']])
        self.assertEqual(data['projects'][0]['source'], 'new-source')

    def test_overlapping_refresh_is_rejected(self):
        with stories._REFRESH_LOCK:
            with self.assertRaises(RuntimeError):
                stories.refresh()

    def test_network_size_limit_and_redirect(self):
        with patch.object(stories, 'build_opener') as factory:
            factory.return_value.open.return_value.__enter__.return_value.read.return_value = b' ' * (stories._MAX_BYTES + 1)
            with self.assertRaises(ValueError):
                stories.fetch_json(stories._LATEST)
        with self.assertRaises(ValueError):
            stories.NoRedirect().redirect_request(None, None, 302, None, None, 'https://example.com')

    def test_preview_is_short_and_cached_by_revision(self):
        stories._PREVIEW_CACHE = ('', {})
        row = {**STORY, 'quote': ' '.join('word' + str(i) for i in range(50))}
        with patch.object(stories, 'fetch_json', return_value=[row]) as fetch:
            preview = stories.story_preview(row['id'], SHA)
            self.assertEqual(len(preview['excerpt'].split()), 24)
            self.assertTrue(preview['excerpt'].endswith('…'))
            self.assertEqual(preview['author'], row['author'])
            self.assertEqual(preview['url'], row['url'])
            self.assertEqual(stories.story_preview(row['id'], SHA), preview)
            fetch.assert_called_once()
        self.assertFalse(self.path.exists())
        with self.assertRaises(ValueError):
            stories.story_preview(row['id'], '../main')

    def test_write_failure_preserves_cache(self):
        self.refresh()
        saved = self.path.read_bytes()
        with patch.object(Path, 'replace', side_effect=OSError('disk full')):
            with self.assertRaises(OSError):
                self.refresh([STORY, {**STORY, 'id': 'story-2'}])
        self.assertEqual(self.path.read_bytes(), saved)
        self.assertEqual(list(self.path.parent.iterdir()), [self.path])


if __name__ == '__main__':
    unittest.main()
