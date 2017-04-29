const fs = require('fs');
const TableModel = require('../table-model');
const TableView = require('../table-view');

describe('table-view', () => {

  beforeEach(() => {
  	// load HTML skeleton from disk and parse into the DOM
  	const fixturePath = './client/js/test/fixtures/sheet-container.html';
  	const html = fs.readFileSync(fixturePath, 'utf8');
  	document.documentElement.innerHTML = html;
  });

  describe('formula bar', () => {
  	it('makes changes TO the value of the current cell', () => {
  		// set up initial state
  		const model = new TableModel(3, 3);
  		const view = new TableView(model);
  		view.init();
  		// inspect initial state
  		let trs = document.querySelectorAll('TBODY TR');
  		let td = trs[0].cells[0];
  		expect(td.textContent).toBe('');
  		// simulate user action
  		document.querySelector('#formula-bar').value = '65';
  		view.handleFormulaBarChange();
  		// inspect resulting state
  		trs = document.querySelectorAll('TBODY TR');
  		expect(trs[0].cells[0].textContent).toBe('65');
  	});

  	it('updates FROM the value of the current cell', () => {
  		// set up initial state
  		const model = new TableModel(3, 3);
  		const view = new TableView(model);
  		model.setValue({ col: 2, row: 1 }, '123');
  		view.init();
  		// inspect initial state
  		const formulaBarEl = document.querySelector('#formula-bar');
  		expect(formulaBarEl.value).toBe('');
  		// simulate user action
  		const trs = document.querySelectorAll('TBODY TR');
  		trs[1].cells[2].click();
  		// inspect resulting state
  		expect(formulaBarEl.value).toBe('123');
  	});
  });

  describe('table body', () => {
  	it('highlights the current cell when clicked', () => {
  		// set up initial state
  		const numCols = 10;
  		const numRows = 5;
  		const model = new TableModel(numCols, numRows);
  		const view = new TableView(model);
  		view.init();
  		// inspect initial state
  		let trs = document.querySelectorAll('TBODY TR');
  		let td = trs[2].cells[3];
  		expect(td.className).toBe('');
  		// simulate user action
  		td.click();
  		// inspect resulting state
  		trs = document.querySelectorAll('TBODY TR');
  		td = trs[2].cells[3];
  		expect(td.className).not.toBe('');
  	});

  	it('has the right size', () => {
  		// set up initial state
  		const numCols = 6;
  		const numRows = 10;
  		const model = new TableModel(numCols, numRows);
  		const view = new TableView(model);
  		view.init();
  		// inspect initial state
  		let ths = document.querySelectorAll('THEAD TH');
  		expect(ths.length).toBe(numCols);
  	});

  	it('fills in values from the model', () => {
  		// set up initial state
  		const numCols = 3;
  		const numRows = 3;
  		const model = new TableModel(numCols, numRows);
  		const view = new TableView(model);
  		model.setValue({ col: 2, row: 1 }, '123');
  		view.init();
  		// inspect initial state
  		const trs = document.querySelectorAll('TBODY TR');
  		expect(trs[1].cells[2].textContent).toBe('123');
  	});
  });

  describe('table header', () => {
  	it('has valid column header labels', () => {
  		// set up the initial state
  		const numCols = 6;
  		const numRows = 10;
  		const model = new TableModel(numCols, numRows);
  		const view = new TableView(model);
  		view.init();

  		// inspect the initial state
  		let ths = document.querySelectorAll('THEAD TH');
  		expect(ths.length).toBe(numCols);

  		let labelTexts = Array.from(ths).map(el => el.textContent);
  		expect(labelTexts).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
  	});
  });

  describe('add row', () => {
    it('adds row when clicked', () => {
      // set up initial state
      const numCols = 10;
      const numRows = 5;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();
      // inspect initial state
      let trs = document.querySelectorAll('TBODY TR');
      expect(trs.length).toBe(5);
      // simulate user action
      let addRow = document.getElementById('add-row');
      addRow.click();
      // inspect resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs.length).toBe(6);
    });
  });

  describe('add column', () => {
    it('adds column when clicked', () => {
      // set up initial state
      const numCols = 10;
      const numRows = 5;
      const model = new TableModel(numCols, numRows);
      const view = new TableView(model);
      view.init();
      // inspect initial state
      let trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells.length).toBe(10);

      let ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols);
      // simulate user action
      let addColumn = document.getElementById('add-column');
      addColumn.click();
      // inspect resulting state
      trs = document.querySelectorAll('TBODY TR');
      expect(trs[0].cells.length).toBe(11);

      ths = document.querySelectorAll('THEAD TH');
      expect(ths.length).toBe(numCols + 1);
    });
  });
});