/*const parser = require('./parser.js');
// parser.parse('=SUM(A1:A22)'); gives 
// { func: 'SUM', params: [ 'A1', 'A22' ] }
//if (parser.parse('=SUM(A1:A22')) {
	//console.log('valid input');
//}

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
}*/

const isValidFormat = function(string) {
	// if string is of right form, return array of parameters
	// otherwise return false

	// see if string is of form "= [stuff1] ( [stuff2] : [stuff3] )"
	// stuff1 contains no "("; stuff2 contains no ":"; stuff3 contains no ")"
	// stuff1, stuff2, stuff3 must be at least one character
	const symbolTester = /^=([^\(]+)\(([^:]+):([^\)]+)\)$/

	// parameters is null if string is NOT of appropriate form
	// otherwise, parameters[1], parameters[2] and parameters[3]
	// contain the needed parameters
	const parameters = string.match(symbolTester);
	
	if (parameters === null) {
		return false;
	} else {
		return parameters.slice(1, 4); // [stuff1, stuff2, stuff3]
	}
}

const isValidCell = function(string) {
  // see if string is of form "[CapitalLetter][PositiveInteger]"
  // if the string is NOT of that form, return false
  // otherwise return array in form [CapitalLetter, PositiveInteger]

  const tester = /^([A-Z]{1})([0-9]+)$/
  const result = string.match(tester);

  if (result === null) {
  	return false;
  } else {
  	return result.slice(1, 3);
  }
}

const isSumFunction = function(string) {
	// return [startCol, startRow, endRow] if string is a sum function
	// otherwise return false

	// string needs to be of right form
	if (isValidFormat(string) !== null) {
		const func = isValidFormat(string)[0];
		const startCell = isValidFormat(string)[1];
		const endCell = isValidFormat(string)[2];
		// func needs to be SUM
		// startCell and endCell must be in valid form
		if (func === "SUM" &&
			  isValidCell(startCell) &&
			  isValidCell(endCell)) {
			// startCell and endCell must have valid IDs, meaning:
			// column must match and row numbers must be in order
			const startCol = isValidCell(startCell)[0];
			const startRow = parseInt(isValidCell(startCell)[1], 10);
			const endCol = isValidCell(endCell)[0];
			const endRow = parseInt(isValidCell(endCell)[1], 10);
			if (startCol === endCol && startRow < endRow) { 
				// columns must match and rows must be in order
				return [startCol, startRow, endRow];
			}
		}
	}
	// if any of those conditions fail, return false
	return false;
}



module.exports = {
	isValidFormat: isValidFormat,
	isSumFunction: isSumFunction,
	isValidCell: isValidCell
};