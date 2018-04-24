#! /usr/bin/env node

const request = require("request");
const options = {
	method: process.argv[2] || 'GET',
	url: 'http://localhost:5984/' + (process.argv[3] || "")
}

request(options, (err, res, body) => {
	if(err) {
		throw Error(err);
	} else {
		console.log(res.statusCode, JSON.parse(body));
	}
});