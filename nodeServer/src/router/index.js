const Router = require('koa-router')
const { getSonglist, getSongDetail } = require('../controller/song')

let page = new Router()

page.get('/song/list', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSonglist(req_query)
	ctx.body = {
		code: 200,
		message: 'success',
		data
	}
}).get('/song/detail', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSongDetail(req_query)
	ctx.body = { data }
})

let router = new Router()

router.use('/api', page.routes(), page.allowedMethods())

module.exports = router
