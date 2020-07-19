const { songTargetUrl } = require('../conf/url')
const { proxyUrl } = require('../conf/proxy')
const request = require('request')

const requestWrapper = config => new Promise((resolve, reject) => {
  request({
    ...config,
    proxy: proxyUrl,
  }, (err, res, body) => {
    if (err) {
      reject(err)
    } else {
      resolve(body)
    }
  })
})

const getSonglist = async (data) => {
  const keyword = encodeURI(data.keyword)
  const url = `${songTargetUrl}/api/www/search/searchMusicBykeyWord?key=${keyword}&pn=${data.page}&rn=${data.pagesize}`
  let res = await requestWrapper({
    url,
    method: 'GET',
    headers: {
      csrf: 'AAAAAAAAAAA',
      Referer: 'http://kuwo.cn/',
      Cookie: 'kw_token=AAAAAAAAAAA',
    },
  })
  return JSON.parse(res)
}

const getSongDetail = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/url?rid=${data.rid}&format=mp3&type=convert_url3&from=web`,
    method: 'GET'
  })
  return JSON.parse(song)
}

module.exports = {
  getSonglist,
  getSongDetail
}