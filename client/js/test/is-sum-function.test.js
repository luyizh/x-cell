const { ofRightForm: ofRightForm,
	      isSumFunction: isSumFunction,
	      cellOfRightForm: cellOfRightForm 
	    } = require('../is-sum-function');

describe('is-sum-function', () => {

	describe('ofRightForm', () => {

		it('returns false when no end cell given', () => {
			const test = ofRightForm('=SUM(A1:)')
			expect(test).toBe(false);
		});

		it('returns false when no closing paren given', () => {
			const test = ofRightForm('=SUM(A1:A22');
			expect(test).toBe(false);
		});

		it('returns false when no starting equals sign given', () => {
			const test = ofRightForm('SUM(A1:A22)');
			expect(test).toBe(false);
		});

		it('returns false when single letter given', () => {
			const test = ofRightForm('a');
			expect(test).toBe(false);
		});

		it('returns correct parameters when in right form', () => {
			const test = ofRightForm('=SUMaaa;(A1:A22)');
			expect(test.length).toBe(3);
			expect(test[0]).toBe('SUMaaa;');
			expect(test[1]).toBe('A1');
			expect(test[2]).toBe('A22');

			const test1 = ofRightForm('=hello(A1:mango)');
			expect(test1.length).toBe(3);
			expect(test1[0]).toBe('hello');
			expect(test1[1]).toBe('A1');
			expect(test1[2]).toBe('mango');
		});



	});

	describe('cellOfRightForm', () => {

		it('returns false when lower letter given', () => {
			const test = cellOfRightForm('a1');
			expect(test).toBe(false);
		});

		it('returns false when two uppercase letters given', () => {
			const test = cellOfRightForm('AA1');
			expect(test).toBe(false);
		});

		it('returns false when word given', () => {
			const test = cellOfRightForm('hello');
			expect(test).toBe(false);
		});

		it('returns correct parameters when in right form', () => {
			const test = cellOfRightForm('A1');
			expect(test.length).toBe(2);
			expect(test[0]).toBe('A');
			expect(test[1]).toBe('1');

			const test1 = cellOfRightForm('B22');
			expect(test1.length).toBe(2);
			expect(test1[0]).toBe('B');
			expect(test1[1]).toBe('22');
		});

	});

	describe('isSumFunction', () => {

		it('returns false when lowercase func word given', () => {
			const test = isSumFunction('=Sum(A1:A22)');
			expect(test).toBe(false);
		});

		it('returns false when wrong func word given', () => {
			const test = isSumFunction('=mango(A1:A22)');
			expect(test).toBe(false);
		});

		it('returns false when start row is equal to or less than end row', () => {
			const test = isSumFunction('SUM(A1:A1)');
			expect(test).toBe(false);

			const test1 = isSumFunction('SUM(A2:A1)');
			expect(test1).toBe(false);
		});

		it('returns false when start cell or end cell is not in right form', () => {
			const test = isSumFunction('SUM(A1:a2)');
			expect(test).toBe(false);

			const test1 = isSumFunction('SUM(AA2:A3)');
			expect(test1).toBe(false);
		});

		it('returns correct parameters when in right form', () => {
			const test = isSumFunction('=SUM(A1:A22)');
			expect(test.length).toBe(3);
			expect(test[0]).toBe('A');
			expect(test[1]).toBe(1);
			expect(test[2]).toBe(22);

			const test1 = isSumFunction('=SUM(B1:B2)');
			expect(test1.length).toBe(3);
			expect(test1[0]).toBe('B');
			expect(test1[1]).toBe(1);
			expect(test1[2]).toBe(2);
		});

	});

});