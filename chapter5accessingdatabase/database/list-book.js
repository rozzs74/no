"use strict";

const file = require("file");
const rdf_parser = require("./lib/rdf-parser.js");

console.log("Beginning directory walk!");

file.walk(__dirname + '/cache', (err, dirPath, dirs, files) => {
	files.forEach((path) => {
		rdf_parser(path, (err, doc) => {
			if(err) {
				throw err;
			} else {
				console.log(doc);
			}
		});
	});
});