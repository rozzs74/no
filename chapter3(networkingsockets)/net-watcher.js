/*
	Author: John Royce C. Punay
	Date created: March 29, 2018 8:02 AM
*/

"use strict";

const net = require("net");
const fs = require("fs");
const os = require("os");

const filename = process.argv[2];
main(filename);

/**
 * 
 * @description Main method
 * @param {any} filename 
 */
function main(filename) {
	if (!filename) {
		throw new Error("No target filename was specified.");
	} else {
		initialiseServer(filename);
	}
}

/**
 * 
 * @description Function for intialising the server by creating server using NodeJS "net" API.
 * @param {any} filename 
 */
function initialiseServer(filename) {
	const server = net.createServer((connection) => {
		console.log("Subscriber connected!");
		connection.write(JSON.stringify({
			type: 'watching',
			file: filename
		}) + '\n');
		watchChangesOnFile(connection, filename);
	});
	listenToClientForConnection(server);
}

/**
 * 
 * @description Function for listening when someone connects to the server.
 * @param {any} server 
 */
function listenToClientForConnection(server) {
	const socket = createSockets();	
	server.listen(socket, () => {
		const message = createLogMessage(socket);
		console.log("Waiting for client to connect! \n");
		console.log(message);
	});	
}

/**
 * 
 * @description Function for watching the changes on the file.
 * @param {any} connection 
 * @param {any} filename 
 */
function watchChangesOnFile(connection, filename) {
	const watcher = fs.watch(filename, () => {
		connection.write(JSON.stringify({
			type: 'changed',
			file: filename,
			changed_by: getUserName(),
			timestamp: getDateNow()
		}));
		clientOnDisconnect(connection, watcher);
	});
}

/**
 * 
 * @description Function for listening on disconnect process when subscriber is no more on connected.
 * @param {any} connection 
 * @param {any} watcher 
 */
function clientOnDisconnect(connection, watcher) {
	connection.on('close', () => {
		console.log("Subscriber disconnected!");
		watcher.close();
	});
}

/**
 * 
 * @description Function for retrieving date now.
 * @returns 
 */
function getDateNow() {
	return Date.now();
}

/**
 * 
 * @description Function for retrieving OS type.
 * @returns 
 */
function getOStype() {
	return os.platform();
}

/**
 * 
 * @description Function for creating sockets in which depends on OS type.
 * @returns 
 */
function createSockets() {
	const os_type = getOStype();
	// return (os_type === "Windows_NT" ? 5432 : `/tmp/watchers_version_${getVersionHostName()}.sock`);
	return (os_type === "Windows_NT" ? 5432 : `/tmp/watchers_versionsss.sock`);
	
}

/**
 * 
 * @description Function for retrieving user's name 
 * @returns 
 */
function getUserName() {
	const user_name = os.userInfo().username;
	return user_name;
}

/**
 * 
 * @description Function for retrieving host name version number this is reflected to UNIX based OS type.
 * @returns 
 */
function getVersionHostName() {
	let version_number = Math.random();
	return (Math.round(version_number * 100) / 100);
}

/**
 * 
 * @description Function for creating log message on which the clien user connects to the server.
 * @param {any} socket 
 * @returns 
 */
function createLogMessage(socket) {
	const os_type = getOStype();
	const message = (os_type === 'Windows_NT' ? `Please connect using telnet client to localhost port ${socket}` : `Please connect using nc client to this hostame ${socket}`);
	return message;
}
