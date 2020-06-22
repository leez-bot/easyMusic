
var request = require('request');
var url="https://music.2hakeji.com/findmusic";
var requestData="keyword=As+I+Believe&page=1&pagesize=30";
 
var options = {
    url: url,
    type: 'post',
    form: {
        keyword: '周杰伦',
        page: 1,
        pagesize: 30
    },
    headers: {
        'Cookie': 'Hm_lvt_109607fa33d956dfffa542fb4e594413=1592793580; Hm_lpvt_109607fa33d956dfffa542fb4e594413=1592795131',
        'User-Agent': 'request',
        'Host': 'music.2hakeji.com',
        'Origin': 'https://music.2hakeji.com',
        'Referer': 'https://music.2hakeji.com/'
    },
}

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log(info.stargazers_count + " Stars");
        console.log(info.forks_count + " Forks");
    } else {
        console.log('error')
    }
}

request(options, callback);


// request.post({url:url, form:{keyword:'As+I+Believe', page: 1, pagesize: 30}}, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(response)
//     } else {
//         console.log('error')
//     }
// })

// httprequest(url,requestData);
// function httprequest(url,data){
//     request({
//         url: url,
//         method: "POST",
//         json: true,
//         headers: {
//             "content-type": "application/json",
//         },
//         body: requestData
//     }, function(error, response, body) {
//         if (!error && response.statusCode == 200) {
//             console.log(body) // 请求成功的处理逻辑
//         } else {
//             console.log('error')
//         }
//     });
// }

// request('http://47.75.195.199/NodeApi/test.json', function (error, response, data) {
//   //如果请求成功则打印数据 否则显示错误信息
//   if (!error && response.statusCode == 200) {
//     console.log(data);
//   }else {
//     console.log(error);
//     console.log(response.statusCode);
//   }
// });