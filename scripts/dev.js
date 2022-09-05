const { join } = require('node:path')
const chokidar = require('chokidar')
const build = require('./build')

let isRebuilding = false
let rebuildQueued = false

function doRebuild() {
  isRebuilding = true

  return build().then(([, buildTime]) => {

    console.log(`Rebuilt in ${+buildTime.toFixed(3)}ms`)

    if (rebuildQueued) {
      console.log('\nChanged detected while building, rebuilding...')

      rebuildQueued = false
      return doRebuild()
    }
  }).catch(error => {
    isRebuilding = false
    console.error('Could not rebuild', { cause: error })
  })
}

chokidar.watch(join(__dirname, '../src'), {
  ignoreInitial: true,
}).on('all', () => {
  if (isRebuilding) return rebuildQueued = true

  console.log('\nChanges detected, rebuilding...')
  doRebuild()
})

console.log('Watching "src" for file changes...')
