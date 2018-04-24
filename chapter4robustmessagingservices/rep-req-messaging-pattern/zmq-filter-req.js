"use strict";

const ZMQ = require("../utils/zmq-utils");

const filename = process.argv[2];
main(filename);

/**
 * 
 * @description Main method.
 * @param {any} filename 
 */
function main(filename) {
	createRequesterEndpoint(filename);
}

/**
 * 
 * @description Function for creating request socket.
 * @param {any} filename 
 */
function createRequesterEndpoint(filename) {
	// create request endpoint
	const requester = ZMQ.createSocket("req");
	receivedReply(requester, filename)
}

/**
 * 
 * @description Function for receiving the reply using event emitter then transform data.
 * @param {any} requester 
 * @param {any} filename 
 */
function receivedReply(requester, filename) {
	// handle reply from responder
	requester.on("message", (data) => {
		let response = ZMQ.parsedData(data);
		console.log("Received response", response);
	});
	connectToServerEndpoint(requester, filename);
}

/**
 * 
 * @description Function for connecting to server endpoint.
 * @param {any} requester 
 * @param {any} filename 
 */
function connectToServerEndpoint(requester, filename) {
	const URI = "tcp://localhost:5434";
	ZMQ.connectToSocket(requester, URI);
	sendRequest(requester, filename);
}

/**
 * 
 * @description Function for sending the request 
 * @param {any} requester 
 * @param {any} filename 
 */
function sendRequest(requester, filename) {
	console.log("Sending request", filename);
	const message_content = ZMQ.serialisedData({ path: filename, pid: process.pid });
	ZMQ.sendMessage(requester, message_content);
}
