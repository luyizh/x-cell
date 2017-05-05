const { isSumFormula,
	      getColAndRow
	    } = require('../is-sum-formula');

describe('is-sum-formula', () => {	

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

	describe('isSumFormula', () => {

		it('returns false when no end cell given', () => {
			const test = isSumFormula('=SUM(A1:)', 25, 25)
			expect(test).toBe(false);
		});

		it('returns false when no closing paren given', () => {
			const test = isSumFormula('=SUM(A1:A22', 25, 25);
			expect(test).toBe(false);
		});

		it('returns false when no starting equals sign given', () => {
			const test = isSumFormula('SUM(A1:A22)', 25, 25);
			expect(test).toBe(false);
		});

		it('returns false when single letter given', () => {
			const test = isSumFormula('a', 25, 25);
			expect(test).toBe(false);
		});

		it('returns correct parameters when in right form with row numbers', () => {
			const test = isSumFormula('=SUM(A1:A22)', 25, 25);
			expect(test.length).toBe(3);
			expect(test[0]).toBe(1);
			expect(test[1]).toBe(1);
			expect(test[2]).toBe(22);
		});

	  it('returns correct parameters when in right form with no row numbers', () => {
			const test = isSumFormula('=SUM(A:A)', 25, 25);
			expect(test.length).toBe(3);
			expect(test[0]).toBe(1);
			expect(test[1]).toBe(1);
			expect(test[2]).toBe(25);
		});
	});
});