"""Profile-scoped skills library using Hermes' scanner, installer and enable state."""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import sys
import threading
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
import yaml

router = APIRouter()
_INSTALL_LOCK = threading.Lock()
_CACHE_LOCK = threading.Lock()
_CACHE = (0, {})
_LIMIT = 20 * 1024 * 1024


def sources():
    """Explicit local roots; no client-supplied filesystem paths."""
    cfg = Path(__file__).with_name('sources.local.json')
    if not cfg.exists():
        cfg = Path(__file__).with_name('sources.json')
    return json.loads(cfg.read_text()) if cfg.exists() else []


def frontmatter(text):
    if text.startswith('---'):
        try:
            value = yaml.safe_load(text.split('---', 2)[1])
            return value if isinstance(value, dict) else {}
        except (yaml.YAMLError, IndexError):
            pass
    return {}


def attribution(meta):
    """Keep declared authors distinct from maintainers and repository owners."""
    from urllib.parse import urlparse
    metadata = meta.get('metadata') or {}
    if not isinstance(metadata, dict):
        metadata = {}
    for value, kind in ((meta.get('authors') or meta.get('author') or metadata.get('author'), 'author'),
                        (meta.get('maintainer'), 'maintainer')):
        values = value if isinstance(value, list) else [value]
        names = []
        for item in values:
            name = item.get('name') if isinstance(item, dict) else item
            if isinstance(name, str) and name.strip():
                name = name.strip()[:120]
                if name not in names:
                    names.append(name)
        if names:
            return {'authors': names, 'author_kind': kind}
    repo = meta.get('repo') or ''
    if isinstance(repo, str):
        parsed = urlparse(repo)
        path = parsed.path.strip('/') if parsed.hostname == 'github.com' else repo
        parts = path.split('/')
        if len(parts) == 2 and all(parts) and ':' not in path and not path.startswith('.'):
            return {'authors': [parts[0]], 'author_kind': 'repository owner'}
    return {'authors': [], 'author_kind': 'unknown'}


def read_metadata(path, markdown=False):
    try:
        path = Path(path)
        if path.is_symlink() or path.stat().st_size > 1024 * 1024:
            return {}
        text = path.read_text(encoding='utf-8')
        data = frontmatter(text) if markdown else yaml.safe_load(text)
        return data if isinstance(data, dict) else {}
    except (OSError, UnicodeError, yaml.YAMLError):
        return {}


def compatibility(meta):
    raw = meta.get('metadata') or {}
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except ValueError:
            raw = {}
    raw = raw if isinstance(raw, dict) else {}
    info = raw.get('openclaw') or raw.get('clawdbot') or raw.get('hermes') or {}
    info = info if isinstance(info, dict) else {}
    systems = info.get('os') or []
    req = info.get('requires') or {}
    req = req if isinstance(req, dict) else {}
    bins = req.get('bins') or []
    missing = [b for b in bins if isinstance(b, str) and not shutil.which(b)]
    alternatives = req.get('anyBins') or []
    if alternatives and not any(shutil.which(b) for b in alternatives):
        missing.append(' or '.join(alternatives))
    unsupported = bool(systems and sys.platform not in systems)
    notes = []
    if unsupported:
        notes.append('Requires ' + ', '.join({'darwin': 'macOS', 'win32': 'Windows', 'linux': 'Linux'}.get(x, x) for x in systems))
    if missing:
        notes.append('Missing apps: ' + ', '.join(missing))
    if req.get('env'):
        notes.append('Credentials required: ' + ', '.join(req['env']))
    if req.get('config'):
        notes.append('Source-app configuration required: ' + ', '.join(req['config']))
    return {'unsupported': unsupported, 'requirements': notes, 'emoji': info.get('emoji') or '◇'}


