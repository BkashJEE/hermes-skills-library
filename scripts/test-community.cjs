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
  ctx: { rest() { throw new Error('Backend unavailable'); } }, onSection() {}
}));
assert.ok(html.includes(COMMUNITY_DIRECTORY.projects.length + ' use cases'));
for (const project of COMMUNITY_DIRECTORY.projects) {
  assert.ok(html.includes(project.url.replaceAll('&', '&amp;').replaceAll('\"', '&quot;')), 'Missing project link: ' + project.id);
}
assert.ok(!html.includes('Loading community projects'));
console.log('Community without backend: PASS');
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
