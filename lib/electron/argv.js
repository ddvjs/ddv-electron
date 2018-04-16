const argv = module.exports = require('../argv')
try {
  Object.assign(argv, JSON.parse(process.env.DDV_ELECTRON_ARGV || '{}'))
  // 调试模式
  process.env.NODE_ENV = argv.dev ? 'development' : 'production'
} catch (e) {}
