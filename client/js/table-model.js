class TableModel {
	constructor(numCols=10, numRows=20) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};

		this.colors = {};
	}

	_getCellId(location) {
		return `${location.col}:${location.row}`;
	}

	getValue(location) {
		return this.data[this._getCellId(location)];
	}

	setValue(location, value) {
		this.data[this._getCellId(location)] = value;
	}

	getColor(location) {
		return this.colors[this._getCellId(location)];
	}

	setColor(location, color) {
		this.colors[this._getCellId(location)] = color;
	}

	// set this.colors accordingly
	hilightRow(row) {
		// clear color inventory
		this.colors = {};
		// highlight all cells in that row
		for (let col = 0; col < this.numCols; col++) {
			this.setColor({ col: col, row: row - 1}, "yellow");
		}
	}

	getSumOfColumn(col) {		
		const values = [];
		
		// iterate the given column
		for (let r = 0; r < this.numRows; r++) {
			const value = this.getValue({ col : col, row: r });
			// collect all values as integers
			values.push(parseInt(value, 10));
		}		
		
		// filter out NaN values
		const validIntegers = values.filter(function(x) {
			return Number.isInteger(x);
		});
		
		// reduce to a sum
		const sum = validIntegers.reduce(function(a, b) {
			return a + b;
		}, 0);
    
		return sum;
	}
}

module.exports = TableModel;