"use strict";

const request = require("request");


module.exports = (config, app) => {
	app.get('/api/search/:view', (req, res) => {
		request({
			method: "GET",
			url: `${config.bookdb}_design/books/_view/by_${req.params.view}`,
			qs: {
				startKey: JSON.stringify(req.query.q),
				endKey: JSON.stringify(`${req.query.q}\ufff0`),
				group: true
			}
		}, (err, couchRes, body) => {
			// couldn't connect to couch DB
			if(err) {
				res.status(502);
				res.json({error: "bad_gateway", reason: err.code});
				return;
			}

			// CouchDB couldn't process our request
			if(couchRes.statusCode !== 200) {
				res.status(couchRes.statusCode);
				res.json(body);
			}

			// Send back just the keys we got back from couch db
			let body_parsed = JSON.parse(body);
			res.json(body_parsed);
			 body_parsed.rows.map(elem => {
				return elem.key
			});

		});
	});	
};