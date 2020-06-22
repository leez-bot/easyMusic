const path = require('path')

module.exports = {
    publicPath: './', // 文件引用路径设置为相对路径
    productionSourceMap: false, // 开发环境打包时保留sourceMap,生产环境去除
    assetsDir: 'resource', // 打包生成的静态资源文件目录
    devServer: {
        proxy: {
            // '/': {
            //     target: 'https://music.2hakeji.com'
            // },
            '/': {
                target: 'localhost:3000'
            },
        },
        before(app) {
            require('mocker-api')(app, path.resolve('./mock/index.js'))
        }
    }
}