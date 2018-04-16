const {app, protocol} = require('electron')
const createMainWindow = require('./createMainWindow')
const autoUpdater = require('electron-updater')

const argv = require('../argv')
try {
  Object.assign(argv, JSON.parse(process.env.DDV_ELECTRON_ARGV || '{}'))
  // 调试模式
  process.env.NODE_ENV = argv.dev ? 'development' : 'production'
} catch (e) {}

if (argv.dev) {
  // 如果是调试模式 - 开启调试工具
  // Install `electron-debug` with `devtron`
  require('electron-debug')({ showDevTools: true })
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

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

protocol.registerStandardSchemes(['ddvelectron'], {
  secure: true
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
