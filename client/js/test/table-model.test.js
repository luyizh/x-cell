const TableModel = require('../table-model');

describe('table-model', () => {

	it('can set then get a value', () => {
		// set up the initial state
		const model = new TableModel();
		const location = { col: 5, row: 3 };

		// inspect the initial state
		expect(model.getValue(location)).toBeUndefined();

		// execute code under test
		model.setValue(location, 'foo');

		// inspect the resulting state
		expect(model.getValue(location)).toBe('foo');
	});

	it('can compute the sum of a column with some integer inputs', () => {
		// set up the initial state
		const model = new TableModel();
		model.setValue({ col: 0, row: 0 }, '5');
		model.setValue({ col: 0, row: 1 }, '10');
		model.setValue({ col: 0, row: 2 }, '20');
		// inspect sum
		expect(model.getSumOfColumn(0)).toBe(35);
	});

	it('can compute the sum of a column with some integer inputs and some non-integer inputs', () => {
		// set up the initial state
		const model = new TableModel();
		model.setValue({ col: 0, row: 0 }, '5');
		model.setValue({ col: 0, row: 1 }, 'a');
		model.setValue({ col: 0, row: 2 }, '20');
		model.setValue({ col: 0, row: 3 }, '>');
    model.setValue({ col: 0, row: 4 }, '0.1');
		// inspect sum
		expect(model.getSumOfColumn(0)).toBe(25);
	});

});