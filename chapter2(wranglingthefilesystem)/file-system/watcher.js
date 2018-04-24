const fs = require('fs');

fs.watch('target.txt', (err, res) => {
    console.log(`File target.txt just changed!`, res);
});
console.log('Now watching target.txt for changes');
