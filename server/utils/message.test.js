var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');


describe('generateMessage', () => {
	it('should generate a correct message object', () => {
		var from = 'Jen';
		var text = 'Some message';
		var message = generateMessage(from, text);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, text}); 
	});
});

describe('generateLocationMessage',  () => {
	it('Sholud generate correct location object', () => {
		var from = 'Admin';
		var latitude = 15;
		var longitude = 19;
		var url = `https://www.google.com/maps/@${latitude},${longitude}`;
		var message = generateLocationMessage(from, latitude, longitude);

		expect(message.createdAt).toBeA('number');
		expect(message).toInclude({from, url});

	});
});