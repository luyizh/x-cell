(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
},{"./table-model":4,"./table-view":5}],2:[function(require,module,exports){
const getRange = function(fromNum, toNum) {
	return Array.from({ length: toNum - fromNum + 1 },
		(unused, i) => i + fromNum);
};

const getLetterRange = function(firstLetter='A', numLetters) {
	const rangeStart = firstLetter.charCodeAt(0);
	const rangeEnd = rangeStart + numLetters - 1;
	return getRange(rangeStart, rangeEnd)
	  .map(charCode => String.fromCharCode(charCode));
};

module.exports = {
	getRange: getRange,
	getLetterRange: getLetterRange
};
},{}],3:[function(require,module,exports){
const removeChildren = function(parentEl) {
	while (parentEl.firstChild) {
		parentEl.removeChild(parentEl.firstChild);
	}
};

const createEl = function(tagName) {
	return function(text) {
		const el = document.createElement(tagName);
		if (text) {
			el.textContent = text;
		}
		return el;
	};
};

const createTR = createEl('TR');
const createTH = createEl('TH');
const createTD = createEl('TD');

module.exports = {
	createTR: createTR,
	createTH: createTH,
	createTD: createTD,
	removeChildren: removeChildren
};
},{}],4:[function(require,module,exports){
class TableModel {
	constructor(numCols=10, numRows=20) {
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
},{}],5:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, 
	      createTR,
	      createTH,
	      createTD } = require('./dom-util');

class TableView {
	constructor(model) {
		this.model = model;
	}

	init() {
		this.initDomReferences();
		this.initCurrentCell();
		this.renderTable();
		this.attachEventHandlers();
	}

	initDomReferences() {
		this.headerRowEl = document.querySelector('THEAD TR');
		this.sheetBodyEl = document.querySelector('TBODY');
		this.formulaBarEl = document.querySelector('#formula-bar');
		this.footerRowEl = document.querySelector('TFOOT TR');

		this.addColumnEl = document.getElementById('add-column');
		this.addRowEl = document.getElementById('add-row');

		this.rowLabelsEl = document.getElementById('row-labels');
	}

	initCurrentCell() {
		this.currentCellLocation = { col: 0, row: 0 };
		this.renderFormulaBar();
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
		
		// get letters and build elements
		//getLetterRange('A', this.model.numCols)
		  //.map(colLabel => createTH(colLabel))
		  //.forEach(th => fragment.appendChild(th));
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

				if (this.isCurrentCell(col, row)) {
					td.className = 'current-cell';
					
					// if the current cell is not highlighted
					if (!this.model.currentCellHighlighted) {
						td.style.backgroundColor = (this.model.getColor(position) || "white");
					}
				}

				// if the color at the position is undefined, set to white
				// otherwise highlight
				else {
					td.style.backgroundColor = (this.model.getColor(position) || "white");
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

	isCurrentCell(col, row) {
		return this.currentCellLocation.col === col &&
		       this.currentCellLocation.row === row;
	}

	attachEventHandlers() {
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
	}

	handleRowLabelClick(event) {
		// clear current cell highlighting
		this.model.currentCellHighlighted = false;

		// clear current col highlighting
		this.model.colHighlighted = "none";

		// get id of row that was clicked
		const rowNumber = event.target.id.slice(3);
			  
	  // redraw table with that row highlighted
		this.model.highlightRow(rowNumber);
		this.renderTableBody();

	}

	handleColHeaderClick(event) {
    // clear current cell highlighting
		this.model.currentCellHighlighted = false;

		// clear current row highlighting
		this.model.rowHighlighted = "none";

		// get index of column that was clicked
		const colNumber = event.target.id.slice(3);
		console.log(colNumber);

		// redraw table with that column highlighted
		this.model.highlightCol(colNumber);
		this.renderTableBody();
	}


	handleAddRowClick(event) {
		// increment row number
		this.model.numRows++;
		
		// if a row is highlighted at time of press,
		// must be sure not to highlight a column...
		if (this.model.rowHighlighted !== "none") {

			this.model.colors = {};
			this.model.colHighlighted = "none";
			this.model.highlightRow(this.model.rowHighlighted);

		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		  this.renderRowLabels();
		}

		// if a current cell is highlighted, redraw the table directly
		if (this.model.currentCellHighlighted) {
			this.model.colHighlighted = "none";
			this.model.rowHighlighted = "none";
			this.model.colors = {};
		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		  this.renderRowLabels();
		
		// if a column is highlighted at time of press,
		// must highlight newly added cells in expanded row before redrawing
		// and must be sure not to highlight a row...
		} 
		if (this.model.colHighlighted !== "none") {
      // clear highlighting
		  this.model.colors = {};
		  this.model.rowHighlighted = "none";
		  // re-highlight
		  this.model.highlightCol(this.model.colHighlighted);

		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		  this.renderRowLabels();		

		} 
	}

	handleAddColumnClick(event) {
		// increment column number
		this.model.numCols++;

		// if a col is highlighted at time of press,
		// must be sure not to highlight a row...
		if (this.model.colHighlighted !== "none") {

			this.model.colors = {};
			this.model.rowHighlighted = "none";
			this.model.highlightCol(this.model.colHighlighted);

		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		  this.renderRowLabels();
		}

		// if a current cell is highlighted, redraw the table directly
		if (this.model.currentCellHighlighted) {
			this.model.colHighlighted = "none";
			this.model.rowHighlighted = "none";
			this.model.colors = {};
		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		
		// if a row is highlighted at time of press,
		// must highlight newly added cells in expanded row before redrawing
		} else if (this.model.rowHighlighted !== "none") {
      // clear highlighting
		  this.model.colors = {};
		  // re-highlight
		  this.model.highlightRow(this.model.rowHighlighted);

		  this.renderTableHeader();
		  this.renderTableBody();
		  this.renderTableFooter();
		}
		
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
		
		// clear any row/column highlighting
		this.model.colors = {};
		this.rowHighlighted = "none";
		this.colHighlighted = "none";

		// turn cell highlighting back on
		this.model.currentCellHighlighted = true;

		this.renderTableBody();
		this.renderTableFooter();
		this.renderFormulaBar();		
	}
}

module.exports = TableView;
},{"./array-util":2,"./dom-util":3}]},{},[1]);
