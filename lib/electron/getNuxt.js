module.exports = getNuxt

// 参数模块
const argv = require('./argv')
// 配置模块
const config = require('../config')
// 日志模块
const logger = require('../logger')
// Nuxt实例和Builder实例
const {Nuxt, Builder} = require('nuxt')
// 实例化后的Nuxt实例
let nuxt = null

// 获取一个Nuxt实例
function getNuxt () {
  if (nuxt) {
    // 如果有nuxt就直接返回
    return Promise.resolve(nuxt)
  }
  // 试图获取配置信息
  return config(argv['config-file'], argv)
  .then(options => {
    logger.log('[ddv] get config done')
    nuxt = new Nuxt(options)
    // 仅在开发模式下自动构建
    if (options.dev) {
      logger.log('[nuxt] Building start')
      // 开始构建
      return new Builder(nuxt).build()
      .then(() => {
        // 构建完毕
        logger.log('[nuxt] Building done')
      })
    }
  })
  .then(() => {
    logger.log('[nuxt] get nuxt done')
    // 返回nuxt实例
    return nuxt
  })
  .catch((err) => {
    // 显示错误
    logger.error(err)
    // 退出进程
    process.exit(1)
  })
}
