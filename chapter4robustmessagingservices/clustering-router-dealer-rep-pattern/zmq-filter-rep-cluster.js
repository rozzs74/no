"use strict";

const cluster = require("cluster");
const fs = require("fs");
const ZMQ = require("../utils/zmq-utils");

const WORKER_COUNT = 3;
const TCP_ENDPOINT = 'tcp://127.0.0.1:5435';
const IPC_WORKER_ENDPOINT = 'ipc://filer-dealer.ipc';

main();

/**
 * 
 * @description Main method.
 */
function main() {
	checkClusterType();
}

/**
 * 
 * @description Function for checking the cluster type this the initialising the cluster process in node.
 */
function checkClusterType() {
	const is_cluster_master = getClusterType();
	(is_cluster_master ? routerEventEmitter() : processWorkers());
}

/**
 * 
 * @description Function for emitting events of router and dealer.
 */
function routerEventEmitter() {
	const response = bindRouterAndDealerSockets();
	response.router.on("message", function () {
		let frames = Array.prototype.slice.call(arguments);
		ZMQ.sendMessage(response.dealer, frames);
	});
	triggerDealerEventEmitter(response);
}

/**
 * 
 * @description Function for triggering dealer event emitter.
 * @param {any} response 
 */
function triggerDealerEventEmitter(response) {
	response.dealer.on("message", function () {
		let frames = Array.prototype.slice.call(arguments);
		ZMQ.sendMessage(response.router, frames);
	});

	clusterOnAvailable();
}

/**
 * 
 * @description Function for binding the router and dealer sockets.
 * @returns 
 */
function bindRouterAndDealerSockets() {
	let router = ZMQ.createSocket("router").bind(TCP_ENDPOINT);
	let dealer = ZMQ.createSocket("dealer").bind(IPC_WORKER_ENDPOINT);
	return { router, dealer };
}

/**
 * 
 * @description Function for listening on cluster if it's available if so create workers.
 */
function clusterOnAvailable() {
	cluster.on("online", (worker) => {
		console.log(`Worker ${worker.process.pid} is online`);
	});

	createWorkers();
}

/**
 * 
 * @description Function for creating workers and server as processes.
 */
function createWorkers() {
	// for some worker processes
	for (let i = 0; i < WORKER_COUNT; i++) {
		cluster.fork(); // create workers 
	}
}

/**
 * 
 * @description Function for working all the created workers.
 */
function processWorkers() {
	const responder = ZMQ.createSocket("rep")
	ZMQ.connectToSocket(responder, IPC_WORKER_ENDPOINT);

	responder.on("message", (data) => {
		let request = ZMQ.parsedData(data);
		console.log(process.pid + ' received request from: ' + request.pid);
		readFiles(responder, request.path);
	});
}

/**
 * 
 * @description Function for reading files
 * @param {any} responder 
 * @param {any} path 
 */
function readFiles(responder, path) {
	fs.readFile(path, (err, content) => {
		console.log("Sending response content");
		sendRespond(responder, content);
	});
}

/**
 * 
 * @description Function for sending respond after reading file
 * @param {any} responder 
 * @param {any} content 
 */
function sendRespond(responder, content) {
	let message_content = ZMQ.serialisedData({
		content: content.toString(),
		timestamp: ZMQ.getTimeStamp(),
		pid: process.pid // Node process id		
	});
	ZMQ.sendMessage(responder, message_content);
}

/**
 * 
 * @description Function for returning cluster type.
 * @returns 
 */
function getClusterType() {
	return (cluster.isMaster ? true : false);
}
