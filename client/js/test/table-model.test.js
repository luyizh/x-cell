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

  it('can set then get a color', () => {
    // set up the initial state
    const model = new TableModel();
    const location = { col: 5, row: 3 };

    // inspect the initial state
    expect(model.getColor(location)).toBeUndefined();

    // execute code under test
    model.setColor(location, "yellow");

    // inspect the resulting state
    expect(model.getColor(location)).toBe("yellow");
  });

  it('initially only has current cell highlighted', () => {
    // set up the initial state
    const model = new TableModel(2, 3);

    // inspect the initial state
    expect(model.rowHighlighted).toBe("none");
    expect(model.colHighlighted).toBe("none");
    expect(model.currentCellHighlighted).toBe(true);
  });

  it('can highlight a row given an input row', () => {
    // set up the initial state
    const model = new TableModel(2, 3);

    // inspect the initial state
    expect(model.rowHighlighted).toBe("none");
    expect(Object.keys(model.colors).length).toBe(0);

    // execute code under test
    model.highlightRow(2);

    // inspect the resulting state
    expect(model.getColor({ col: 0, row: 1 })).toBe("yellow");
    expect(model.getColor({ col: 1, row: 1 })).toBe("yellow");
    expect(Object.keys(model.colors).length).not.toBe(0);
    expect(Object.keys(model.colors).length).toBe(2);
    expect(model.rowHighlighted).toBe(2);
    
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

  it('can shift data given an input row', () => {
    // set up the initial state
    const model = new TableModel(2, 3);
    model.setValue({ col: 0, row: 0 }, '1');
    model.setValue({ col: 0, row: 1 }, '2');
    model.setValue({ col: 0, row: 2 }, '3');
    model.setValue({ col: 1, row: 0 }, '11');
    model.setValue({ col: 1, row: 1 }, '22');
    model.setValue({ col: 1, row: 2 }, '33');

    // inspect the initial state
    expect(Object.keys(model.data).length).toBe(6);

    // execute code under test
    model.shiftDataRow(1);

    // inspect the resulting state
    expect(model.getValue({ col: 0, row: 0 })).toBe('1');
    expect(model.getValue({ col: 0, row: 1 })).toBeUndefined;
    expect(model.getValue({ col: 0, row: 2 })).toBe('2');
    expect(model.getValue({ col: 0, row: 3 })).toBe('3');
    expect(model.getValue({ col: 1, row: 0 })).toBe('11');
    expect(model.getValue({ col: 1, row: 1 })).toBeUndefined;
    expect(model.getValue({ col: 1, row: 2 })).toBe('22');
    expect(model.getValue({ col: 1, row: 3 })).toBe('33');
    expect(Object.keys(model.data).length).toBe(6);
    
  });

  it('can shift data given an input col', () => {
    // set up the initial state
    const model = new TableModel(3, 2);
    model.setValue({ col: 0, row: 0 }, '1');
    model.setValue({ col: 0, row: 1 }, '2');
    model.setValue({ col: 1, row: 0 }, '3');
    model.setValue({ col: 1, row: 1 }, '4');
    model.setValue({ col: 2, row: 0 }, '5');
    model.setValue({ col: 2, row: 1 }, '6');

    // inspect the initial state
    expect(Object.keys(model.data).length).toBe(6);

    // execute code under test
    model.shiftDataCol(2);

    // inspect the resulting state
    expect(model.getValue({ col: 0, row: 0 })).toBe('1');
    expect(model.getValue({ col: 0, row: 1 })).toBe('2');
    expect(model.getValue({ col: 1, row: 0 })).toBe('3');
    expect(model.getValue({ col: 1, row: 1 })).toBe('4');
    expect(model.getValue({ col: 2, row: 0 })).toBeUndefined;
    expect(model.getValue({ col: 2, row: 1 })).toBeUndefined;
    expect(model.getValue({ col: 3, row: 0 })).toBe('5');
    expect(model.getValue({ col: 3, row: 1 })).toBe('6');
    expect(Object.keys(model.data).length).toBe(6);
    
  });

});