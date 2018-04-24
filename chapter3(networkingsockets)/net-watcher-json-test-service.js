"use strict";

const net = require("net");


const server = net.createServer((connection) => {
	console.log("Subscriber connected!");


	connection.write(
		'{"type":"changed","file":"targ'
	);

	// after a one second delay, send the other chunk
	let timer = setTimeout(function () {
		connection.write('et.txt","timestamp":1358175758495}' + "\n"); connection.end();
	}, 1000);

	connection.on('end', () => {
		clearTimeout(timer);
		console.log('Subscriber disconnected');
	});

});

server.listen(5432, function () {
	console.log('Test server listening for subscribers...');
});