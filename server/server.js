const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

var express = require('express');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected.')

	socket.emit('newMessage', {
		from: 'Admin',
		text: 'Welcome to chat app.',
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: 'Admin',
		text: 'New user joined',
		createdAt: new Date().getTime()
	});

	socket.on('createMessage', function (messageBody) {
		console.log(messageBody);
		io.emit('newMessage', {
			from: messageBody.from,
			text: messageBody.text,
			createdAt: new Date().getTime()
		});

		// socket.broadcast.emit('newMessage', {
		// 	from: messageBody.from,
		// 	text: messageBody.text,
		// 	createdAt: new Date().getTime()
		// });
	});

	socket.on('disconnect', () => {
		console.log('User was diconnected.')
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
})