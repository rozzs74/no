"use strict";


const ZMQ = require("../utils/zmq-utils");
main();

/**
 * 
 * @description Main method.
 */
function main() {
	createSubscriberEndpoint();
}

/**
 * 
 * @description Function for subscribing to the created socket endpoint.
 */
function createSubscriberEndpoint() {
	const subscriber = ZMQ.createSocket("sub");
	ZMQ.subscribeMessage(subscriber, "");
	onReceiveMessage(subscriber);
}

/**
 * 
 * @description Function for receiving the message.
 * @param {any} subscriber 
 */
function onReceiveMessage(subscriber) {

	// handle message from publisher
	subscriber.on("message", (data) => {
		let message = ZMQ.parsedData(data);
		let date = new Date(message.timestamp);
		console.log(`File ${message.file} changed at ${date}`);
	});

	connectToPublisherEndpoint(subscriber);
}

/**
 * 
 * @description Function for connecting to the publish socket endpoint.
 * @param {any} subscriber 
 */
function connectToPublisherEndpoint(subscriber) {
	const ENDPOINT_URI = "tcp://localhost:5432";
	ZMQ.connectToSocket(subscriber, ENDPOINT_URI);
}
