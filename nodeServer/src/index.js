const Koa = require('koa')
const app = new Koa()
const router = require('./router/index')

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
	console.log('server is running in 3000')
})
