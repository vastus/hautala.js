var assert = require('assert')
	, examples = require('../../lib/index').functional;

describe('sum' , function () {
	it('should work non-functional', function () {
		assert.strictEqual(examples.sum([1, 2, 3]), 6);
		assert.strictEqual(examples.sum([]), 0);
		assert.strictEqual(examples.sum([-1, -2, 4]), 1);
	});
	it('should work functional', function () {
		assert.strictEqual(examples.fsum([1, 2, 3]), 6);
		assert.strictEqual(examples.fsum([]), 0);
		assert.strictEqual(examples.fsum([-1, -2, 4]), 1);
	});
});