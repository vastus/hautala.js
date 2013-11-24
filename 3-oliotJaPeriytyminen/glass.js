'use strict';

var type = require('..').type;

module.exports = (function () {
	var utils = {};

	function inherits(ctor, superCtor) {
		ctor.super_ = superCtor;
		ctor.prototype = Object.create(superCtor.prototype, {
			constructor: {
				value: ctor,
				enumerable: false,
				writable: true,
				configurable: true
			}
		});
	}

	function extend(origin) {
		var addons = Array.prototype.slice.call(arguments, 1);
		// Don't do anything if addons aren't objects.
		if (!type.isArrayOf('Object', addons)) { return origin; }
		addons.forEach(function (add) {
			var keys = Object.keys(add), i = keys.length;
			while (i--) {
				origin[keys[i]] = add[keys[i]];
			}
		});
		return origin;
	}

	// Olisi nimetty implements mutta se on reserved word.
	function performs(o, interf) {
		var methods = Object.keys(interf.prototype || {});
		// Seurataan perintäketjua.
		for (var o2 = interf; o2; o2 = o2.super_) {
			methods = methods.concat(Object.keys(o2.prototype || {}));
		}
		return methods.every(function (key) {
			// Jos interface:ssa on metodi, niin...
			return type.isFunction(interf.prototype[key]) ?
				// o:lla on, tai o:n prototyypissä on, haluttu metodi.
				type.isFunction(o[key] || o.prototype && o.prototype[key]) : true;
		});
	}

	utils.inherits = inherits;
	utils.extend = extend;
	utils.performs = performs;

	return utils;
})();