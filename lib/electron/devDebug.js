const devDebug = module.exports = Object.create(null)
// 参数模块
const argv = require('./argv')

Object.assign(devDebug, {
  isDebug () {
    return argv.dev
  },
  init () {
    if (1 || this.isDebug()) {
      // 如果是调试模式 - 开启调试工具
      // Install `electron-debug` with `devtron`
      require('electron-debug')({ showDevTools: true })
    }
  },
  initByAppReady () {
    if (!this.isDebug()) {
      return
    }
    // 提示安装vue调试工具 `vue-devtools`
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then(() => {})
      .catch(err => {
        console.log('Unable to install `vue-devtools`: \n', err)
      })
  }
})
