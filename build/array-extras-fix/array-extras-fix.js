YUI.add('array-extras-fix', function(Y) {

var A = Y.Array;

/**
 * Taken from http://ejohn.org/blog/javascript-array-remove/
 */
A.remove = function(array, from, to) {
	var rest = array.slice((to || from) + 1 || array.length);
	array.length = from < 0 ? array.length + from : from;
	return array.push.apply(array, rest);
};

});
