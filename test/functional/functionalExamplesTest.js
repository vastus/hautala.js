var assert = require('assert')
	, examples = require('../..').functional;

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

describe('factorial' , function () {
	it('should work non-functional', function () {
		assert.strictEqual(examples.fact(5), 120);
		assert.strictEqual(examples.fact(0), 1);
		assert.strictEqual(examples.fact(1), 1);
	});
	it('should work functional', function () {
		assert.strictEqual(examples.ffact(5), 120);
		assert.strictEqual(examples.ffact(0), 1);
		assert.strictEqual(examples.ffact(1), 1);
	});
});