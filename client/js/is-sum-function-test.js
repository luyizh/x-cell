const { isValidFormat: isValidFormat,
	      isSumFunction: isSumFunction,
	      isValidCell: isValidCell 
	    } = require('./is-sum-function');

console.log(isValidFormat('=SUMaaa;(A1:A22)')); // [ 'SUMaaa;', 'A1', 'A22' ]
console.log(isValidFormat('=hello(A1:mango)')); // [ 'hello', 'A1', 'mango' ]
console.log(isValidFormat('=SUM(A1:)')); // false
console.log(isValidFormat('=SUM(A1:A22')); // false
console.log(isValidFormat('SUMaaa;(A1:j)')); // false
console.log(isValidFormat('a')); // false

console.log(isValidCell('A1')); // [ 'A', '1' ]
console.log(isValidCell('B22')); // [ 'B', '22' ]
console.log(isValidCell('AA1')); // false
console.log(isValidCell('a1')); // false
console.log(isValidCell('hello')); // false

console.log(isSumFunction('=SUM(A1:A22)')); // [ 'A', 1, 22 ]
console.log(isSumFunction('=Sum(A1:A22)')); // false