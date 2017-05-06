const { getLetterRange } = require('./array-util');
const { removeChildren, 
        createTR,
        createTH,
        createTD } = require('./dom-util');

const parser = require('./parser.js');
const { isValidSumFormula,
        getColAndRow } = require('./is-sum-formula.js');


class TableView {
  constructor(model) {
    this.model = model;
  }

  init() {
    this.initDomReferences();
    this.initCurrentCell();
    this.renderTable();
    this.attachEventHandlers();

    this.initCurrentHighlightedRow();
    this.initCurrentHighlightedCol();
  }

  initDomReferences() {
    this.headerRowEl = document.querySelector('THEAD TR');
    this.sheetBodyEl = document.querySelector('TBODY');
    this.formulaBarEl = document.querySelector('#formula-bar');
    this.footerRowEl = document.querySelector('TFOOT TR');

    this.addColumnEl = document.getElementById('add-column');
    this.addRowEl = document.getElementById('add-row');

    this.rowLabelsEl = document.getElementById('row-labels');

    this.computeSumFormulaEl = document.getElementById('compute-sum-formula');

  }

  initCurrentCell() {
    this.currentCellLocation = { col: 0, row: 0 };
    this.renderFormulaBar();

    this.currentCellColored = true;
  }

  isCurrentCell(col, row) {
    return this.currentCellLocation.col === col &&
           this.currentCellLocation.row === row;
  }

  initCurrentHighlightedRow() {
    this.currentHighlightedRow = "none";
  }

  isHighlightedRow(row) {
    return this.currentHighlightedRow === row;
  }

  setHighlightedRow(row) {
    this.currentHighlightedRow = row;
  }

  initCurrentHighlightedCol() {
    this.currentHighlightedCol = "none";
  }

  isHighlightedCol(col) {
    return this.currentHighlightedCol === col;
  }

  setHighlightedCol(col) {
    return this.currentHighlightedCol = col;
  }

  normalizeValueForRendering(value) {
    // don't return undefined
    return value || '';
  }

  renderFormulaBar() {
    const currentCellValue = this.model.getValue(this.currentCellLocation);
    this.formulaBarEl.value = this.normalizeValueForRendering(currentCellValue);
    this.formulaBarEl.focus();
  }

  renderTable() {
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();

    this.renderRowLabels();
  }
  
  renderRowLabels() {
    const fragment = document.createDocumentFragment();

    // add blank row number
    const blankRowLabel = createTH();
    blankRowLabel.id = "row0";
    blankRowLabel.className = "rowLabel";
    fragment.appendChild(blankRowLabel);

    for (let row = 0; row < this.model.numRows; row++) {
      // create each row
      const tr = createTR();
      // create each row label
      const rowLabel = createTH(row + 1);
      rowLabel.id = "row" + (row + 1).toString();
      rowLabel.className = "rowLabel";
      tr.appendChild(rowLabel);

      // add each row to fragment
      fragment.appendChild(tr);
    }

    // create sum row label
    const sumRowLabel = createTH('Sum');
    sumRowLabel.id = "rowSum";
    sumRowLabel.className = "rowLabel";
    fragment.appendChild(sumRowLabel);

    // clear footer row
    removeChildren(this.rowLabelsEl);
    this.rowLabelsEl.appendChild(fragment);
  }

  renderTableHeader() {   
    const fragment = document.createDocumentFragment();
    
    // get letters and build elements, each with a unique id
    const letters = getLetterRange('A', this.model.numCols);
    for (let col = 0; col < this.model.numCols; col++) {
      const colLabel = createTH(letters[col]);
      colLabel.id = "col" + (col + 1).toString();
      fragment.appendChild(colLabel);
    }
    
    // clear header row
    removeChildren(this.headerRowEl);
    // add fragment to header
    this.headerRowEl.appendChild(fragment);
  }

  renderTableFooter() {
    const fragment = document.createDocumentFragment();

    // create footer cells with appropriate sums
    for (let col = 0; col < this.model.numCols; col++) {
      const sum = this.model.getSumOfColumn(col);
      const td = createTD(sum);
      fragment.appendChild(td);
    }
    
    // clear footer row
    removeChildren(this.footerRowEl);
    // add fragment to footer
    this.footerRowEl.appendChild(fragment);
  }

