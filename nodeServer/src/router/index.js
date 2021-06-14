const Router = require('koa-router')
const {
	getSonglist, getSongDetail, getArtistSongs, getAlbumSongs,
	getSingers, getSongLrc
} = require('../controller/song')

let page = new Router()

page.get('/song/list', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSonglist(req_query)
	ctx.body = { data }
}).get('/song/detail', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSongDetail(req_query)
	ctx.body = { data }
}).get('/song/singerSongs', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getArtistSongs(req_query)
	ctx.body = { data }
}).get('/song/albumSongs', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getAlbumSongs(req_query)
	ctx.body = { data }
}).get('/singers', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSingers(req_query)
	ctx.body = { data }
}).get('/lrc', async (ctx) => {
	let request = ctx.request
	let req_query = request.query
	let data = await getSongLrc(req_query)
	ctx.body = { data }
})

let router = new Router()

router.use('/api', page.routes(), page.allowedMethods())

module.exports = router
