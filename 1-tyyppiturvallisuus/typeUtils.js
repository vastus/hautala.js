var type = (function () {
	"use strict";

	var utils = {};

	// Check for the class/type of an object.
	function is(type, obj) {
		var className = Object.prototype.toString.call(obj).slice(8, -1);

		return (type === 'undefined' && obj === undefined) ||
			(type === 'null' && obj === null) ||
			// Special check to disallow NaN as a Number.
			(type === 'Number' && !isNaN(parseFloat(obj)) && isFinite(obj)) ||
			// Detect separately.
			(type === 'NaN' && className === 'Number' && isNaN(obj)) ||
			// Check anything other than a number by it's class name.
			(type !== 'Number' && type === className);
	}

	// Check if given array or arguments object contains certain types.
	function check(optional, params) {
		var args, length, options, type,
			types = Array.prototype.slice.call(arguments, 2);

		if (is('Arguments', params)) {
			args = Array.prototype.slice.call(params);
		} else if (is('Array', params)) {
			args = params;
		} else {
			return optional; // Return true if parameters were optional.
		}

		// If we allow optional parameters, just check the given ones.
		length = (optional ? args : types).length;

		function reductionBy(type) {
			return function (current, next) {
				return current || is(next, type);
			};
		}

		for (var i = 0; i < length; i++) {
			type = args[i];

			// The input is a list of possible types e.g. Number|String
			options = types[i].split('|');

			if (!options.reduce(reductionBy(type), is(options[0], type))) {
				return false;
			}
		}

		return true;
	}

	// Same as check, but throws TypeError instead of returning anything.
	function validation() {
		if (!check.apply(null, arguments)) {
			throw new TypeError('Invalid parameter types');
		}
	}

	function arrayOf(type, array) {
		validation(false, arguments, 'String', 'Array|Arguments');

		if (is('Arguments', array)) {
			array = Array.prototype.slice.call(array);
		} else if (!is('Array', array)) {
			throw new TypeError('Second parameter must be Arguments or Array.');
		}

		for (var i = 0; i < array.length; i++) {
			if (!is(type, array[i])) {
				return false;
			}
		}

		return true;
	}

	// Generated helpers isNumber(x), isString(x), etc.
	['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function',
	'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String', 'NaN'
	].forEach(function (type) {
		utils['is' + type] = is.bind(null, type);
	});

	utils.is = is;
	utils.isArrayOf = arrayOf;

	utils.check = check.bind(null, false);
	utils.checkOptional = check.bind(null, true);

	utils.validation = validation.bind(null, false);
	utils.validationOptional = validation.bind(null, true);

	// We don't want anyone to fiddle with our methods.
	Object.freeze(utils);

	return utils;
})();
