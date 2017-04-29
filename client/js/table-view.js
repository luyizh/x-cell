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
	}

	
	renderTableHeader() {
		const fragment = document.createDocumentFragment();
		
		// get letters and build elements
		getLetterRange('A', this.model.numCols)
		  .map(colLabel => createTH(colLabel))
		  .forEach(th => fragment.appendChild(th));
		
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


	isCurrentCell(col, row) {
		return this.currentCellLocation.col === col &&
		       this.currentCellLocation.row === row;
	}

	renderTableBody() {
		const fragment = document.createDocumentFragment();
		
		for (let row = 0; row < this.model.numRows; row++) {
			// create each row
			const tr = createTR();
			for (let col = 0; col < this.model.numCols; col++) {
				const position = { col: col, row: row };
				const value = this.model.getValue(position);
				// create each standard cell
				const td = createTD(value);
				
				if (this.isCurrentCell(col, row)) {
					td.className = 'current-cell';
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
		this.sheetBodyEl.addEventListener('click', this.
			handleSheetClick.bind(this));
		this.formulaBarEl.addEventListener('keyup', this.
			handleFormulaBarChange.bind(this));
		
		this.addRowEl.addEventListener('click', this.
			handleAddRowClick.bind(this));
		this.addColumnEl.addEventListener('click', this.
			handleAddColumnClick.bind(this));
	}

	handleAddRowClick(event) {
		// increment row number
		this.model.numRows++;
		// redraw table
		this.renderTableHeader();
		this.renderTableBody();
		this.renderTableFooter();
	}

	handleAddColumnClick(event) {
		// increment column number
		this.model.numCols++;
		// redraw table
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
		this.renderTableBody();
		this.renderTableFooter();
		this.renderFormulaBar();
	}
}

module.exports = TableView;