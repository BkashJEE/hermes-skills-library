"""Import public story metadata from a pinned revision of the official Nous docs.

Run: python scripts/import-nous-stories.py --revision <40-character commit SHA>
Then: npm run sync:community
Original post quotations are deliberately not copied. Attribution and links remain.
"""
import argparse
from datetime import date
import json
from pathlib import Path
import re
from urllib.parse import urlparse
from urllib.request import urlopen

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
    categories = {row[0]: row for row in CATEGORIES}
    projects, seen = [], set()
    for story in stories:
        for key in ('id','headline','author','category','source','url'):
            if not isinstance(story.get(key), str) or not story[key].strip():
                raise ValueError('Missing story field: ' + key)
        if story['id'] in seen:
            raise ValueError('Duplicate story id: ' + story['id'])
        seen.add(story['id'])
        parsed = urlparse(story['url'])
        if parsed.scheme != 'https' or not parsed.hostname or parsed.username or parsed.password:
            raise ValueError('Unsafe story URL')
        category, label, icon, color = categories[story['category']]
        source = SOURCES[story['source']]
        published = story.get('date') or 'Date not listed'
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
        categories=[dict(id=i,label=l,icon=s,color=c) for i,l,s,c in CATEGORIES], projects=projects)

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--revision', required=True)
    args=parser.parse_args()
    if not re.fullmatch(r'[0-9a-f]{40}', args.revision):
        parser.error('Use a full lowercase commit SHA from NousResearch/hermes-agent')
    url=f'https://raw.githubusercontent.com/NousResearch/hermes-agent/{args.revision}/website/src/data/userStories.json'
    with urlopen(url,timeout=30) as response:
        stories=json.load(response)
    data=convert(stories,args.revision)
    dest=Path(__file__).resolve().parents[1]/'dashboard/community.json'
    dest.write_text(json.dumps(data,indent=2,ensure_ascii=False)+'\n')
    print(f'Imported {len(data["projects"])} official-docs stories into {dest.name}')
