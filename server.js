var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var path = require('path');
var app = express();
var options = {
  key: fs.readFileSync('./key.pem') || process.env['KEY'],
  cert: fs.readFileSync('./cert.pem') || process.env['CERT'],
  requestCert: false,
  rejectUnauthorized: false
};
var server = https.createServer(options, app).listen(443);
var io = require('socket.io')(server);

app.use('/files', express.static(path.join(__dirname + '/src')));
app.get('/', function(req, res){
  res.sendFile('index.html', {root: __dirname })
});

io.on('connection', function (socket) {
  socket.emit('status', { code: 'Connected to server.' });
  socket.on('raw data', function (data) {

  });
});
