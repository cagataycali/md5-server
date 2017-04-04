# Md5 encrypt, decrypt in your host.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/cli-tool/md5-server)

# Endpoints (Socket.io)

You have to connect with socket io client.

And you have to enable session affinity in herokuapp
```
heroku features:enable http-session-affinity
```

```javascript
var socket = io.connect('https://yourapp.herokuapp.com');
socket.on('encrypted', function (data) {
  console.log( "encrypted", data.response)
});
socket.on('decrypted', function (data) {
  console.log( "decrypted", data.response)
});
// encrypt
socket.emit('encrypt', 'me');
// decrypt
socket.emit('decrypt', 'ab86a1e1ef70dff97959067b723c5c24');
```