def local_catalog():
    global _CACHE
    with _CACHE_LOCK:
        if time.monotonic() - _CACHE[0] < 30:
            return _CACHE[1]
        out = {}
        for source in sources():
            root = Path(source['path']).expanduser().resolve()
            if not root.is_dir():
                continue
            for md in sorted(root.rglob('SKILL.md')):
                if md.is_symlink() or not md.resolve().is_relative_to(root):
                    continue
                rel = md.relative_to(root)
                if any(p.startswith('.') and p != '.system' or p in ('node_modules', 'references', 'test', 'tests') for p in rel.parts[:-1]):
                    continue
                try:
                    if md.stat().st_size > 1024 * 1024:
                        continue
                    text = md.read_text()
                    meta = frontmatter(text)
                except (OSError, UnicodeError):
                    continue
                ident = 'local:' + hashlib.sha256(str(md).encode()).hexdigest()[:24]
                name = str(meta.get('name') or md.parent.name)
                out[ident] = {'id': ident, 'name': name, 'description': str(meta.get('description') or ''),
                    'source': source['label'], 'category': str(rel.parent.parent),
                    'kind': 'local', '_path': md.parent, **compatibility(meta), **attribution(meta)}
                if source.get('connector'):
                    out[ident]['requirements'].append('May require its original app connector/tools; installing instructions does not add them to Hermes.')
        _CACHE = (time.monotonic(), out)
        return out


def validate_target(target):
    from hermes_cli.web_server_profiles import _resolve_profile_dir
    if not target:
        raise HTTPException(400, 'Choose a Hermes profile first.')
    _resolve_profile_dir(target)
    return target


def public(item):
    return {k: v for k, v in item.items() if not k.startswith('_')}


@router.get('/profiles')
async def profiles():
    from hermes_cli.web_routers.profiles import list_profiles_endpoint
    return await list_profiles_endpoint()


@router.get('/catalog')
async def catalog(target: str):
    import asyncio
    from hermes_cli.web_routers.skills import get_skills, list_official_skills
    validate_target(target)
    installed = await get_skills(profile=target)
    official = await list_official_skills(profile=target)
    local = await asyncio.to_thread(local_catalog)
    from hermes_cli.web_routers._common import scoped_to_thread
    def installed_authors():
        from tools.skill_manager_tool import _find_skill
        result = {}
        for skill in installed:
            found = _find_skill(skill['name'])
            result[skill['name']] = attribution(read_metadata(found['path'] / 'SKILL.md', True)) if found else attribution({})
        return result
    author_by_name = await scoped_to_thread(target, installed_authors)
    by_name = {s['name']: s for s in installed}
    rows = []
    for s in installed:
        rows.append({**s, **author_by_name[s['name']], 'id': 'installed:' + s['name'], 'kind': 'installed', 'source': 'This agent',
                     'installed': True, 'requirements': [], 'emoji': '✦'})
    from tools.skills_hub_official import OptionalSkillSource
    optional_root = OptionalSkillSource()._optional_dir.resolve()
    for s in official['skills']:
        match = by_name.get(s['name'])
        candidate = (optional_root / s['identifier'].split('/', 1)[-1] / 'SKILL.md').resolve()
        meta = read_metadata(candidate, True) if candidate.is_relative_to(optional_root) else {}
        rows.append({**s, **attribution({**s, **meta}), 'id': s['identifier'], 'kind': 'hub', 'source': 'Hermes official',
                     'installed': bool(match), 'enabled': match.get('enabled', True) if match else False,
                     'requirements': [], 'emoji': '✧'})
    for item in local.values():
        match = by_name.get(item['name'])
        rows.append({**public(item), 'installed': bool(match),
                     'enabled': match.get('enabled', True) if match else False})
    return {'target': target, 'skills': rows, 'installed_count': len(installed)}


@router.get('/search')
async def search(target: str, q: str):
    from hermes_cli.web_routers.skills import search_skills_hub
    validate_target(target)
    result = await search_skills_hub(q=q, limit=40, profile=target)
    return {'target': target, 'skills': [{**s, **attribution(s), 'id': s['identifier'], 'kind': 'hub', 'emoji': '✧',
            'requirements': []} for s in result['results']], 'timed_out': result.get('timed_out', [])}


def local_item(identifier):
    item = local_catalog().get(identifier)
    if not item:
        raise HTTPException(404, 'This skill is no longer in the local catalog. Refresh the library.')
    return item


def bundle_files(directory):
    """Copy full resources, but refuse redirects, secrets and unbounded bundles."""
    files, total = {}, 0
    for path in sorted(directory.rglob('*')):
        rel = path.relative_to(directory)
        if any(p.startswith('.') or p in ('node_modules', '__pycache__') for p in rel.parts):
            continue
        if path.is_symlink() or not path.resolve().is_relative_to(directory.resolve()):
            raise HTTPException(400, f'Skill contains a symbolic link: {rel}')
        if not path.is_file():
            continue
        total += path.stat().st_size
        if total > _LIMIT or len(files) >= 1000:
            raise HTTPException(400, 'Skill bundle is too large (20 MB / 1000 files maximum).')
        files[str(rel)] = path.read_bytes()
    if 'SKILL.md' not in files:
        raise HTTPException(400, 'Skill has no SKILL.md.')
    return files


