"""Official Nous story metadata, fetched only on an explicit refresh."""
from datetime import date, datetime, timezone
import json
import os
from pathlib import Path
import re
import tempfile
import threading
from urllib.parse import urlparse
from urllib.request import Request, HTTPRedirectHandler, build_opener

CATEGORIES = [
    ('dev-workflow', 'Dev Workflow', 'code', '#779df1'),
    ('personal-assistant', 'Personal Assistant', 'person', '#79b99b'),
    ('integrations', 'Integrations', 'plug', '#73bdde'),
    ('creative', 'Creative', 'paintcan', '#d992b8'),
    ('business-ops', 'Business Ops', 'briefcase', '#d5a45e'),
    ('meta', 'Meta & Ecosystem', 'globe', '#b49ade'),
    ('cost-optimization', 'Cost Optimization', 'dashboard', '#d5bb8c'),
    ('privacy', 'Privacy & Self-Hosted', 'shield', '#72bca6'),
    ('content-creation', 'Content Creation', 'edit', '#d992b8'),
    ('research', 'Research', 'search', '#a99cdb'),
    ('enterprise', 'Enterprise', 'organization', '#9aacc3'),
    ('messaging', 'Messaging', 'comment-discussion', '#64c8bd'),
    ('general', 'General', 'lightbulb', '#b3b0bc'),
    ('trading', 'Trading & Markets', 'graph', '#d5a45e'),
    ('marketing', 'Marketing', 'megaphone', '#c999d1'),
]
SOURCES = {'x':'X · Twitter','hn':'Hacker News','reddit':'Reddit','github':'GitHub',
           'youtube':'YouTube','blog':'Blog','podcast':'Podcast','linkedin':'LinkedIn',
           'gist':'GitHub Gist','producthunt':'Product Hunt','discord':'Discord'}
DOCS = 'https://hermes-agent.nousresearch.com/docs/user-stories'

def convert(stories, revision):
    if not isinstance(stories, list) or not 0 < len(stories) <= 10000:
        raise ValueError('Invalid story collection')
    categories = {row[0]: row for row in CATEGORIES}
    projects, seen = [], set()
    for story in stories:
        if not isinstance(story, dict):
            raise ValueError('Invalid story')
        for key in ('id','headline','author','category','source','url'):
            if not isinstance(story.get(key), str) or not story[key].strip() or len(story[key]) > 2000:
                raise ValueError('Missing story field: ' + key)
        if story['id'] in seen:
            raise ValueError('Duplicate story id: ' + story['id'])
        seen.add(story['id'])
        parsed = urlparse(story['url'])
        if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
            raise ValueError('Unsafe story URL')
        if story['category'] not in categories:
            slug = story['category']
            if not re.fullmatch(r'[a-z0-9-]{1,80}', slug):
                raise ValueError('Invalid story category')
            categories[slug] = (slug, slug.replace('-', ' ').title(), 'lightbulb', '#b3b0bc')
        category, label, icon, color = categories[story['category']]
        source = SOURCES.get(story['source'], story['source'])
        published = story.get('date') or 'Date not listed'
        if not isinstance(published, str) or len(published) > 40:
            raise ValueError('Invalid story date')
        projects.append(dict(id=story['id'], name=story['headline'], author=story['author'],
            category=category, icon=icon, color=color, source=source, date=published,
            description=f'{source} · {published}',
            highlights=[f'Category: {label}', f'Original source: {source}', f'Story date: {published}'],
            url=story['url'], docs_url=DOCS))
    if not projects:
        raise ValueError('The official collection was empty')
    return dict(checked_on=date.today().isoformat(), main_url=DOCS, source_url=DOCS,
        source_revision=revision,
        source_file=f'https://github.com/NousResearch/hermes-agent/blob/{revision}/website/src/data/userStories.json',
        categories=[dict(id=i,label=l,icon=s,color=c) for i,l,s,c in categories.values()], projects=projects)


