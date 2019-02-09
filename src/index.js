const validPartRegex = /^([a-z]+|\*)$/;

/**
 * Validates a permission selector.
 * @param {string} perm The permission selector to validate.
 * @returns {boolean} Whether the permission selector is valid.
 */
module.exports.validate = perm => {
	if (typeof perm !== "string") {
		return false;
	}

	const split = perm.split(".");
	return split.every(part => {
		return validPartRegex.test(part);
	});
};

/**
 * Tests for a permission from an array of permission selectors.
 * @param {string} testFor The permission to test for.
 * @param {string[]} permissions The permission selectors.
 * @returns {boolean} Whether the permission is selected by the selectors.
 */
module.exports.test = (testFor, permissions = []) => {
	if (typeof testFor !== "string") {
		throw new TypeError("The testFor parameter must be a string.");
	} else if (!Array.isArray(permissions)) {
		throw new TypeError("The permissions parameter must be an array.");
	} else if (permissions.some(perm => typeof perm !== "string")) {
		throw new TypeError("Every element in the permissions array must be a string.");
	}

	return permissions.some(permission => {
		if (permission === testFor) {
			return true;
		} else {
			const groups = permission.split(".");
			if (groups[groups.length - 1] === "*") {
				const testGroups = testFor.split(".");
				const groupsBefore = groups.slice(0, -1).join(".");
				return testGroups.length >= groups.length && testFor.startsWith(groupsBefore);
			}
		}
	});
};
