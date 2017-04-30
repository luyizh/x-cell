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
		//console.log(colNumber);

		// redraw table with that column highlighted
		this.model.highlightCol(colNumber);
		this.renderTableBody();
	}


	handleAddRowClick(event) {
		// increment row number
		this.model.numRows++;
		
		// if a current cell is highlighted, redraw the table directly
		if (this.model.currentCellHighlighted) {
			// first clear colors and make sure column/row are not highlighted
			this.model.colHighlighted = "none";
			this.model.rowHighlighted = "none";
			this.model.colors = {};
		}

		// if a row is highlighted at time of press
		else if (this.model.rowHighlighted !== "none") {
			// clear colors and make sure column is not highlighted
			this.model.colors = {};
			this.model.colHighlighted = "none";
			// re-highlight appropriate row
			this.model.highlightRow(this.model.rowHighlighted);

			// shift data
			console.log("Shift data needed row", this.model.rowHighlighted); 
			this.model.shiftDataRow(this.model.rowHighlighted);
		}
		
		// if a column is highlighted at time of press,
		// must highlight newly added cells in expanded row before redrawing
		else if (this.model.colHighlighted !== "none") {
      // clear colors and make sure row is not highlighted
		  this.model.colors = {};
		  this.model.rowHighlighted = "none";
		  // re-highlight appropriate column
		  this.model.highlightCol(this.model.colHighlighted);
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

		// if a current cell is highlighted, redraw the table directly
		if (this.model.currentCellHighlighted) {
			// clear colors and make sure row/column are not highlighted
			this.model.colHighlighted = "none";
			this.model.rowHighlighted = "none";
			this.model.colors = {};
		}

		// if a col is highlighted at time of press,
		else if (this.model.colHighlighted !== "none") {
			// clear colors and make sure row is not highlighted
			this.model.colors = {};
			this.model.rowHighlighted = "none";
			// re-highlight appropriate column
			this.model.highlightCol(this.model.colHighlighted);	

			// shift data
			console.log("Shift data needed col", this.model.colHighlighted);  
		}
		
		// if a row is highlighted at time of press,
		// must highlight newly added cells in expanded row before redrawing
		else if (this.model.rowHighlighted !== "none") {
      // clear highlighting
		  this.model.colors = {};
		  // re-highlight
		  this.model.highlightRow(this.model.rowHighlighted);
		}

		// re-draw rest of table
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