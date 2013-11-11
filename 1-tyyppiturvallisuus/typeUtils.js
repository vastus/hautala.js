var type = (function () {
	var utils = {};

	// General utility to check for the class/type of an object.
	function is(type, obj) {
		var ts = Object.prototype.toString;
		return (type === 'undefined' && obj === undefined)
				|| (type === 'null'      && obj === null)
				// Special check to disallow NaN as a Number.
				|| (type === 'Number'    && !isNaN(parseFloat(obj))
				                         && isFinite(obj))
				// Detect separately.
				|| (type === 'NaN'       && ts.call(obj).slice(8, -1) === 'Number'
				                         && isNaN(obj))
				// Check anything other than a number by it's class name.
				|| (type !== 'Number'    && type === ts.call(obj).slice(8, -1));
	};

	utils.is = is;

	// Generated helpers isNumber, isString, etc.
	['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function',
	 'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String', 'NaN'
	].forEach(function (type) {
		utils['is' + type] = is.bind(null, type);
	});

	// An util to check if given array or arguments object contains certain types.
	function check(optional, params) {
		var args, length, types = Array.prototype.slice.call(arguments, 2);

		if (utils.isArguments(params)) {
			args = Array.prototype.slice.call(params);
		} else if (utils.isArray(params)) {
			args = params;
		} else {
			return optional; // No parameters given, return true if they were optional.
		}

		// If we allow optional parameters, just check the given ones.
		length = (optional ? args : types).length;

		for (var i = 0; i < length; i++) {
			// Check if type is correct.
			if (!is(types[i], args[i])) {
				return false;
			}
		}

		return true;
	}

	utils.check = check.bind(null, false);
	utils.checkOptional = check.bind(null, true);

	// Same as check, but throws TypeError if types don't match.
	function validation() {
		if (!check.apply(null, arguments)) {
			throw new TypeError('Invalid types');
		}
	}

	utils.validation = validation.bind(null, false);
	utils.validationOptional = validation.bind(null, true);

	// We don't want anyone to fiddle with our methods.
	Object.freeze(utils);

	return utils;
})();
