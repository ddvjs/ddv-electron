const {app} = require('electron')
// 创建主窗口模块
const createMainWindow = require('./createMainWindow')
// 自动升级模块
const autoUpdater = require('./autoUpdater')
// 参数模块
const argv = require('./argv')
// ddvelectron自定义协议模块
const ddvelectron = require('./ddvelectron')

// 初始化 ddvelectron 协议
ddvelectron.init()

// 提示安装vue调试工具 `vue-devtools`
app.on('ready', () => {
  // 调试模式
  if (argv.dev) {
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.VUEJS_DEVTOOLS)
      .then(() => {})
      .catch(err => {
        console.log('Unable to install `vue-devtools`: \n', err)
      })
  // 产品模式
  } else {
    // 检测升级
    // autoUpdater.checkForUpdates()
  }
  // 创建主窗口
  createMainWindow()
})

// 所有窗口都关闭的时候
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!createMainWindow.isOpen()) {
    // 创建主窗口
    createMainWindow()
  }
})
