module.exports = runElectronProcess

const path = require('path')
const config = require('../config')
const getEnvVars = require('./getEnvVars')
const electron = require('electron')
const { spawn } = require('child_process')
let electronProcess = null
let manualRestart = false
const env = {}
env.npm_config_argv = process.env.npm_config_argv
env.NODE_ENV = process.env.NODE_ENV
function runElectronProcess () {
console.log(99999, process.env.npm_config_argv, electron, process.env)
  electronProcess = spawn(electron,
    [
      '--inspect=5858',
      path.join(__dirname, '../../')
    ],
    {
      stdio: 'inherit',
      env:process.env
    }
  )

  process.on('SIGTERM', function () {
    return electronProcess.kill('SIGTERM')
  })
  process.on('SIGINT', function () {
    return electronProcess.kill('SIGINT')
  })
  process.on('SIGBREAK', function () {
    return electronProcess.kill('SIGBREAK')
  })
  process.on('SIGHUP', function () {
    return electronProcess.kill('SIGHUP')
  })
  electronProcess.on('exit', process.exit)
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}
