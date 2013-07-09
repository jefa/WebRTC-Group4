var express = require('express')
  , http 	= require('http')
  , path  	= require('path')
  , io 			= require('socket.io');

var app = express();
server = http.createServer(app);
io = io.listen(server);

server.listen(2000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var arr = [];
var channel = 0;
var s = [];

io.sockets.on('connection', function (socket) {
	socket.on('reqNew', function(data) {
		arr[channel] = socket;
		socket.emit('resNew', channel);
		channel++;
	});

	socket.on('reqJoin', function(data) {
		if(arr[data]) {
			s[socket.id] = arr[data]; // socket 2 -> socket 1
			s[arr[data].id] = socket; // socket 1 -> socket 2

			arr[data].emit('resJoin');

			console.log(s);
		} else {
			console.log("ERR");
			console.log(s, arr, data);
		}
	});

	socket.on('reqOffer', function(data) {
		s[socket.id].emit('resOffer', data);
	});

	socket.on('reqAnswer', function(data) {
		s[socket.id].emit('resAnswer', data);

	});

	socket.on('reqIce', function(data) {
		console.log(data);
		s[socket.id].emit('resIce', data);
	});

});