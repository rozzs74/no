const fs = require('fs');
const spawn = require('child_process').spawn;
const  filename = process.argv[2];

if (!filename) {
    throw new Error('A file to watc must be specified');
}

fs.watch(filename, () => {
    // Execute ls command with flag of -lh
    let ls = spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});
console.log(`Now watching ${filename} for changes...`);