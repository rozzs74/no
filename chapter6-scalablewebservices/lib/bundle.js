
const axios = require("axios");

function post(config, app) {
	app.post("/api/bundle", (req, res) => {
		console.log(req.body.name);
		let payload = {
			type: 'bundle',
			name: req.body.name,
			books: {}
		};
		axios.post(config.b4db, payload).then((result) => {
			// console.log("RES!", res.status);
			res.status(result.status).send();

		}).catch((err) => {
			res.send(err.status)
			// console.log("ERR", err);
		});
	});
}

function put(config, app) {
	app.put("/api/bundle/:id/name/:name", (req, res) => {
		console.log(req.body);
		console.log(req.params.id);
		console.log(`${config.b4db}${req.params.id}`);
		let payload = {
			type: 'bundle',
			name: req.body.name,
			books: req.body.books
		};
		axios.get(`${config.b4db}${req.params.id}`).then((result) => {
			console.log(result.data);
			result.data.name = req.body.name;
			result.data.books = req.body.books;

			axios.put(`${config.b4db}${req.params.id}`, result.data).then((result) => {
				res.status(result.status).send();
			}, (error) => {
				console.log("error", error);
				res.status(error.status).send();
			});

		});
	});
}

module.exports = {
	post,
	put
}