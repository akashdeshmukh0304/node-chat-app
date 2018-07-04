const path = require('path');
const http = require('http');
const publicPath = path.join(__dirname, '../public');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
var express = require('express');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected.')

	socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat app'));

	socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

	socket.on('createMessage', function (messageBody, callback) {
		console.log(messageBody);
		io.emit('newMessage', generateMessage(messageBody.from, messageBody.text));
		callback('This is from the server');
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});

	socket.on('disconnect', () => {
		console.log('User was diconnected.')
	});
});

server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
})