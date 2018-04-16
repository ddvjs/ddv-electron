module.exports = build
const { Nuxt, Builder } = require('nuxt')
const logger = require('../logger')
const config = require('../config')
const argv = require('../argv')

function build () {
  return buildNuxt()
  .then(options => {
    return buildElectron()
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
}

// 编译nuxt
function buildElectron () {

}

// 编译nuxt
function buildNuxt () {
  return config(argv['config-file'], argv)
  .then(options => {
    logger.log('[ddv] get config done')
    return new Nuxt(options)
  })
  .then(nuxt => {
    logger.log('[nuxt] Building start')
    return new Builder(nuxt).build()
  })
  .then(() => {
    logger.log('[nuxt] Building done')
  })
}
