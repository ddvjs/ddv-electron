module.exports = createMainWindow

const {protocol, BrowserWindow} = require('electron')
const getNuxt = require('./getNuxt')
const fs = require('fs')
const path = require('path')
const {PassThrough} = require('stream')
const winURL = `ddvelectron://manage.sicmouse.com/admin`

let mainWindow = null

function createMainWindow () {
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

    getNuxt().then(nuxt => nuxt.renderRoute(url, context))
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
          }, 1)
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

createMainWindow.isOpen = isOpen

function isOpen () {
  return mainWindow !== null
}
