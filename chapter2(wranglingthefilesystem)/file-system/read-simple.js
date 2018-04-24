
// Async
const fs = require('fs');

fs.readFile('target.txt', (err, res) => {
	if (err) {
		throw err
	}
	console.log(res.toString());
});


// Sync
data = fs.readFileSync('target.txt'); 
process.stdout.write(data.toString());