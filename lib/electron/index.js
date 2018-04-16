const {app} = require('electron')
// 创建主窗口模块
const createMainWindow = require('./createMainWindow')
// 调试模式下的模块
const devDebug = require('./devDebug')
// 产品模式下的模块
const production = require('./production')
// ddvelectron自定义schemes模块
const ddvelectron = require('./ddvelectron')

// 调试模式下的模块初始化
devDebug.init()
// 产品模式下的模块初始化
production.init()
// 初始化 ddvelectron 协议
ddvelectron.init()

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', () => {
  // ddvelectron自定义schemes协议注册
  ddvelectron.register()
  // 调试模式下的模块app载入完成的模块
  devDebug.initByAppReady()
  // 产品模式下的模块app载入完成的模块
  production.initByAppReady()
  // 创建主窗口
  createMainWindow()
})

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 非苹果系统
  if (process.platform !== 'darwin') {
    // 退出app
    app.quit()
  }
})

// 在macOS上，当单击dock图标并且没有其他窗口打开时，
// 通常在应用程序中重新创建一个窗口。
app.on('activate', () => {
  // 没有窗口
  if (!createMainWindow.isOpen()) {
    // 创建主窗口
    createMainWindow()
  }
})
