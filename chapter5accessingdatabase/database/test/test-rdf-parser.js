"use strict";

const rdf_parser = require("../lib/rdf-parser");
const expected_value = require("./pg132.json");

exports.testRDFParser = (test) => {
	rdf_parser(__dirname + "/pg132.rdf", (err, book) => {
		test.expect(2);
		test.ifError(err);
		test.deepEqual(book, expected_value, "book should match expected");
		test.done();
	});
};