@router.get('/preview')
async def preview(target: str, identifier: str):
    from hermes_cli.web_routers.skills import get_skill_content, preview_skill_hub
    validate_target(target)
    if identifier.startswith('local:'):
        item = local_item(identifier)
        return {**public(item), 'content': (item['_path'] / 'SKILL.md').read_text(),
                'files': list(bundle_files(item['_path']))}
    if identifier.startswith('installed:'):
        result = await get_skill_content(identifier[len('installed:'):], profile=target)
        return {**result, **compatibility(frontmatter(result['content']))}
    result = await preview_skill_hub(identifier=identifier, profile=target)
    return {**result, 'content': result['skill_md'], **compatibility(frontmatter(result['skill_md']))}


class Install(BaseModel):
    target: str = Field(min_length=1, max_length=100)
    identifier: str = Field(min_length=1, max_length=1000)


@router.post('/install')
async def install(body: Install):
    from hermes_cli.web_routers._common import scoped_to_thread
    validate_target(body.target)

    def run():
        from tools.skills_hub_models import SkillBundle, _validate_skill_name
        from tools.skills_hub_install import quarantine_bundle, install_from_quarantine
        from tools.skills_guard import scan_skill, should_allow_install
        from tools.skills_tool import _find_all_skills
        from hermes_cli.web_routers.skills import _resolve_hub_skill, _clear_skills_prompt_cache
        from hermes_constants import get_hermes_home
        with _INSTALL_LOCK:
            if body.identifier.startswith('local:'):
                item = local_item(body.identifier)
                if item['unsupported']:
                    raise HTTPException(400, '; '.join(item['requirements']))
                bundle = SkillBundle(name=item['_path'].name, files=bundle_files(item['_path']),
                    source='local', identifier=body.identifier, trust_level='community',
                    metadata={'library_source': item['source']})
            else:
                _, bundle = _resolve_hub_skill(body.identifier, body.target)
                if not bundle:
                    raise HTTPException(404, 'Skill source could not be downloaded.')
            _validate_skill_name(bundle.name)
            skill_text = bundle.files.get('SKILL.md', '')
            if isinstance(skill_text, bytes):
                skill_text = skill_text.decode('utf-8')
            requirements = compatibility(frontmatter(skill_text))
            if requirements['unsupported']:
                raise HTTPException(400, '; '.join(requirements['requirements']))
            category = '/'.join(bundle.identifier.split('/')[1:-1]) if bundle.source == 'official' else 'library'
            dest = get_hermes_home() / 'skills' / category / bundle.name
            # Never overwrite a skill, including disabled or locally edited installs.
            names = {s['name'] for s in _find_all_skills(skip_disabled=True)}
            names.update(p.parent.name for p in (get_hermes_home() / 'skills').rglob('SKILL.md'))
            if bundle.name in names or dest.exists() or dest.is_symlink():
                raise HTTPException(409, 'This agent already has a skill with that name. Use its enable switch.')
            q = quarantine_bundle(bundle)
            try:
                result = scan_skill(q, source='official' if bundle.source == 'official' else bundle.identifier)
                allowed, reason = should_allow_install(result, force=False)
                if not allowed:
                    raise HTTPException(422, {'message': 'Hermes scanner blocked this installation.',
                        'reason': reason, 'findings': [f.description for f in result.findings]})
                installed = install_from_quarantine(q, bundle.name, category, bundle, result)
            finally:
                if q.exists():
                    shutil.rmtree(q)
            _clear_skills_prompt_cache()
            return {'ok': True, 'name': bundle.name, 'target': body.target, 'path': str(installed),
                    'message': f'Installed for {body.target}. Available in new conversations.'}
    return await scoped_to_thread(body.target, run)


class Toggle(BaseModel):
    target: str
    name: str
    enabled: bool


@router.put('/toggle')
async def toggle(body: Toggle):
    from hermes_cli.web_models import SkillToggle
    from hermes_cli.web_routers.skills import toggle_skill, get_skills
    validate_target(body.target)
    if body.name not in {s['name'] for s in await get_skills(profile=body.target)}:
        raise HTTPException(404, 'Skill is not installed for the selected agent.')
    return await toggle_skill(SkillToggle(name=body.name, enabled=body.enabled), profile=body.target)


