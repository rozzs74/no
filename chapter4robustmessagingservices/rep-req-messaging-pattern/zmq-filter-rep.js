"use strict";

const fs = require("fs");
const ZMQ = require("../utils/zmq-utils");

main();

/**
 * 
 * @description Main method.
 */
function main() {
	createResponderEndpoint();
}

/**
 * 
 * @description Function for creating responder endpoint.
 */
function createResponderEndpoint() {
	const responder = ZMQ.createSocket("rep");

	/* Receiving the request */
	onReceiveRequestMessage(responder);

	/* Stop all the process */
	closeResponderEndpoint(responder);
}

/**
 * 
 * @description Function for receiving the request then transform the data.
 * @param {any} responder 
 */
function onReceiveRequestMessage(responder) {
	responder.on("message", (data) => {
		let request = ZMQ.parsedData(data);
		let request_path = request.path;
		console.log("Received request to get:", request_path);
		fs.readFile(request_path, (err, content) => {
			// respond to the requester
			ZMQ.sendMessage(responder, getMessageContent(content));
		});
	});

	bindToLoopBackInterface(responder);
}

/**
 * 
 * @description Function for transforming the request data before sending to requester.
 * @param {any} file_content 
 * @returns 
 */
function getMessageContent(file_content) {
	return ZMQ.serialisedData({
		content: file_content.toString(),
		timestamp: ZMQ.getTimeStamp(),
		pid: process.pid // Node process id
	});
}

/**
 * 
 * @description Function for binding reply endpoint to loopback interface address
 * @param {any} responder 
 */
function bindToLoopBackInterface(responder) {
	ZMQ.bindTCPSocket(responder, "tcp://127.0.0.1:5434", "Listening to zmq requesters...");
}

/**
 * 
 * @description Function for closing / finishing the process
 * @param {any} responder 
 */
function closeResponderEndpoint(responder) {
	// close the responder when the Node process ends this functon runs when pressed CTRL C
	process.on("SIGINT", () => {
		console.log("Shutting down...");
		ZMQ.closeZMQ(responder);
	});
}
