const validPartRegex = /^([a-z]+|\*)$/;

/**
 * Validates a permission selector.
 * @param {string} perm The permission selector to validate.
 * @returns {boolean} Whether the permission selector is valid.
 */
function validate(perm) {
	if (typeof perm !== "string") {
		return false;
	}

	if (perm.startsWith("-")) {
		perm = perm.slice(1);
	}

	const split = perm.split(".");
	return split.every(part => {
		return validPartRegex.test(part);
	});
}
module.exports.validate = validate;

/**
 * Validates an array of permissions.
 * @param {(string[]|Array.<string[]>)} permissions The permission selectors to validate.
 * @param {boolean} groupPermissions If true, allows validating arrays of arrays.
 * @returns {boolean} Whether all the permission selectors are valid.
 */
function validateAll(permissions, groupPermissions = false) {
	return permissions.every(perm => {
		if (Array.isArray(perm)) {
			if (groupPermissions) {
				return perm.every(subPerm => validate(subPerm));
			} else {
				return false;
			}
		} else {
			return validate(perm);
		}
	});
}
module.exports.validateAll = validateAll;

/**
 * Sorts permission selectors by priority.
 * @param {string[]} permissions The permission selectors to sort.
 * @returns {string[]} The sorted permission selectors.
 * @param {boolean} groupPermissions If true, allows sorting arrays of arrays.
 */
function sort(permissions = [], groupPermissions = false) {
	if (!Array.isArray(permissions)) {
		throw new TypeError("The permissions parameter must be an array.");
	} else if (!validateAll(permissions, groupPermissions)) {
		throw new TypeError("Permission selectors must be valid.");
	}

	const subSortedPermissions = groupPermissions ? permissions.map(perm => {
		if (Array.isArray(perm)) {
			return sort(perm);
		} else {
			return perm;
		}
	}) : permissions;

	const sorted = subSortedPermissions.sort((a, b) => {
		if (Array.isArray(a)) return 1;
		if (Array.isArray(b)) return -1;

		const aDash = a.startsWith("-");
		const bDash = b.startsWith("-");

		// Negated permission selectors are at the end of the array
		if (aDash && !bDash) {
			return 1;
		} else if (!aDash && bDash) {
			return -1;
		} else if (aDash && bDash) {
			// Thye cancel each other out
			a = a.slice(1);
			b = b.slice(1);
		}

		// More specific permission selectors are last
		const specificity = a.split(".").length - b.split(".").length;
		if (specificity) {
			return specificity;
		}

		const aMatchesAll = a.endsWith("*");
		const bMatchesAll = b.endsWith("*");

		// Prefer specific permissions rather than matching all
		if (aMatchesAll && !bMatchesAll) {
			return -1;
		} else if (!aMatchesAll && bMatchesAll) {
			return 1;
		} else {
			return 0;
		}
	});

	return groupPermissions ? sorted.reverse() : sorted;
}
module.exports.sort = sort;

/**
 * Tests for a permission from an array of permission selectors.
 * @param {string} testFor The permission to test for.
 * @param {string[]} permissions The permission selectors.
 * @param {boolean} groupPermissions If true, allows using arrays of arrays to group permissions.
 * @returns {boolean} Whether the permission is selected by the selectors.
 */
module.exports.test = (testFor, permissions = [], groupPermissions = false) => {
	if (typeof testFor !== "string") {
		throw new TypeError("The testFor parameter must be a string.");
	} else if (!Array.isArray(permissions)) {
		throw new TypeError("The permissions parameter must be an array.");
	} else if (!validateAll(permissions, groupPermissions)) {
		throw new TypeError("Permission selectors must be valid.");
	}

	const sortedPerms = sort(permissions, groupPermissions);
	return sortedPerms.reduce((_, perm) => {
		const negated = perm.startsWith("-");
		if (negated) {
			perm = perm.slice(1);
		}

		// Exact match
		if (perm === testFor) {
			return !negated;
		}

		const groups = perm.split(".");
		if (groups[groups.length - 1] === "*") {
			const testGroups = testFor.split(".");
			const groupsBefore = groups.slice(0, -1).join(".");

			const does = testGroups.length >= groups.length && testFor.startsWith(groupsBefore);
			return negated ? !does : does;
		}

		return false;
	}, false);
};
