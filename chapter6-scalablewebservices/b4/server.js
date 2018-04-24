#! /usr/bin/env node

const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fieldSearch = require("../lib/field-search");
const bundlib = require("../lib/bundle");
const app = express();

const config = {
	bookdb: 'http://localhost:5984/books/',
	b4db: 'http://localhost:5984/b4/'
}

initApp();

function initApp() {
	app.use(logger('combined'));
	app.use(bodyParser.json());
	fieldSearch(config, app);
	// bundlib(config, app)
	bundlib.put(config, app);
	

	app.listen(3000, () => {
		console.log("ready captain");
	});


}



// app.get('/api/:name', (req, res) => {
// 	res.status(200).json({ "hello": req.params.name })
// });

// require("./lib/book-search.js")(config, app);
// require("./lib/field-search.js")(config, app);
// require("./lib/bundle.js")(config, app);

