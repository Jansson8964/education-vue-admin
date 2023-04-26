'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"',
 // BASE_API: '"http://localhost:8222"',//网关地址
  BASE_API: '"http://localhost:9001"',//网关地址
  OSS_PATH: '"https://guli-edu-20201.oss-cn-beijing.aliyuncs.com"'
})
