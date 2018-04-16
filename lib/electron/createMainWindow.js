module.exports = createMainWindow
const {BrowserWindow} = require('electron')
const winURL = `ddvelectron://manage.sicmouse.com/admin`

// 窗口句柄
let mainWindow = null

// 创建主窗口
function createMainWindow () {
  // 实例化初始化一个窗口
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })
  // 加载窗口地址
  mainWindow.loadURL(winURL)

  // 在窗口关闭的时候
  mainWindow.on('closed', () => {
    // 清理句柄
    mainWindow = null
  })
}

createMainWindow.isOpen = isOpen

function isOpen () {
  return mainWindow !== null
}
