/* eslint-env mocha */

const pp = require(".");
const assert = require("chai").assert;

Object.entries({
	any: {
		needed: "example",
		nodes: ["*"],
	},
	basic: {
		needed: "example.hello",
		nodes: ["example.hello"],
	},
	childNotSpecificallyMatched: {
		invert: true,
		needed: "example.hello",
		nodes: ["example"],
	},
	childSpecificallyMatchedWithAsterisk: {
		needed: "example.hello",
		nodes: ["example.*"],
	},
}).forEach(([ key, value ]) => {
	it(key, () => {
		const test = pp.test(value.needed, value.nodes);
		if (value.invert) {
			assert.isFalse(test);
		} else {
			assert.isTrue(test);
		}
	});
});