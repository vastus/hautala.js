var assert = require('assert')
	, type = require('../../lib/index').type;

function testIs(testType) {
	return function (value) {
		it('should return ' + value[1] + ' with ' + value[0] + ' (' + type.of(value[0]) + ').', function () {
			assert.strictEqual(type.is(testType, value[0]), value[1]);
		});
	};
}

function testExpect(testType) {
	return function (value) {
		if (value[1] === false) {
			it('should throw with ' + value[0] + '.', function () {
				assert.throws(function () {
					type.expect(testType, value[0]);
				});
			});
		} else {
			it('should not throw with ' + value[0] + '.', function () {
				assert.doesNotThrow(function () {
					type.expect(testType, value[0]);
				});
			});
		}
	};
}

function testOf(testType) {
	testType = testType.toLowerCase();
	return function (value) {
		if (value[1] === true) {
			it('should return ' + testType + ' with ' + value[0] + '.', function () {
				assert.strictEqual(testType, type.of(value[0]));
			});
		} else {
			it('should not return ' + testType + ' with ' + value[0] + '.', function () {
				assert.notStrictEqual(testType, type.of(value[0]));
			});
		}
	};
}

describe('type.is' , function () {
	it('should throw if type is not a string.', function () {
		assert.throws(function() {
			type.is(null);
		});
	})
});

var typeTests = {
	'Number': [
		[-1, true],
		[1337, true],
		[Infinity, true],
		[new Number("1"), true],
		["a string", false],
		[NaN, false],
		[[1,2,3], false]
	],
	'String': [
		["a string", true],
		["", true],
		[new String(1), true],
		[0, false],
		[[], false]
	],
	'Arguments': [
		[(function () { return arguments; })(), true],
		["", false],
		[new String(1), false],
		[0, false],
		[[], false]
	],
	'Array': [
		[[], true],
		["", false],
		[new String(1), false],
		[0, false],
		[{}, false]
	],
	'Boolean': [
		[true, true],
		[false, true],
		[new String(1), false],
		[0, false],
		[{}, false]
	],
	'Date': [
		[new Date(), true],
		[Date(), false],
		[Date.now(), false],
		[1337, false],
		[{}, false]
	],
	'Error': [
		[new Error(), true],
		[new TypeError(), true],
		[RangeError(), true],
		[1337, false],
		[{}, false],
		['asd', false]
	],
	'Function': [
		[Function, true],
		[function () {}, true],
		[RangeError, true],
		[Math.min, true],
		[{}, false],
		['asd', false],
		[1232, false]
	],
	'JSON': [
		[JSON, true],
		[JSON.parse('{}'), false],
		['a string', false],
		[[1,2,3], false]
	],
	'Math': [
		[Math, true],
		[Math.min, false],
		['a string', false],
		[[1,2,3], false]
	],
	'Object': [
		[{}, true],
		[Object(), true],
		['a string', false],
		[[1,2,3], false]
	],
	'RegExp': [
		[/./g, true],
		[new RegExp('asd', 'i'), true],
		['a string', false],
		[[1,2,3], false]
	],
	'NaN':[
		[0/0, true],
		[NaN, true],
		[0, false],
		['a string', false],
		[[1,2,3], false]
	],
	'Undefined': [
		[undefined, true],
		[({}).matti, true],
		[0, false],
		['a string', false],
		[[1,2,3], false]
	],
	'Null': [
		[null, true],
		[Object.prototype.__proto__, true],
		[undefined, false],
		[0, false],
		['a string', false],
		[[1,2,3], false]
	]
};

Object.keys(typeTests).forEach(function (key) {
	describe('type.is' + key, function () {
		typeTests[key].forEach(testIs(key));
	});
});

Object.keys(typeTests).forEach(function (key) {
	describe('type.expect' + key, function () {
		typeTests[key].forEach(testExpect(key));
	});
});

Object.keys(typeTests).forEach(function (key) {
	describe('type.of(' + key + ')', function () {
		typeTests[key].forEach(testOf(key));
	});
});