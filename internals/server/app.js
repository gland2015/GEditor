var express = require('express');
const path = require('path');
var app = express();
const port = 8090;
app.use(express.static('./dist'));

app.get('*', function(req, res) {
  console.log('send 1');
  res.sendFile('./dist/index.html', {root: process.cwd()});
});

app.listen(port);
console.log('The server runs on localhost:' + port + '!');
