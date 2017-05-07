describe ('getColAndRow', () => {
  
  it('returns proper column and row when 1-digit row given', () => {
    const test = getColAndRow('A2');
    expect(test.length).toBe(2);
    expect(test[0]).toBe('A');
    expect(test[1]).toBe('2');
  });

  it('returns proper column and row when 2-digit row given', () => {
    const test = getColAndRow('A22');
    expect(test.length).toBe(2);
    expect(test[0]).toBe('A');
    expect(test[1]).toBe('22');
  });

  it('returns proper column and row when no row given', () => {
    const test = getColAndRow('C');
    expect(test.length).toBe(2);
    expect(test[0]).toBe('C');
    expect(test[1]).toBe('');
  });
});

const getColAndRow = function(cellId) {
  const col = cellId[0];
  const row = cellId.slice(1);
  return [col, row];
}



