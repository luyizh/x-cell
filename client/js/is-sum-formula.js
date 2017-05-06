const getColAndRow = function(cellId) {
  const col = cellId[0];
  const row = cellId.slice(1);
  return [col, row];
}



const isValidSumFormula = function(string, numCols, numRows) {
  // string must be in form
  // =SUM([One capital letter][0 or more digits]:[One capital letter][0 or more digits])
  const re = /=SUM\(([A-Z]\d*):([A-Z]\d*)\)$/;
  const result = string.match(re);

  // if string is in valid format, get col letters and row numbers
  if (result !== null) {
    const startCellCol = getColAndRow(result[1])[0].charCodeAt(0) - 64;
    let startCellRow = getColAndRow(result[1])[1];
    const endCellCol = getColAndRow(result[2])[0].charCodeAt(0) - 64;
    let endCellRow = getColAndRow(result[2])[1];
    
    // col numbers must match and be in range
    if (startCellCol === endCellCol &&
        1 <= startCellCol && startCellCol <= numCols &&
        1 <= endCellCol && endCellCol <= numCols) {

      // if no row numbers given, want all rows
      if (startCellRow === "" && endCellRow === "") {
        startCellRow = 1;
        endCellRow = numRows;
    
        return [startCellCol, startCellRow, endCellRow];    
      } 

      // otherwise row numbers must be in order and be in range
      else if (startCellRow < endCellRow && 
          1 <= startCellRow && startCellRow <= numRows &&
          1 <= endCellRow && endCellRow <= numRows) {
  
        return [startCellCol, parseInt(startCellRow, 10), parseInt(endCellRow, 10)];      
      }

    } 
  }
  // if any conditions failed
  return false;
}



module.exports = {
  isValidSumFormula: isValidSumFormula,
  getColAndRow: getColAndRow
};