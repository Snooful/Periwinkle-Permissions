const pp = require(".");
const assert = require("chai").assert;

describe("api", () => {
	describe("test", () => {
		const tests = {
			normal: pp.test("example.hello", ["example.hello"]),
			negationFromAll: pp.test("example.hello", ["*", "-example.hello"]),
		};

		describe("returns boolean", () => {
			Object.keys(tests).forEach(key => {
				it(`for ${key} test`, () => {
					assert.isTrue(typeof tests[key] === "boolean");
				});
			});
		});
	});
});