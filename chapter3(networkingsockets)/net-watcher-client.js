"use strict";

const net = require("net");
const os = require("os");
const ldj = require("./networking/ldj");

main();

/**
 * 
 * @description Main method.
 */
function main() {
	connectClient();
}

/**
 * 
 * @description Function for connecting to client by determining first the OS type.
 */
function connectClient() {
	const os_type = getOSType();
	(os_type === "Windows_NT" ? connectToWindowsSocket() : connectToUnixSocket());
}

/**
 * 
 * @description Function for connecting to UNIX domain socket name.
 */
function connectToUnixSocket() {
	const UNIX_SOCKET_URI = "/tmp/watchers_versionsss.sock";
	const client = net.connect(UNIX_SOCKET_URI);
	getData(client);
}

/**
 * 
 * @description Function for connecting to windows socket by using port
 */
function connectToWindowsSocket() {
	const client = net.connect({port: 5432});
	getData(client);
}

/**
 * 
 * @description Function for retrieving data after connecting to server.
 * @param {any} client 
 */
function getData(client) {
	client.on('data', (data) => {
		let message = JSON.parse(data);
		if (message.type === 'watching') {
			console.log("Now watching: " + message.file);
		} else if (message.type === 'changed') {
			let date = new Date(message.timestamp);
			console.log("File '" + message.file + "' changed at " + date + "by" + message.changed_by);
		} else {
			throw Error("Unrecognized message type: " + message.type);
		}
	});
}

/**
 * 
 * @description Function for retreiving current OS type
 * @returns 
 */
function getOSType() {
	return os.platform();
}