_DATA_PATH = 'website/src/data/userStories.json'
_LATEST = 'https://api.github.com/repos/NousResearch/hermes-agent/commits?path=' + _DATA_PATH + '&per_page=1'
_MAX_BYTES = 4 * 1024 * 1024
_REFRESH_LOCK = threading.Lock()

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError('Unexpected source redirect')


def fetch_json(url):
    request = Request(url, headers={'User-Agent': 'hermes-skills-library', 'Accept': 'application/json'})
    with build_opener(NoRedirect()).open(request, timeout=12) as response:
        payload = response.read(_MAX_BYTES + 1)
    if len(payload) > _MAX_BYTES:
        raise ValueError('Official collection exceeds size limit')
    return json.loads(payload)


def cache_path():
    home = Path(os.environ.get('HERMES_HOME') or Path.home() / '.hermes')
    return home / 'cache' / 'hermes-skills-library' / 'user-stories.json'


def read_cached():
    try:
        path = cache_path()
        if path.stat().st_size > _MAX_BYTES:
            return None
        saved = json.loads(path.read_text())
        revision = saved['revision']
        if not isinstance(revision, str) or not re.fullmatch(r'[0-9a-f]{40}', revision):
            return None
        data = convert(saved['stories'], revision)
        checked = datetime.fromisoformat(saved['checked_at'])
        data.update(checked_on=checked.date().isoformat(), checked_at=checked.isoformat())
        return data
    except (OSError, ValueError, KeyError, TypeError):
        return None


def refresh():
    # Reject overlapping requests from multiple windows; never overwrite a good cache on failure.
    if not _REFRESH_LOCK.acquire(blocking=False):
        raise RuntimeError('A refresh is already running. Try again shortly.')
    try:
        commits = fetch_json(_LATEST)
        if not isinstance(commits, list) or not commits or not isinstance(commits[0], dict):
            raise ValueError('Invalid official revision response')
        revision = commits[0].get('sha')
        if not isinstance(revision, str) or not re.fullmatch(r'[0-9a-f]{40}', revision):
            raise ValueError('Invalid official revision')
        stories = fetch_json(f'https://raw.githubusercontent.com/NousResearch/hermes-agent/{revision}/{_DATA_PATH}')
        data = convert(stories, revision)
        checked = datetime.now(timezone.utc).isoformat()
        data.update(checked_on=checked[:10], checked_at=checked)
        # Retain metadata only; never cache third-party quotation bodies.
        cleaned = [{key: row[key] for key in ('id', 'headline', 'author', 'category', 'source', 'url', 'date') if key in row} for row in stories]
        payload = json.dumps(dict(revision=revision, stories=cleaned, checked_at=checked), ensure_ascii=False)
        path = cache_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent, delete=False) as out:
                temporary = Path(out.name)
                out.write(payload)
            temporary.replace(path)
        finally:
            if temporary is not None and temporary.exists():
                temporary.unlink()
        return data
    finally:
        _REFRESH_LOCK.release()


_PREVIEW_LOCK = threading.Lock()
_PREVIEW_CACHE = ('', {})


def story_preview(identifier, revision):
    """Lazy, short excerpts from a fixed official revision; never fetch arbitrary story URLs."""
    global _PREVIEW_CACHE
    if not re.fullmatch(r'[0-9a-f]{40}', revision):
        raise ValueError('Invalid official revision')
    with _PREVIEW_LOCK:
        if _PREVIEW_CACHE[0] != revision:
            rows = fetch_json(f'https://raw.githubusercontent.com/NousResearch/hermes-agent/{revision}/{_DATA_PATH}')
            convert(rows, revision)
            previews = {}
            for row in rows:
                quote = row.get('quote')
                words = quote.split() if isinstance(quote, str) else []
                # A brief attributed excerpt, not a reproduction of the original post.
                excerpt = ' '.join(words[:24])
                if len(words) > 24:
                    excerpt += '…'
                previews[row['id']] = {'excerpt': excerpt, 'url': row['url'], 'author': row['author']}
            _PREVIEW_CACHE = (revision, previews)
        return _PREVIEW_CACHE[1].get(identifier, {'excerpt': ''})
