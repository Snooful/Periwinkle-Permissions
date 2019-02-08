/* eslint-env mocha */

const pp = require(".");
const assert = require("chai").assert;

Object.entries({
	any: ["example", ["*"]],
	basic: ["example.hello", ["example.hello"]],
}).forEach(([ key, value ]) => {
	it(key, () => {
		assert.isTrue(typeof pp.test(...value) === "boolean");
	});
});