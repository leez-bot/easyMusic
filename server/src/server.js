
var request = require('request');
// var url="https://music.2hakeji.com/findmusic";
// var requestData={
//     keyword: '周杰伦',
//     page: 1,
//     pagesize: 30
// };

// httprequest(url,requestData);
// function httprequest(url,data){
//     request({
//         url: url,
//         method: "POST",
//         json: true,
//         proxy: 'http://lys1848:lz950814.@proxy.h3c.com:8080',
//         headers: {
//             "content-type": "application/json",
//         },
//         form: requestData
//     }, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body) // 请求成功的处理逻辑
//         } else {
//             console.log('error')
//         }
//     });
// }

request({
    url: 'https://u.y.qq.com/cgi-bin/musics.fcg',
    method: 'GET',
    proxy: 'http://lys1848:lz950814.@proxy.h3c.com:8080',
    headers: {
        "content-type": "application/json",
        'origin': 'https://y.qq.com',
        'referer': 'https://y.qq.com/',
        'sec-fetch-dest': 'empty'
    },
    data: {
        g_tk: 1373488009,
        sign: 'zzaub05muu8m44ff15c4441255ee9ef959d8dacccc3f88',
        loginUin: 0,
        hostUin: 0,
        format: 'json',
        inCharset: 'utf8',
        outCharset: 'utf-8',
        notice: 0,
        platform: 'yqq.json',
        needNewCode: 0,
    }
}, function (error, response, data) {
  //如果请求成功则打印数据 否则显示错误信息
  if (!error && response.statusCode == 200) {
    console.log('data:', data);
  }else {
    console.log('error:', error);
  }
});