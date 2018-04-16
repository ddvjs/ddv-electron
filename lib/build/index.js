module.exports = buildElectron
const { Nuxt, Builder } = require('nuxt')
const logger = require('../logger')
const config = require('../config')
const argv = require('../argv')

function buildElectron () {
  config(argv.configFile, argv).then(options => {
    const nuxt = new Nuxt(options)
    const builder = new Builder(nuxt)
    builder.build()
    .then(() => {
      logger.log('[nuxt] Building done') // eslint-disable-line no-console
    })
    .catch((err) => {
      logger.error(err) // eslint-disable-line no-console
      process.exit(1)
    })
  })
}
