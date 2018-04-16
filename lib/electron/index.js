const {app, protocol, BrowserWindow} = require('electron')

const {Nuxt, Builder} = require('nuxt')
const fs = require('fs')
const path = require('path')
const argv = require('../argv')
const config = require('../config')
try {
  Object.assign(argv, JSON.parse(process.env.DDV_ELECTRON_ARGV || '{}'))
} catch (e) {}
let nuxt = null
console.log(88)
console.log(88232323, argv)
process.exit(0);
console.log(argv)// ;process.exit(0);

function getNuxt (argument) {
  if (nuxt) {
    return Promise.resolve(nuxt)
  }
  return config('/Users/hua/Documents/Project/cdn/sicmouse-admin-cdn/nuxt.config.js', { help: false,
    analyze: false,
    port: 3000,
    'is-argv': false,
    cmd: 'dev',
    dev: true,
    rootDir: '/Users/hua/Documents/Project/cdn/sicmouse-admin-cdn',
    configFile: '/Users/hua/Documents/Project/cdn/sicmouse-admin-cdn/nuxt.config.js' })
  .then(options => {
    options.rootDir = '/Users/hua/Documents/Project/cdn/sicmouse-admin-cdn'
    options.dev = false
    nuxt = new Nuxt(options)
    // Build only in dev mode
    if (options.dev) {
      console.log(4444, 'dev')
      new Builder(nuxt).build()
      .catch((error) => {
        console.error(error)
        process.exit(1)
      })
    }

    console.log(45454)
    return nuxt
  })
}

// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
require('electron-debug')({ showDevTools: true })

// 提示安装vue调试工具 `vue-devtools`
app.on('ready', () => {
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err)
    })
})

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
/* const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html` */
// const winURL = `file://${__dirname}/dist/index.html`
// const winURL = `http://manage.sicmouse.com`
const winURL = `ddvelectron://manage.sicmouse.com/admin`

protocol.registerStandardSchemes(['ddvelectron'], {
  secure: true
})
const {PassThrough} = require('stream')

function createStream (text) {
  const rv = new PassThrough()  // PassThrough is also a Readable stream
  rv.push(text)
  rv.push(null)
  return rv
}

function createWindow () {
  protocol.registerStreamProtocol('ddvelectron', (request, callback) => {
    console.log('request.url', request.url)
    const url = request.url.substr('ddvelectron://manage.sicmouse.com'.length)
    console.log(44445555, url)
    const context = {}
    const res = {}
    if (url.substr(0, '/_nuxt/'.length) === '/_nuxt/') {
      const path1 = url.substr('/_nuxt/'.length)
      callback(fs.createReadStream(path.resolve('/Users/hua/Documents/Project/cdn/sicmouse-admin-cdn', '.nuxt/dist/', path1)))
      return
    }

    getNuxt().then(() => nuxt.renderRoute(url, context))
     // .then(result => this.nuxt.callHook('render:route', url, result, context).then(() => result))
      .then(({html, cspScriptSrcHashes, error, redirected, getPreloadFiles}) => {
        console.log(4444444444455, redirected, error)
        console.log(9999787)
        if (redirected) {
          console.log(444)
        } else if (error) {
          res.statusCode = context.nuxt.error.statusCode || 500
          console.log(error.message)
        } else {
          const rv = new PassThrough()  // PassThrough is also a Readable stream
          setTimeout(() => {
            console.log(42222233112)
            rv.push(html)
            rv.push(null)
          },1)
          Object.assign(res, {
            data: rv,
            statusCode: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Content-Length': Buffer.byteLength(html)
            }
          })
        }
        callback(res)
            console.log(42222233111)
        // console.log(html)
        // console.log(error)
        // `html` will be always a string

        // `error` not null when the error layout is displayed, the error format is:
        // { statusCode: 500, message: 'My error message' }

        // `redirected` is not `false` when `redirect()` has been used in `data()` or `fetch()`
        // { path: '/other-path', query: {}, status: 302 }
      })

    // callback({path: path.normalize(`${__dirname}/${url}`)})
  }, (error) => {
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

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
