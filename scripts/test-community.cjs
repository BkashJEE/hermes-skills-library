// Render the real Community component with no working backend (Desktop upgrade regression).
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'desktop/plugin.js'), 'utf8');
const test = `
import { renderToString } from 'react-dom/server';
import assert from 'node:assert/strict';
const html = renderToString(h(Community, {
  ctx: { preview: true, rest() { throw new Error('Backend unavailable'); } }, onSection() {}, target: 'ceo'
}));
assert.ok(html.includes(COMMUNITY_DIRECTORY.projects.length + ' use cases'));
assert.equal((html.match(/class="card community-card"/g) || []).length, COMMUNITY_DIRECTORY.projects.length);
assert.ok(html.includes('What people built'));
assert.ok(html.includes('Preview'));
assert.ok(html.includes('Recreate'));
assert.ok(html.includes('Build this use case with ceo'));
assert.ok(html.includes('Connecting apps'));
assert.equal(storyVideoThumbnail('https://www.youtube.com/watch?v=CwPUOVUdApE'), 'https://i.ytimg.com/vi/CwPUOVUdApE/hqdefault.jpg');
assert.equal(storyVideoThumbnail('https://youtube.com.evil.example/watch?v=CwPUOVUdApE'), '');
assert.equal(storyVideoThumbnail('https://youtu.be/../../secret'), '');
const grouped = groupStoriesByAuthor([
  { id: 'one', author: 'Builder B' },
  { id: 'two', author: 'Builder A' },
  { id: 'three', author: 'Builder B' },
]);
assert.deepEqual(grouped.map(group => [group.author, group.items.map(item => item.id)]), [
  ['Builder B', ['one', 'three']],
  ['Builder A', ['two']],
]);
assert.equal(cardAuthor({ authors: ['Jane Doe'], author_kind: 'author' }), 'by Jane Doe');
assert.equal(cardAuthor({ authors: [], author_kind: 'unknown' }), 'Creator not listed');
const prompt = guidedBuildPrompt(COMMUNITY_DIRECTORY.projects[0], '/tmp/example-workspace');
assert.ok(prompt.includes(COMMUNITY_DIRECTORY.projects[0].name));
assert.ok(prompt.includes('/tmp/example-workspace'));
assert.ok(prompt.includes('every permission or credential needed'));
assert.ok(prompt.includes('likely failure modes'));
assert.ok(prompt.includes('Wait for my approval'));
assert.ok(prompt.includes('read-only inspection'));
assert.ok(prompt.includes('closest safe recreation'));
assert.ok(guidedBuildTitle(COMMUNITY_DIRECTORY.projects[0]).startsWith('Build: '));
assert.ok(!html.includes('Loading community projects'));
const calls = [];
host.state.cwd = { get: () => '/work/current' };
host.retainProfile = async profile => { calls.push(['retain', profile]); return () => calls.push(['release']); };
host.requestProfile = async (profile, method, params, timeout, options) => {
  calls.push([method, profile, params, options]);
  if (method === 'session.create') return { session_id: 'runtime-1', stored_session_id: 'stored-1' };
  return {};
};
host.openSession = async (stored, options) => calls.push(['open', stored, options]);
launchGuidedBuild(COMMUNITY_DIRECTORY.projects[0], 'ceo').then(result => {
  assert.equal(result.runtime, 'runtime-1');
  assert.deepEqual(calls.map(call => call[0]), ['retain', 'session.create', 'session.title', 'open', 'prompt.submit', 'release']);
  assert.equal(calls[1][2].cwd, '/work/current');
  assert.equal(calls[1][3].spawnPriority, 'foreground');
  assert.ok(calls[4][2].text.includes('Wait for my approval'));
  console.log('Community without backend and guided launch: PASS');
}).catch(error => { console.error(error); process.exitCode = 1; });
`;
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'hsl-community-test-'));
try {
  const outfile = path.join(directory, 'test.cjs');
  esbuild.buildSync({
    stdin: { contents: source + test, resolveDir: root, sourcefile: 'community-regression.js' },
    bundle: true, platform: 'node', format: 'cjs', outfile,
    alias: { '@hermes/plugin-sdk': path.join(root, 'preview/sdk.js') },
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  require(outfile);
} finally {
  fs.rmSync(directory, { recursive: true, force: true });
}
