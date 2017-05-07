const parser = require('./parser.js');
// parser.parse('=SUM(A1:A22)'); gives 
// { func: 'SUM', params: [ 'A1', 'A22' ] }
if (parser.parse('=SUM(A1:A22)')) {
  console.log('valid input');
}

// func is all capital letters (at least 0 letters)
// params are all letters (uppercase or lowercase) or digits
// if empty param given, it won't be included in the resulting object
try {
const object = parser.parse('=SUM(A1:A22)');
const allParams = [];
allParams.push(object.func, object.params[0], object.params[1]);
console.log(allParams);
console.log(object.params.length);
}
catch (e) {
// statements to handle any exceptions
console.log("Fail"); 
}