  renderTableBody() {
    const fragment = document.createDocumentFragment();
    
    for (let row = 0; row < this.model.numRows; row++) {
      // create each row
      const tr = createTR();

      // create each standard cell
      for (let col = 0; col < this.model.numCols; col++) {
        const position = { col: col, row: row};
        const value = this.model.getValue(position);
        const td = createTD(value);

        // add class name if current cell, current row or current col
        if (this.isCurrentCell(col, row) && this.currentCellColored) {
          td.className = 'current-cell';  
        }  
        else if (this.isHighlightedRow(row + 1)) {
          td.className = 'current-row';
        }
        else if (this.isHighlightedCol(col + 1)) {
          td.className = 'current-col';
        }     

        // add each standard cell to row
        tr.appendChild(td);
      }
      // add each row to fragment
      fragment.appendChild(tr);
    }
    // clear sheet body of previous children
    removeChildren(this.sheetBodyEl);
    // add fragment to sheet body
    this.sheetBodyEl.appendChild(fragment);
  }



  attachEventHandlers() {

    const context = this;

    this.sheetBodyEl.addEventListener('click', this.
      handleSheetClick.bind(this));
    this.formulaBarEl.addEventListener('keyup', this.
      handleFormulaBarChange.bind(this));
    
    this.addRowEl.addEventListener('click', this.
      handleAddRowClick.bind(this));
    this.addColumnEl.addEventListener('click', this.
      handleAddColumnClick.bind(this));

    this.rowLabelsEl.addEventListener('click', this.
      handleRowLabelClick.bind(this));

    this.headerRowEl.addEventListener('click', this.
      handleColHeaderClick.bind(this));

    this.computeSumFormulaEl.addEventListener('click', this.
      handleFormulaBarEnter.bind(this));
      
  }


  handleFormulaBarEnter(event) {
    // see if value is a valid sum formula
    const value = this.formulaBarEl.value;  
    const validSumFormula = isValidSumFormula(value, this.model.numCols, this.model.numRows);
    
    // if value is a valid sum formula,
    // compute sum and set value of current cell to sum
    if (validSumFormula !== false) {    
      const rowStart = validSumFormula[1];
      const rowEnd = validSumFormula[2];
      const colNumber = validSumFormula[0];
            
      const sum = this.model.computeSum(colNumber, rowStart, rowEnd);     
      this.model.setValue(this.currentCellLocation, sum.toString());
    
    // if value invalid, keep value of current cell the same  
    } else {  
      this.model.setValue(this.currentCellLocation, value);
    }
    
    // redraw table
    this.renderTableBody();
    this.renderTableFooter();
  }


  handleRowLabelClick(event) {
    // get id of row that was clicked
    const rowNumber = parseInt(event.target.id.slice(3), 10);

    // clear current cell coloring and current col coloring
    this.currentCellColored = false;
    this.setHighlightedCol("none");
    
    // set current row coloring
    this.setHighlightedRow(rowNumber);
        
    // redraw table with that row highlighted
    this.renderTableBody();

  }

  handleColHeaderClick(event) {
    // get id of col that was clicked
    const colNumber = parseInt(event.target.id.slice(3), 10);

    // clear current cell coloring and current row coloring
    this.currentCellColored = false;
    this.setHighlightedRow("none");

    // set current col coloring
    this.setHighlightedCol(colNumber);
        
    // redraw table with that col highlighted
    this.renderTableBody();
  }


  handleAddRowClick(event) {
    // increment row number
    this.model.numRows++;

    // if a row is highlighted at time of press,
    if (this.currentHighlightedRow !== "none") {
      // shift data
      this.model.shiftDataRow(this.currentHighlightedRow); 
    }
    
    // redraw spreadsheet
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();
    this.renderRowLabels();
  }

  handleAddColumnClick(event) {
    // increment column number
    this.model.numCols++;

    // if a col is highlighted at time of press,
    if (this.currentHighlightedCol !== "none") {
      // shift data
      this.model.shiftDataCol(this.currentHighlightedCol); 
    }

    // re-draw spreadsheet
    this.renderTableHeader();
    this.renderTableBody();
    this.renderTableFooter();   
  }

  handleFormulaBarChange(evt) {
    const value = this.formulaBarEl.value;
    
    this.model.setValue(this.currentCellLocation, value);
    this.renderTableBody();
    this.renderTableFooter(); 
  }

  handleSheetClick(evt) {
    const col = evt.target.cellIndex;
    const row = evt.target.parentElement.rowIndex - 1;

    this.currentCellLocation = { col: col, row: row };
    
    // turn cell highlighting back on
    this.currentCellColored = true;
    
    // clear any row/column highlighting
    this.setHighlightedRow("none");
    this.setHighlightedCol("none");

    // redraw table
    this.renderTableBody();
    this.renderTableFooter();
    this.renderFormulaBar();    
  }
}

module.exports = TableView;