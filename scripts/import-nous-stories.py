"""Import public story metadata from a pinned revision of the official Nous docs.

Run: python scripts/import-nous-stories.py --revision <40-character commit SHA>
Then: npm run sync:community
Original post quotations are deliberately not copied. Attribution and links remain.
"""
import argparse
import json
from pathlib import Path
import re
import sys
from urllib.request import urlopen
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'dashboard'))
from stories import convert

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
