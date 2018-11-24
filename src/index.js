module.exports.test = (testFor, permissions = []) => {
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
