#! /usr/bin/env node


const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const app = express();


app.use(logger('combined'));
app.use(bodyParser.json());

app.get('/api/:name', (req, res) => {
	res.status(200).json({ "hello": req.params.name })
});

app.listen(3000, () => {
	console.log("ready captain");
});