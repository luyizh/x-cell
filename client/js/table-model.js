class TableModel {
	constructor(numCols=10, numRows=15) {
		this.numCols = numCols;
		this.numRows = numRows;
		this.data = {};

		this.colors = {};

		this.rowHighlighted = "none";
		this.colHighlighted = "none";
		this.currentCellHighlighted = true;
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


	shiftDataRow(row) {
		let shiftedData = {};
		for (let key in this.data) {
			// get column and row numbers of any existing entries in spreadsheet
			const colNum = parseInt(key.split(":")[0], 10);
			const rowNum = parseInt(key.split(":")[1], 10);
			// add them, shifted, to new data
			if (rowNum >= row) {
				shiftedData[colNum.toString() + ":" + (rowNum+1).toString()] = this.data[key];
			} else {
				shiftedData[key] = this.data[key]
			}	
		}
		// replace data with newly generated data
		this.data = shiftedData;
	}

	shiftDataCol(col) {
		let shiftedData = {};
		for (let key in this.data) {
			// get column and row numbers of any existing entries in spreadsheet
			const colNum = parseInt(key.split(":")[0], 10);
			const rowNum = parseInt(key.split(":")[1], 10);
			// add them, shifted, to new data
			if (colNum >= col) {
				shiftedData[(colNum+1).toString() + ":" + rowNum.toString()] = this.data[key];
			} else {
				shiftedData[key] = this.data[key]
			}	
		}
		// replace data with newly generated data
		this.data = shiftedData;
	}

	highlightRow(row) {
		// clear color inventory
		this.colors = {};
		
		// set this.colors accordingly to reflect that
		// all cells in that row have been highlighted 
		for (let col = 0; col < this.numCols; col++) {
			this.setColor({ col: col, row: row - 1}, "yellow");
		}
		
		this.rowHighlighted = row;
	}

	highlightCol(col) {
		// clear color inventory
		this.colors = {};
		
		// set this.colors accordingly to reflect that
		// all cells in that col have been highlighted 
		for (let row = 0; row < this.numRows; row++) {
			this.setColor({ col: col - 1, row: row }, "yellow");
		}
		
		this.colHighlighted = col;
	}

	computeSum(colNumber, rowStart, rowEnd) {
		const values = [];
		
		// iterate the given column
		for (let r = rowStart - 1; r < rowEnd; r++) {
			const value = this.getValue({ col : colNumber - 1, row: r });
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