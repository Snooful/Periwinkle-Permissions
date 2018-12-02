/* eslint-env mocha */

const pp = require(".");
const assert = require("chai").assert;

/**
 * Test something.
 * @param {*} result The result of the test.
 */
function test(result) {
	it("returns boolean", () => {
		assert.isTrue(typeof result === "boolean");
	});
}

describe("test", () => {
	const tests = {
		basic: pp.test("example.hello", ["example.hello"]),
		any: pp.test("example", ["*"]),
	};
	Object.keys(tests).forEach(key => {
		describe(key, () => test(tests[key]));
	});
});
