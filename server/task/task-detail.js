const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Product = mongoose.model('Product')

;(async () => {
  const script = resolve(__dirname, '../crawler/detail')
  const child = cp.fork(script, [])

  let invoked = false

  child.on('data', err => {
    if(invoked) return
    invoked = true
    console.log(err)
  })

  child.on('error', code => {
    if(invoked) return
    invoked = false
    let err = code === 0 ? null : new Error('exit code' + code)

    console.log(err)
  })

  child.on('message', data => {
    let result = data.result
    console.log(data)
  })
})()