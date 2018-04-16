const production = module.exports = Object.create(null)
// 自动升级模块
const autoUpdater = require('./autoUpdater')

Object.assign(production, {
  init () {

  },
  initByAppReady () {
    // 检测升级
    0 && autoUpdater.checkForUpdates()
  }
})
