var simpleTests = (function () {
	var cases = [
		['is("Number", 1)', true],
		['is("Number", new Number(1))', true],
		['is("Number", NaN)', false],
		['isNumber(1337)', true],
		['isNaN(0/0)', true],
		['isNaN(undefined)', false],
		['isRegExp(/lol/g)', true],
		['isDate(new Date())', true],
		['isArray([1, 2 ,3])', true],
		['isObject({})', true],
		['isArray({a: "foo"})', false],
		['isObject([2, 3, 1])', false],		
		['isArrayOf("Number", [1,2,3,4])', true],
		['isArrayOf("String", ["1","2","3",4])', false],
		['isArrayOf("String", ["1","2","3","4"])', true],
		['isArrayOf("NaN", [NaN, 0/0, "wat" - 1])', true],
		['check([1,2,"foo"], "Number", "Number", "String")', true],
		['check([1,"foo", "bar"], "Number", "Number", "String")', false],
		['check([1,2], "Number", "Number", "String")', false],
		['checkOptional([1,2], "Number", "Number", "String")', true],
		['checkOptional([], "Number", "Number", "String")', true],
		['check([1,2], "Number", "Number|String")', true],
		['check([1,"2"], "Number", "Number|String")', true],
		['check([1,true], "Number", "Number|String")', false]
	];

	// Run each case.
	cases.forEach(function (test) {
		var result = eval('type.' + test[0]);
		if (result === test[1]) {
			console.log('%c' + test[0], 'color: green', '>', result);
		} else {
			console.warn('%c' + test[0], 'color: red', '> expected', test[1],
				'got', result);
		}
	});
});

simpleTests();
