module.exports = ddvelectron

// 协议模块
const {protocol} = require('electron')
// Nuxt模块
const getNuxt = require('./getNuxt')
// 文件模块
const fs = require('fs')
// 路径模块
const path = require('path')
// 流模块
const {PassThrough} = require('stream')
// 注册 ddvelectron 为标准schemes
protocol.registerStandardSchemes(['ddvelectron'], {
  secure: true
})
Object.assign(ddvelectron, {
  // 初始化
  init () {
    // 获取nuxt
    return getNuxt()
    .then(() => {

    })
  },
  // 注册
  register () {
    protocol.registerServiceWorkerSchemes(['ddvelectron'])
    protocol.registerStreamProtocol('ddvelectron', ddvelectron, (error) => {
      if (error) console.error('Failed to register protocol')
    })
  },
  // 监听
  handler (request, callback) {
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
  }
})
function ddvelectron (request, callback) {
  return ddvelectron.handler.apply(ddvelectron, arguments)
}
