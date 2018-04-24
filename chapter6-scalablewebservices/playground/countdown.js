


// function* generator() {
// 	for (let i = 0; i < 10; i++) {
// 		yield i;
// 	}
// }

// const values = generator();

// for (let value of values) {
//     console.log(value);
// }

const countdown = function* (count) {
	while (count > 0) {
		yield count;
		count -= 1;
	}


}
const counter = countdown(20);

callback = function () {
	let item = counter.next();
	if (!item.done) {
		console.log(item.value);
		setTimeout(callback, 1000);
	}
}

callback();