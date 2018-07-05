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

	var messageTextbox = jQuery('[name=message]');	
	socket.emit('createMessage', {
		from: 'User',
		text: messageTextbox.val(),
	}, function() {
		messageTextbox.val('');
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
	locationButton.attr('disabled', 'disabled').text('Sending Location...');

	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () {
		alert('Unable to fetch location.');
		locationButton.removeAttr('disabled');
	});
});