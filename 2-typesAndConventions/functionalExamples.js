
exports.sum = function (a) {
	var s = 0;
	for (var i = a.length - 1; i >= 0; i--) {
		s += a[i];
	}
	return s;
};

exports.fsum = function (a) {
	return a.reduce(function (s, v) { return s + v; }, 0);
};

exports.ffact = function ffact(n) {
	if (n === 0) { return 1; }
	else { return n * ffact(n - 1); }	
};

exports.fact = function (n) {
	var rval = 1;
	for (var i = 2; i <= n; i++) {
		rval = rval * i;
	}
	return rval;
};