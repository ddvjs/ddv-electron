module.exports = createMainWindow
const {BrowserWindow} = require('electron')
const winURL = `ddvelectron://manage.sicmouse.com/admin`

let mainWindow = null

// 创建主窗口
function createMainWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)
  // mainWindow.loadURL('http://manage.sicmouse.com')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

createMainWindow.isOpen = isOpen

function isOpen () {
  return mainWindow !== null
}
