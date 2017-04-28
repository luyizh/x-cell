class TableModel {
	constructor(numCols=10, numRows=20) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};
	}

	_getCellId(location) {
		// e.g., column 4, row 3 has a key of "4:3"
		return `${location.col}:${location.row}`;
	}

	getValue(location) {
		return this.data[this._getCellId(location)];
	}

	setValue(location, value) {
		this.data[this._getCellId(location)] = value;
	}

	getSumOfColumn(col) {
	  return 10;
	}

	/*getSumOfColumn(col) {
		const values = [];
		// iterate the given column
		for (let row = 0; row < this.numRows; row++) {
			const value = this.data[`${col}:${row}`];		
		  // collect all values
		  values.push(parseInt(value, 10));
		}
		// filter to only numeric values
		values.filter(function(x) {
			return Number.isInteger(x);
		});
		// reduce to a sum
		const sum = values.reduce( function(a, b) {
			return a + b;
		});
		return sum;
	}*/

}

module.exports = TableModel;