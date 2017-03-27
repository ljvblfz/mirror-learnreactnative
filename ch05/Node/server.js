// 载入http模块
const http = require('http');

http.createServer(function (req, res) {
  // HTTP状态值: 200, 内容类型: text/html
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<h1>Hello Node.js!</h1>');
  res.end('<p>The End</p>');
}).listen(8888);

console.log("HTTP server is running at http://127.0.0.1:8888/");