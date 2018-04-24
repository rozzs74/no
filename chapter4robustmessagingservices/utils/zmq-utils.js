"use strict";

const zmq = require("zmq");
/**
 * 
 * @description Function for creating socket.
 * @param {any} name 
 * @returns 
 */
function createSocket(name) {
	const socket = zmq.socket(name);
	return socket;
}

/**
 * 
 * @description Function for binding the socket to particular tcp socket name and log message.
 * @param {any} publisher 
 * @param {any} tcp_socket_name 
 * @param {any} message 
 */
function bindTCPSocket(publisher, tcp_socket_name, message) {
	publisher.bind(tcp_socket_name, (err) => {
		if (err) throw new Error(err);
		console.log(message);
	});
}

/**
 * 
 * @description Function for sending data to subscribe entity.
 * @param {any} publisher 
 * @param {any} data 
 */
function sendMessage(publisher, data) {
	publisher.send(data);
}

/**
 * 
 * @description Function for subscribing to message base on publisher.
 * @param {any} subscriber 
 * @param {any} data 
 */
function subscribeMessage(subscriber, data) {
	subscriber.subscribe(data);
}

/**
 * 
 * @description Function for connecting to socket.
 * @param {any} connector 
 * @param {any} connection_name 
 */
function connectToSocket(connector, connection_name) {
	connector.connect(connection_name);
}

/**
 * 
 * @description Function for parsing the serialised JSON data.
 * @param {any} data 
 * @returns 
 */
function parsedData(data) {
	const parsed_data = JSON.parse(data);
	return parsed_data;
}

/**
 * 
 * @description Function for serialising JSON data.
 * @param {any} data 
 * @returns 
 */
function serialisedData(data) {
	const serialised_data = JSON.stringify(data);
	return serialised_data;
}

/**
 * 
 * @description Function for returning date timestamp.
 * @returns 
 */
function getTimeStamp() {
	return Date.now();
}

/**
 * 
 * @description Function for closing the ZMQ.
 * @param {any} zmq 
 */
function closeZMQ(zmq) {
	zmq.close();
}

module.exports = {
	createSocket,
	bindTCPSocket,
	sendMessage,
	subscribeMessage,
	connectToSocket,
	parsedData,
	serialisedData,
	getTimeStamp,
	closeZMQ
};
