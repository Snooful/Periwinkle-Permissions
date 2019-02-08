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
}).forEach(([ key, value ]) => {
	it(key, () => {
		const test = pp.test(value.needed, value.nodes);
		assert.isTrue(value.invert ? !test : test);
	});
});