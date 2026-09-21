// Keep a self-contained Desktop entry: Community must work without a backend.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const file = path.join(root, 'desktop/plugin.js');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'dashboard/community.json'), 'utf8'));
const start = '// BEGIN GENERATED COMMUNITY DIRECTORY';
const end = '// END GENERATED COMMUNITY DIRECTORY';
const source = fs.readFileSync(file, 'utf8');
const first = source.indexOf(start);
const last = source.indexOf(end, first);
if (first < 0 || last < 0) throw new Error('Community directory markers are missing');
const block = start + '\nconst COMMUNITY_DIRECTORY = ' + JSON.stringify(catalog, null, 2) + ';\n' + end;
const updated = source.slice(0, first) + block + source.slice(last + end.length);
if (process.argv.includes('--check')) {
  if (updated !== source) throw new Error('Community directory is out of sync. Run npm run sync:community');
} else {
  fs.writeFileSync(file, updated);
}
