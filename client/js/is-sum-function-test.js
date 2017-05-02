const { ofRightForm: ofRightForm,
	      isSumFunction: isSumFunction,
	      cellOfRightForm: cellOfRightForm 
	    } = require('./is-sum-function');

console.log(ofRightForm('=SUMaaa;(A1:A22)')); // [ 'SUMaaa;', 'A1', 'A22' ]
console.log(ofRightForm('=hello(A1:mango)')); // [ 'hello', 'A1', 'mango' ]
console.log(ofRightForm('=SUM(A1:)')); // false
console.log(ofRightForm('=SUM(A1:A22')); // false
console.log(ofRightForm('SUMaaa;(A1:j)')); // false
console.log(ofRightForm('a')); // false

console.log(cellOfRightForm('A1')); // [ 'A', '1' ]
console.log(cellOfRightForm('B22')); // [ 'B', '22' ]
console.log(cellOfRightForm('AA1')); // false
console.log(cellOfRightForm('a1')); // false
console.log(cellOfRightForm('hello')); // false

console.log(isSumFunction('=SUM(A1:A22)')); // [ 'A', '1', '22' ]
console.log(isSumFunction('=Sum(A1:A22)')); // false