@router.get('/plugins/catalog')
async def plugin_catalog(target: str):
    """Use Hermes discovery and its reviewed catalog in the selected profile."""
    from hermes_cli.web_routers._common import scoped_to_thread
    validate_target(target)

    def run():
        from hermes_cli import plugins_cmd as pc
        from hermes_cli.plugins_cmd_catalog import installed_catalog_state
        enabled, disabled = pc._get_enabled_set(), pc._get_disabled_set()
        installed, rows = {}, []
        for name, version, description, source, directory, key in pc._discover_all_plugins():
            status = pc._plugin_status(name, enabled, disabled, key=key)
            if status == 'not enabled' and source == 'bundled' and pc._bundled_default_on(directory):
                status = 'enabled'
            info = {'dir': directory, 'runtime_status': status}
            installed.update({alias: info for alias in (name, key) if alias})
            rows.append({**attribution(read_metadata(Path(directory) / 'plugin.yaml')), 'id': 'plugin:' + key, 'key': key, 'name': name,
                         'description': description, 'version': str(version or ''),
                         'source': 'Bundled with Hermes' if source == 'bundled' else 'This agent',
                         'kind': 'installed', 'installed': True, 'enabled': status == 'enabled',
                         'requirements': [], 'format': 'Hermes plugin'})
        catalog = installed_catalog_state(installed)
        for row in rows:
            if not row['authors']:
                entry = next((e for e in catalog['entries'] if e['name'] == row['name']), {})
                row.update(attribution(entry))
        for entry in catalog['entries']:
            if entry['installed']:
                continue
            platforms = entry.get('platforms') or []
            supported = not platforms or sys.platform in platforms or (
                sys.platform == 'win32' and 'windows' in platforms) or (
                sys.platform == 'darwin' and 'macos' in platforms)
            rows.append({**entry, **attribution(entry), 'id': 'catalog:' + entry['name'], 'kind': 'catalog',
                         'source': 'Hermes official' if entry['tier'] == 'official' else 'Hermes community',
                         'enabled': False, 'unsupported': not supported,
                         'requirements': ['Requires ' + x for x in entry['capabilities'].get('requires_env', [])],
                         'format': 'Hermes plugin'})
        return {'target': target, 'plugins': rows}
    return await scoped_to_thread(target, run)


class PluginInstall(BaseModel):
    target: str = Field(min_length=1, max_length=100)
    identifier: str = Field(default='', max_length=1000)
    catalog_name: str | None = Field(default=None, max_length=100)


@router.post('/plugins/install')
async def install_plugin(body: PluginInstall):
    from hermes_cli.web_routers._common import scoped_to_thread
    validate_target(body.target)
    if not body.identifier.strip() and not body.catalog_name:
        raise HTTPException(400, 'Enter a plugin repository or choose a catalog plugin.')

    def run():
        from hermes_cli.plugins_cmd import dashboard_install_plugin
        with _INSTALL_LOCK:
            result = dashboard_install_plugin(body.identifier.strip(), force=False, enable=False,
                                              catalog_name=body.catalog_name)
        if not result.get('ok'):
            raise HTTPException(400, result.get('error') or 'Plugin import failed.')
        result.pop('after_install_path', None)
        result['message'] = f"Imported {result['plugin_name']} for {body.target}. Enable it when ready; restart Hermes to load new plugins."
        return result
    return await scoped_to_thread(body.target, run)


@router.put('/plugins/toggle')
async def toggle_plugin(body: Toggle):
    from hermes_cli.web_routers._common import scoped_to_thread
    validate_target(body.target)

    def run():
        from hermes_cli.plugins_cmd import _discover_all_plugins, dashboard_set_agent_plugin_enabled
        if body.name not in {key for *_, key in _discover_all_plugins()}:
            raise HTTPException(404, 'Plugin is not installed for this agent.')
        if body.name == 'hermes-skills-library' and not body.enabled:
            raise HTTPException(400, 'Manage this library from Hermes Capabilities → Plugins.')
        with _INSTALL_LOCK:
            result = dashboard_set_agent_plugin_enabled(body.name, enabled=body.enabled)
        if not result.get('ok'):
            raise HTTPException(400, result.get('error') or 'Plugin state could not be saved.')
        result['message'] = f"Plugin {'enabled' if body.enabled else 'disabled'} for {body.target}. Restart Hermes to apply."
        return result
    return await scoped_to_thread(body.target, run)
