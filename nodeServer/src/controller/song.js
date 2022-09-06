const { songTargetUrl, lrcTargetUrl, detailUrl, searchUrl } = require('../conf/url')
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

const headers = {
  csrf: 'AAAAAAAAAAA',
  Referer: 'http://kuwo.cn/',
  Cookie: 'kw_token=AAAAAAAAAAA',
}

const getSonglist = async (data) => {
  const keyword = encodeURI(data.keyword)
  const url = `${searchUrl}/get/complex?word=${keyword}&pn=${data.page}&rn=${data.pagesize}`
  let res = await requestWrapper({
    url,
    method: 'GET',
    headers
  })
  return JSON.parse(res)
}

const getSongDetail = async (data) => {
  let song = await requestWrapper({
    // url: `${songTargetUrl}/api/v1/www/music/playUrl?mid=${data.rid}&type=music&httpsStatus=1&reqId=88e40ac6705fe0f6e48eff22a7df8b87`,
    url: `${detailUrl}/yy/index.php?r=play/getdata&hash=${data.hash}&dfid=&appid=1014&mid=&platid=4&album_id=${data.rid}`,
    method: 'GET',
    headers: {
      'authority': 'wwwapi.kugou.com',
      'cache-control': 'max-age=0',
      'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      'sec-ch-ua-mobile': '?0',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'sec-fetch-site': 'none',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      'sec-fetch-dest': 'document',
      'accept-language': 'zh-CN,zh;q=0.9',
      'cookie': 'kg_mid=e716270a861e829ff7bb30b0c2211bab;',
      'if-modified-since': 'Sat, 30 Oct 2021 12:39:08 GMT'
    }
  })
  return JSON.parse(song)
}

const getArtistSongs = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/api/www/artist/artistMusic?artistid=${data.artistid}&pn=${data.page}&rn=${data.pagesize}`,
    method: 'GET',
    headers
  })
  return JSON.parse(song)
}

const getAlbumSongs = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/api/www/album/albumInfo?albumId=${data.albumId}&pn=1&rn=100`,
    method: 'GET',
    headers
  })
  return JSON.parse(song)
}

const getSingers = async (data) => {
  let singers = await requestWrapper({
    url: `${songTargetUrl}/api/www/artist/artistInfo?pn=${data.page}&category=0&rn=1${data.pagesize}`,
    method: 'GET',
    headers
  })
  return JSON.parse(singers)
}

const getSongLrc = async (data) => {
  const res = await requestWrapper({
    url: `${lrcTargetUrl}/newh5/singles/songinfoandlrc?musicId=${data.songId}`,
    method: 'GET'
  })
  return JSON.parse(res)
}

module.exports = {
  getSonglist,
  getSongDetail,
  getArtistSongs,
  getAlbumSongs,
  getSingers,
  getSongLrc
}