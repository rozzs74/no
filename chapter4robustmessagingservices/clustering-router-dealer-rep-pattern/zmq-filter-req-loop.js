"use strict";

const zmq = require("zmq");

const filename = process.argv[2];

main(filename);

function main(filename) {
	createRequesterEndpoint(filename);
}

function createRequesterEndpoint(filename) {
	// create request endpoint
	const requester = zmq.socket("req");
	receivedReply(requester, filename)
}

function receivedReply(requester, filename) {
	// handle reply from responder
	requester.on("message", (data) => {
		let response = JSON.parse(data);
		console.log("Received response", response);
	});

	connectToServerEndpoint(requester, filename);
}

function connectToServerEndpoint(requester, filename) {
	const URI = "tcp://localhost:5435";
	requester.connect(URI);
	sendRequest(requester, filename)
}


function sendRequest(requester, filename) {

	console.log("Sending request", filename);
	
	for (let i = 1; i <= 3; i++) {
		console.log(`Sending request ${i} for ${filename}`);
		requester.send(JSON.stringify({
			path: filename,
			pid: process.pid
		}));
	}
}



