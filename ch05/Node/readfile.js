const fs = require("fs");

fs.readFile('file1', function (err, file) {
  console.log('文件1的内容: ' + file);
});

fs.readFile('file2', function (err, file) {
  console.log('文件2的内容: ' + file);
});

console.log('读取文件1和文件2');