
var request = require('request');
var url="https://music.2hakeji.com/findmusic";
var requestData={
    keyword: '周杰伦',
    page: 1,
    pagesize: 30
};
 
// var options = {
//     url: url,
//     type: 'post',
//     form: {
//         keyword: '周杰伦',
//         page: 1,
//         pagesize: 30
//     },
//     headers: {
//         'Accept': '*/*',
//         'Accept-Encoding': 'gzip, deflate, br',
//         'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7',
//         'Connection': 'keep-alive',
//         'Content-Length': 54,
//         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//         'Cookie': 'Hm_lvt_109607fa33d956dfffa542fb4e594413=1592793580; Hm_lpvt_109607fa33d956dfffa542fb4e594413=1592810705',
//         'Host': 'music.2hakeji.com',
//         'Origin': 'https://music.2hakeji.com',
//         'Referer': 'https://music.2hakeji.com/',
//         'Sec-Fetch-Dest': 'empty',
//         'Sec-Fetch-Mode': 'cors',
//         'Sec-Fetch-Site': 'same-origin',
//         'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
//         'X-Requested-With':' XMLHttpRequest'
//     },
// }

// function callback(error, response, body) {
//     console.log(error)
//     if (!error && response.statusCode == 200) {
//         var info = JSON.parse(body);
//         console.log(info.stargazers_count + " Stars");
//         console.log(info.forks_count + " Forks");
//     } else {
//         console.log('error')
//     }
// }

// request(options, callback);


// request.post({url:url, form:{keyword:'As+I+Believe', page: 1, pagesize: 30}}, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(response)
//     } else {
//         console.log('error')
//     }
// })

httprequest(url,requestData);
function httprequest(url,data){
    request({
        url: url,
        method: "POST",
        json: true,
        proxy: 'http://lys1848:lz950814.@proxy.h3c.com:8080',
        headers: {
            "content-type": "application/json",
        },
        form: requestData
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body) // 请求成功的处理逻辑
        } else {
            console.log('error')
        }
    });
}

// request('http://47.75.195.199/NodeApi/test.json', function (error, response, data) {
//   //如果请求成功则打印数据 否则显示错误信息
//   if (!error && response.statusCode == 200) {
//     console.log(data);
//   }else {
//     console.log(error);
//     console.log(response.statusCode);
//   }
// });