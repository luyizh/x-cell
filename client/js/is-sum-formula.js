const isSumFormula = function(string, numCols, numRows) {
	// return [col, startRow, endRow] if string is a sum function
	// otherwise return false

	// string must be in form
	// =SUM([One capital letter][1 or more digits]:[One capital letter][1 or more digits])
	const re = /=SUM\(([A-Z]\d+):([A-Z]\d+)\)$/;

	// if string is in valid format, get col letters and row numbers
	if (string.match(re) !== null) {

		const numberPattern = /\d+/g;
		const letterPattern = /[A-Z]/g;

		const colNumbers = string.slice(4) // don't get letters in "SUM"
		                    .match(letterPattern)
		                    .map(x => x.charCodeAt(0) - 64); 
		const rowNumbers = string.match(numberPattern)
		                    .map(x => parseInt(x, 10));

		// col numbers must match and be in range
		// row numbers must be in order and be in range
		if (colNumbers[0] === colNumbers[1] && 
			  rowNumbers[0] < rowNumbers[1] &&
		    1 <= rowNumbers[0] && rowNumbers[0] <= numRows &&
		    1 <= rowNumbers[1] && rowNumbers[1] <= numRows && 
		    1 <= colNumbers[0] && colNumbers[0] <= numCols &&
		    1 <= colNumbers[1] && colNumbers[1] <= numCols ) {
			// if all conditions passed, return array
		return [colNumbers[0], rowNumbers[0], rowNumbers[1]];
		}
	}
  // if any conditions failed
	return false;
}


module.exports = {
	isSumFormula: isSumFormula,
};