const { songTargetUrl, lrcTargetUrl } = require('../conf/url')
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
  const url = `${songTargetUrl}/api/www/search/searchMusicBykeyWord?key=${keyword}&pn=${data.page}&rn=${data.pagesize}`
  let res = await requestWrapper({
    url,
    method: 'GET',
    headers
  })
  return JSON.parse(res)
}

const getSongDetail = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/api/v1/www/music/playUrl?mid=${data.rid}&type=music&httpsStatus=1&reqId=88e40ac6705fe0f6e48eff22a7df8b87`,
    method: 'GET'
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