var PORT = 3000;//定义端口号
var tatgetPATH='https://music.2hakeji.com/'//目标服务器地址
var http = require('http'); //引入http模块
var url=require('url');  //引入url模块
var fs=require('fs');  //引入文件模块
var mine=require('./fileFormat').types;  //文件格式字典
var path=require('path'); //引入path模块
var httpProxy = require('http-proxy');  //跨域代理中间件

var proxy = httpProxy.createProxyServer({
    target: tatgetPATH,   //接口地址
    toProxy: 'http://lys1848:lz950814.@proxy.h3c.com:8080',
    // 下面的设置用于https
    // ssl: {
    //     key: fs.readFileSync('server_decrypt.key', 'utf8'),
    //     cert: fs.readFileSync('server.crt', 'utf8')
    // },
    // secure: false
});

var server = http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    //访问根目录时改为指向首页文件
    if(pathname=='/'){
        pathname='index.html' 
    }
     // 指定根目录
    var realPath = path.join("./ROOT", pathname);

    var ext = path.extname(realPath);
    ext = ext ? ext.slice(1) : 'unknown';

    //判断如果是api接口访问，则通过proxy转发
    if(pathname.indexOf("./ROOT") > 0){
        // console.log('发起请求：',pathname)
        proxy.web(request, response);
        return;
    }

    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });
                    response.end(err);
                } else {
                    var contentType = mine[ext] || "text/plain";
                    response.writeHead(200, {
                        'Content-Type': contentType
                    });
                    response.write(file, "binary");
                    response.end();
                }
            });
        }
    });
});
server.listen(PORT);

//代理服务执行错误的监听
proxy.on('error', function(err, req, res){
    res.writeHead(500, {
        'content-type': 'text/plain'
    });
    console.log(err);
    res.end('Something went wrong. And we are reporting a custom error message.');
});
console.log("Server runing at port: " + PORT + "."+tatgetPATH);
