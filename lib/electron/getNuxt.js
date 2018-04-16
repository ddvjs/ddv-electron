module.exports = getNuxt

const argv = require('../argv')
const config = require('../config')
const logger = require('../logger')
const {Nuxt, Builder} = require('nuxt')
let nuxt = null

function getNuxt () {
  if (nuxt) {
    return Promise.resolve(nuxt)
  }
  return config(argv['config-file'], argv)
  .then(options => {
    logger.log('[ddv] get config done')
    nuxt = new Nuxt(options)
    // Build only in dev mode
    if (options.dev) {
      logger.log('[nuxt] Building start')
      return new Builder(nuxt).build()
      .then(() => {
        logger.log('[nuxt] Building done')
      })
    }
  })
  .then(() => {
    logger.log('[nuxt] get nuxt done')
    return nuxt
  })
  .catch((err) => {
    logger.error(err)
    process.exit(1)
  })
}