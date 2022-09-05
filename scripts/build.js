const { build } = require('esbuild')

const NODE_VERSION = '14'
const CHROME_VERSION = '91'

const commonOptions = {
  bundle: true,
  minify: true,
  sourcemap: true,
}

function buildReplugged() {
  const buildStart = process.hrtime.bigint()
  return Promise.all([
    build({
      ...commonOptions,
      entryPoints: ['./src/main'],
      platform: 'node',
      target: `node${NODE_VERSION}`,
      outfile: 'dist/main.js',
      external: ['electron'],
    }),
    build({
      ...commonOptions,
      entryPoints: ['./src/preload'],
      platform: 'node',
      target: [`node${NODE_VERSION}`, `chrome${CHROME_VERSION}`],
      outfile: 'dist/preload.js',
      external: ['electron'],
    }),
    build({
      ...commonOptions,
      entryPoints: ['./src/renderer'],
      platform: 'browser',
      target: `chrome${CHROME_VERSION}`,
      outfile: 'dist/renderer.js',
    }),
  ]).then(results => {
    const durationMs = Number(process.hrtime.bigint() - buildStart) / 1e6
    return [results, durationMs]
  })
}

module.exports = buildReplugged

if (require.main === module) {
  buildReplugged().then(([, buildMs]) => {
    console.log(`Done! Built in ${+buildMs.toFixed(3)}ms`)
  }).catch(error => {
    console.error('Could not build replugged', { cause: error })
  })
}
