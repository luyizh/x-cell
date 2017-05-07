const { isValidSumFormula } = require('../is-sum-formula');

describe('is-sum-formula', () => {  

  describe('isValidSumFormula', () => {

    it('returns false when no end cell given', () => {
      const test = isValidSumFormula('=SUM(A1:)', 25, 25)
      expect(test).toBe(false);
    });

    it('returns false when no closing paren given', () => {
      const test = isValidSumFormula('=SUM(A1:A22', 25, 25);
      expect(test).toBe(false);
    });

    it('returns false when no starting equals sign given', () => {
      const test = isValidSumFormula('SUM(A1:A22)', 25, 25);
      expect(test).toBe(false);
    });

    it('returns false when single letter given', () => {
      const test = isValidSumFormula('a', 25, 25);
      expect(test).toBe(false);
    });

    it('returns correct parameters when in right form with row numbers', () => {
      const test = isValidSumFormula('=SUM(A1:A22)', 25, 25);
      expect(test.length).toBe(3);
      expect(test[0]).toBe(1);
      expect(test[1]).toBe(1);
      expect(test[2]).toBe(22);
    });

    it('returns correct parameters when in right form with no row numbers', () => {
      const test = isValidSumFormula('=SUM(A:A)', 25, 25);
      expect(test.length).toBe(3);
      expect(test[0]).toBe(1);
      expect(test[1]).toBe(1);
      expect(test[2]).toBe(25);
    });
  });
});