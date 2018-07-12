var socket = io();

function scrollToBottom() {
	// Selectors
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	// Heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight'); 
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}

}

socket.on('connect', function () {
	console.log('Connected to server');
});

socket.on('disconnect', function () {
	console.log('Disconnected from server');
});

socket.on('newMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	jQuery('#messages').append(html);
	scrollToBottom();
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
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});

	jQuery('#messages').append(html);
	scrollToBottom();
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