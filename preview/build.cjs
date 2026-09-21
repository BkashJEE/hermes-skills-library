const path = require('node:path');
const esbuild = require('esbuild');
esbuild.buildSync({
  entryPoints: [path.join(__dirname, 'entry.js')],
  bundle: true,
  outfile: path.join(__dirname, 'bundle.js'),
  alias: { '@hermes/plugin-sdk': path.join(__dirname, 'sdk.js') },
  define: { 'process.env.NODE_ENV': '"production"' },
});
