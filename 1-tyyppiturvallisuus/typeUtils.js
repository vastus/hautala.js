var type = (function (onException) {
	"use strict";

	var handleException, utils = {};

	if (is('Function', onException)) {
		// If we were given an exception handler, just return what it returns.
		handleException = function (msg) { return onException(new TypeError(msg)); };
	} else {
		// Or just throw the error and return undefined.
		handleException = function (msg) { throw new TypeError(msg); };
	}

	// Check for the class/type of an object.
	function is(type, obj) {
		var className = Object.prototype.toString.call(obj).slice(8, -1);

		return (type === 'undefined' && obj === undefined) ||
			(type === 'null' && obj === null) ||
			// Special check to disallow NaN as a Number.
			(type === 'Number' && className === 'Number' && !isNaN(obj)) ||
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
			// Return arguments if parameters were optional.
			return (optional || types.length === 0) ? args :
				handleException('[check] No arguments given, not optional.');
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

			if (types[i] === 'Any') {
				continue;
			}
			// The input is a list of possible types e.g. Number|String
			options = types[i].split('|');

			if (!options.reduce(reductionBy(type), is(options[0], type))) {
				return handleException('[check] Type mismatch.');
			}
		}

		return args;
	}

	function arrayOf(type, array) {
		check(false, arguments, 'String', 'Array|Arguments');

		if (is('Arguments', array)) {
			array = Array.prototype.slice.call(array);
		} else if (!is('Array', array)) {
			return handleException('[arrayOf] Second parameter must be Arguments or Array.');
		}

		for (var i = 0; i < array.length; i++) {
			if (!is(type, array[i])) {
				return handleException('[arrayOf] ' + array[i] + ' is not a ' + type + '.');
			}
		}

		return true;
	}

	function expect(type, obj) {
		check(false, arguments, 'String', 'Any');
		var actual;

		if (!is(type, obj)) {
			actual = Object.prototype.toString.call(obj).slice(8, -1);
			return handleException('[expect] Expected ' + type + ' got "' + obj +
				'" (' + actual + ')');
		} else {
			return obj;
		}
	}

	// Generated helpers isNumber(x), isString(x), etc.
	['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function',
	'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String', 'NaN'
	].forEach(function (type) {
		utils['is' + type] = is.bind(null, type);
	});

	utils.is = is;
	utils.expect = expect;
	utils.isArrayOf = arrayOf;

	utils.check = check.bind(null, false);
	utils.checkOptional = check.bind(null, true);

	// We don't want anyone to fiddle with our methods.
	Object.freeze(utils);

	return utils;
})();