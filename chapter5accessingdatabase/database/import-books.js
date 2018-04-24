"use strict";

const async = require("async");
const file = require("file");
const rdf_parser = require("./lib/rdf-parser.js");
const request = require("request");


// QUEUE limit to 10 task only
const work = async.queue((path, done) => {
	// WORKER
	rdf_parser(path, (err, doc) => {
		request({
			method: 'PUT',
			url: "http://localhost:5984/books/" + doc._id,
			json: { _id: doc._id, title: doc.title }
		}, (err, res, body) => {
			if (err) {
				throw Error(err)
			}
			console.log(res.statusCode, body);
			done();
		});
	});
}, 5);

console.log("Beginning directory walk");

// RECURSIVE METHOD
file.walk(__dirname + '/cache', (err, dirPath, dirs, files) => {
	files.forEach((path) => {
		work.push(path);
	});
});