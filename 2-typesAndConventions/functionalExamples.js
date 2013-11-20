
exports.sum = function (a) {
	var s = 0;
	for (var i = a.length - 1; i >= 0; i--) {
		s += a[i];
	}
	return s;
}

exports.fsum = function (a) {
	return a.reduce(function (s, v) { return s + v; }, 0);
}