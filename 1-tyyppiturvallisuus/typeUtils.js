module.exports = (function (onException) {
	"use strict";

	// LIBRARY PRIVATES //
	/////////////////////

	var handleException, utils = {};

	if (className(onException) === 'function') {
		// If we were given an exception handler, just return what it returns.
		handleException = function (msg) { return onException(new TypeError(msg)); };
	} else {
		// Or just throw the error and return undefined.
		handleException = function (msg) { throw new TypeError(msg); };
	}

	function className(obj) {
		var type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
		if (type === 'number') { return isNaN(obj) ? 'nan' : 'number'; }
		return type;
	}

	function is(type, obj) {
		if (className(type) !== 'string') {
			return handleException('[is] Type must be a string like "Number".');
		}
		type = type.toLowerCase();

		return (type === 'undefined' && obj === undefined) ||
			(type === 'null' && obj === null) || type === className(obj);
	}

	function expect(type, obj) {
		check(false, arguments, 'String', 'Any');

		if (!is(type, obj)) {
			return handleException('[expect] Expected ' + type + ' got "' + obj +
				'" (' + className(obj) + ')');
		} else {
			return obj;
		}
	}

	function check(optional, params) {
		var args, types = Array.prototype.slice.call(arguments, 2);

		if (!types.length) { return handleException('[check] Must give types to check.'); }

		if (is('Arguments', params))    { args = Array.prototype.slice.call(params);
		} else if (is('Array', params)) { args = params;
		} else { return optional ? args : handleException('[check] No arguments given.'); }

		if (args.length > types.length) {
			return handleException('[check] More arguments than types.');
		}

		function matcher(value) {
			return function match(type) { return is(type, value); };
		}

		// If we allow optional parameters, just check the given ones.
		for (var i = (optional ? args : types).length - 1; i >= 0; i--) {
			if (types[i] === 'Any') { continue; }

			// The input is a list of possible types e.g. Number|String
			if (!(types[i]).split('|').some(matcher(args[i]))) {
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

		if (array.every(is.bind(null, type))) {
			return true;
		}

		return handleException('[arrayOf] Type mismatch.');
	}

	// LIBRARY PUBLICS //
	////////////////////

	['Arguments', 'Array', 'Boolean', 'Date', 'Error', 'Function',
	'JSON', 'Math', 'Number', 'Object', 'RegExp', 'String', 'NaN', 'Undefined', 'Null'
	].forEach(function (type) {
		utils['is' + type] = is.bind(null, type);
		utils['expect' + type] = expect.bind(null, type);		
	});

	utils.is = is;
	utils.of = className;
	utils.expect = expect;
	utils.isArrayOf = arrayOf;

	utils.check = check.bind(null, false);
	utils.checkOptional = check.bind(null, true);

	Object.freeze(utils); // We don't want anyone to fiddle with our functions.

	return utils;
})();