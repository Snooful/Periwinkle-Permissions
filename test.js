/* eslint-env mocha */

const pp = require(".");
const assert = require("chai").assert;

describe("validate", () => {
	it("returns false for invalid nodes", () => {
		[
			"node.",
			"node..hi",
			"node.*e",
			"node.**",
			"node.0",
			"node.CAPS",
		].forEach((item, index) => {
			assert.isFalse(pp.validate(item), "invalid test " + (index + 1));
		});
	});
	it("returns true for valid nodes", () => {
		[
			"node",
			"node.*",
			"node.e",
			"node.e.f",
		].forEach((item, index) => {
			assert.isTrue(pp.validate(item), "valid test " + (index + 1));
		});
	});
});

describe("test", () => {
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
		negate: {
			invert: true,
			needed: "example.denied",
			nodes: ["example.*", "-example.denied"],
		},
		noPerms: {
			invert: true,
			needed: "example.permless",
			nodes: [],
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
});