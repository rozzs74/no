"use strict";

const fs = require("fs");
const ZMQ = require("../utils/zmq-utils");

const filename = process.argv[2];
main(filename);

/**
 * 
 * @description Main method.
 * @param {any} filename 
 */
function main(filename) {
	createPublisherEndpoint(filename);
}

/**
 * 
 * @description Function for creating a publisher endpoint.
 * @param {any} filename 
 */
function createPublisherEndpoint(filename) {
	const publisher = ZMQ.createSocket("pub");
	watchChangesOnFile(publisher, filename);
}

/**
 * 
 * @description Function for watching the changes on the file this will server as job.
 * @param {any} publisher 
 * @param {any} filename 
 */
function watchChangesOnFile(publisher, filename) {
	fs.watch(filename, () => {	
		// Publish / send message to any subscribers

		ZMQ.sendMessage(publisher, publishMessageToAllSubscribers(filename));
		// publisher.send(publishMessageToAllSubscribers(filename));
	});
	bindTCPSocket(publisher);
}

/**
 * 
 * @description Function for binding to TCP socket.
 * @param {any} publisher 
 */
function bindTCPSocket(publisher) {
	const TCP_URI = "tcp://*:5432";
	const message = "Listening for zmq subscribers...";
	ZMQ.bindTCPSocket(publisher, TCP_URI, message);
}

/**
 * 
 * @description Function for publishing topic with serialized data.
 * @param {any} filename 
 */
function publishMessageToAllSubscribers(filename) {
	return JSON.stringify({
		type: 'changed',
		file: filename,
		timestamp: ZMQ.getTimeStamp()
	});
}
