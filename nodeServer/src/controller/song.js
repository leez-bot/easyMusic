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
    // url: 'https://music.2hakeji.com/findmusic',
    // method: 'POST',
    // form: data
    url: `${songTargetUrl}/api/www/search/searchMusicBykeyWord`,
    method: 'GET',
    headers: {
      'Cookie': 'kw_token=CJRMBYSOXV8',
      'csrf': 'CJRMBYSOXV8',
      'Referer': 'http://www.kuwo.cn/search/list?key=%E5%91%A8%E6%9D%B0%E4%BC%A6'
    },
    data: {
      key: data.keyword,
      pn: data.page,
      rn: data.pagesize
    },
  })
  return JSON.parse(list)
}


const getSongDetail = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/url?rid=${data.id}&format=mp3&type=convert_url3&from=web`,
    method: 'GET'
  })
  return JSON.parse(song)
}

module.exports = {
  getSonglist,
  getSongDetail
}