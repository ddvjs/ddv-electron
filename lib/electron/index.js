const {app} = require('electron')
// 创建主窗口模块
const createMainWindow = require('./createMainWindow')
const devDebug = require('./devDebug')
const production = require('./production')
// ddvelectron自定义协议模块
const ddvelectron = require('./ddvelectron')
// process.title = 'ddvElectronIndex'

// 调试模式下的模块初始化
devDebug.init()
// 产品模式下的模块初始化
production.init()
// 初始化 ddvelectron 协议
ddvelectron.init()
// 在初始化app完毕的时候
app.on('ready', () => {
  // 注册
  ddvelectron.register()
  // 调试模式下的模块app载入完成的模块
  devDebug.initByAppReady()
  // 产品模式下的模块app载入完成的模块
  production.initByAppReady()
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
