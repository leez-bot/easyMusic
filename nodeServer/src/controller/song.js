const { songTargetUrl } = require('../conf/url')
const request = require('request')

const requestWrapper = config => new Promise((resolve, reject) => {
  request({
    ...config,
    // proxy: 'http://lys1848:lz950814.@proxy.h3c.com:8080',
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
    url: `${songTargetUrl}/findmusic`,
    method: 'POST',
    form: data,
  })
  return JSON.parse(list)
}


const getSongDetail = async (data) => {
  let song = await requestWrapper({
    url: `${songTargetUrl}/musicdetails`,
    method: 'POST',
    form: data,
  })
  return JSON.parse(song)
}

module.exports = {
  getSonglist,
  getSongDetail
}