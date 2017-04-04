var md5 = require('md5');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var mongoose = require('mongoose');
app.use('/static', express.static('static'))
var Schema = new mongoose.Schema({
  key: String,
  value: String,
  times: Number,
});

var mongolabUri = process.env.MONDODB_URI;
mongoose.connect(mongolabUri, function (error) {
    if (error) console.error(error);
    else console.log('mongo connected');
});

var Keys = mongoose.model('Keys', Schema);

app.set('port', (process.env.PORT || 5000));

server.listen(app.get('port'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  function encrypt(obj, callback) {
    var value = md5(obj);
    var keys = new Keys();
    keys.id = keys._id;
    keys.key = obj;
    keys.value = value;

    keys.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        io.to(socket.id).emit('encrypted', {status:true, response:value, request: obj});
        callback(value);
      }
    });
  }
  socket.on('encrypt', function (obj) {
    Keys.findOne({ 'key': obj }, function (err, key) {
      if (err) {
        // encrypt(obj, function(value) {
        //     console.log(err, "Fakat ürettim.");
        // });
        console.log(err);
      } else {
        var value = "";
        if (!key) {
          encrypt(obj, function(value) {
            console.log("Key boş geldi, yeni ürettim.");
          });
        } else {
          value = key.value;
          io.to(socket.id).emit('encrypted', {status:true, response:value, request: obj});
        }
      }
    })
  })

  socket.on('decrypt' ,function (obj) {
    Keys.findOne({ 'value': obj }, function (err, key) {
      if (err) {
        console.log(err);
      } else {
        if (key) {
          io.to(socket.id).emit('decrypted', {status:true, response:key.key, request: obj});
        } else {
          io.to(socket.id).emit('decrypted', {status:false, response:'Nothing yet..'});
        }
      }
    })
  })
});
