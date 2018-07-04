var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	console.log('New message received', message);
	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`);
	jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val(),
	}, function() {

	});
});

socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');
	li.text(`${message.from}: `);
	a.attr('href', message.url);
	li.append(a);
	jQuery('#messages').append(li);
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by this browser.')
	}
	navigator.geolocation.getCurrentPosition(function (position) {
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		alert('Unable to fetch location.')
	});
});