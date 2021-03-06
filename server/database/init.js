const mongoose = require('mongoose')
const { resolve } = require('path')
const db = 'mongodb://localhost/yanxuan'
const glob = require('glob')
mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema/', '**/*.js')).forEach(require)
}

exports.connect = () => {

  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      maxConnectTimes++
      if(maxConnectTimes < 3) {
        mongoose.connect(db)
      } else {
        throw new Error('数据库错了')
      }
    })
  
    mongoose.connection.on('error', err => {
      console.log(err)
      reject(err)
    })
  
    mongoose.connection.on('open', () => {
      resolve()
      console.log('db connect success')
    })
  })
}