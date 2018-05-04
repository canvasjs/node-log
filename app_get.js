var http = require('http');
var url = require('url');
var fs = require("fs");
var qs = require('querystring');
var dataTime = require('./dataTime');

/**返回404*/
function resDefault(res, pathname) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    console.log('请求', pathname, '返回404');
    res.end('not 404');
}

/**记录日志*/
function logWrite(req, res) {
    var arg = url.parse(req.url).query;
    var __data = qs.parse(arg), __content = __data,
        __time = dataTime.dataTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss');
    try {
        __content = JSON.parse(__data)
    } catch (e) {
        __content = qs.parse(arg);
    }
    var log = {
        ip: getClientIp(req),
        time: __time,
        content: __content
    };
    fs.appendFile('message.txt', JSON.stringify(log) + '\n', function (err) {
        if (err) throw err;
        console.log(__time, '记录日志成功');
    });
    res.end();
}

/**读取日志文件*/
function logJson(res, req) {
    var arg = url.parse(req.url).query;
    var __data = qs.parse(arg);
    res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    var data = fs.readFileSync('./message.txt', 'utf8');
    console.log('读取日志文件成功');
    res.end(data)
}



http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var pathname = url.parse(req.url).pathname;
    if (pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('hello----' + getClientIp(req));
    } else if (pathname === '/favicon.ico') {
        return;
    } else if (pathname === '/log') {
        /**其他请求都 就做为 日志记录了*/
        logWrite(req, res)
    } else if (pathname === '/list') {
        /**返回日志json*/
        logJson(res, req);
    } else {
        resDefault(res, pathname)
    }


}).listen(13377, '127.0.0.1');
console.log('server 启动成功');


/**获取ip*/
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
};

