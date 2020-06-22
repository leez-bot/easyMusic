// import Mock from 'mockjs'
// import {
//   getGradeList
// } from './mockTest'

// // 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
// Mock.setup({
//   timeout: 1000
// })

// // 正则匹配接口名，调用相应mock函数
// Mock.mock(/\/master\/main/, getGradeList)

// export default Mock

const testMock = require('./mockTest');

module.exports = {
  ...testMock,
};
