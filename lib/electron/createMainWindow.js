module.exports = createMainWindow
const ddvelectron = require('./ddvelectron')
const {protocol, BrowserWindow} = require('electron')
const winURL = `ddvelectron://manage.sicmouse.com/admin`

let mainWindow = null

function createMainWindow () {
  protocol.registerStreamProtocol('ddvelectron', ddvelectron, (error) => {
    if (error) console.error('Failed to register protocol')
  })

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
