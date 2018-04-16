const {app} = require('electron')
const createMainWindow = require('./createMainWindow')
const autoUpdater = require('./autoUpdater')
const argv = require('./argv')
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
    autoUpdater.checkForUpdates()
  }
  // 创建主窗口
  createMainWindow()
})

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
