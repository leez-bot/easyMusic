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
  let list = await requestWrapper({
    url: 'https://music.2hakeji.com/findmusic',
    method: 'POST',
    form: data
    // url: `${songTargetUrl}/api/www/search/searchMusicBykeyWord`,
    // method: 'GET',
    // headers: {
    //   'Accept': 'application/json, text/plain',
    //   'Accept-Encoding': 'gzip, deflate',
    //   'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
    //   Cookie: '_ga=GA1.2.446881459.1592881475; _gid=GA1.2.30073796.1594171776; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1594175683,1594175685,1594175687,1594175689; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1594175689; kw_token=SP3AY09VTL; _gat=1',
    //   csrf: 'SP3AY09VTL',
    //   Host: 'www.kuwo.cn',
    //   'Proxy-Authorization': ' Basic bHlzMTg0ODpsejk1MDgxNC4=',
    //   'Proxy-Connection': 'keep-alive',
    //   Referer: 'http://www.kuwo.cn/search/list?key=%E5%B0%91%E5%B9%B4'
    // },
    // data: {
    //   key: data.keyword,
    //   pn: data.page,
    //   rn: data.pagesize,
    //   httpsStatus: 1,
    //   reqId: 'a576261952d86663ee288e2dc7242c6b'
    // },
  })
  return JSON.parse(list)
}


const getSongDetail = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/url?rid=${data.id}&format=mp3&response=url&type=convert_url3&br=512kmp3&from=web`,
    method: 'GET',
    // data: {
    //   rid: data.id,
    //   format: 'mp3',
    //   response: 'url',
    //   type: 'convert_url3',
    //   br: '512kmp3',
    //   from: 'web'
    // },
  })
  return JSON.parse(song)
}

module.exports = {
  getSonglist,
  getSongDetail
}