class TableModel {
  constructor(numCols=10, numRows=15) {
    this.numCols = numCols;
    this.numRows = numRows;
    this.data = {};
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