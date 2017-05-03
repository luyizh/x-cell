(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const TableModel = require('./table-model');
const TableView = require('./table-view');

const model = new TableModel();
const tableView = new TableView(model);
tableView.init();
},{"./table-model":7,"./table-view":8}],2:[function(require,module,exports){
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
const isSumFormula = function(string, numCols, numRows) {
	// return [col, startRow, endRow] if string is a sum function
	// otherwise return false

	// string must be in form
	// =SUM([One capital letter][1 or more digits]:[One capital letter][1 or more digits])
	const re = /=SUM\(([A-Z]\d+):([A-Z]\d+)\)$/;

	// if string is in valid format, get col letters and row numbers
	if (string.match(re) !== null) {

		const numberPattern = /\d+/g;
		const letterPattern = /[A-Z]/g;

		const colNumbers = string.slice(4) // don't get letters in "SUM"
		                    .match(letterPattern)
		                    .map(x => x.charCodeAt(0) - 64); 
		const rowNumbers = string.match(numberPattern)
		                    .map(x => parseInt(x, 10));

		// col numbers must match and be in range
		// row numbers must be in order and be in range
		if (colNumbers[0] === colNumbers[1] && 
			  rowNumbers[0] < rowNumbers[1] &&
		    1 <= rowNumbers[0] && rowNumbers[0] <= numRows &&
		    1 <= rowNumbers[1] && rowNumbers[1] <= numRows && 
		    1 <= colNumbers[0] && colNumbers[0] <= numCols &&
		    1 <= colNumbers[1] && colNumbers[1] <= numCols ) {
			// if all conditions passed, return array
		return [colNumbers[0], rowNumbers[0], rowNumbers[1]];
		}
	}
  // if any conditions failed
	return false;
}


module.exports = {
	isSumFormula: isSumFormula,
};
},{}],5:[function(require,module,exports){
/*const parser = require('./parser.js');
// parser.parse('=SUM(A1:A22)'); gives 
// { func: 'SUM', params: [ 'A1', 'A22' ] }
//if (parser.parse('=SUM(A1:A22')) {
	//console.log('valid input');
//}

// func is all capital letters (at least 0 letters)
// params are all letters (uppercase or lowercase) or digits
// if empty param given, it won't be included in the resulting object
try {
  const object = parser.parse('=SUM(A1:A22)');
  const allParams = [];
  allParams.push(object.func, object.params[0], object.params[1]);
  console.log(allParams);
  console.log(object.params.length);
}
catch (e) {
   // statements to handle any exceptions
   console.log("Fail"); 
}*/

const isValidFormat = function(string) {
	// if string is of right form, return array of parameters
	// otherwise return false

	// see if string is of form "= [stuff1] ( [stuff2] : [stuff3] )"
	// stuff1 contains no "("; stuff2 contains no ":"; stuff3 contains no ")"
	// stuff1, stuff2, stuff3 must be at least one character
	const symbolTester = /^=([^\(]+)\(([^:]+):([^\)]+)\)$/

	// parameters is null if string is NOT of appropriate form
	// otherwise, parameters[1], parameters[2] and parameters[3]
	// contain the needed parameters
	const parameters = string.match(symbolTester);
	
	if (parameters === null) {
		return false;
	} else {
		return parameters.slice(1, 4); // [stuff1, stuff2, stuff3]
	}
}

const isValidCell = function(string) {
  // see if string is of form "[CapitalLetter][PositiveInteger]"
  // if the string is NOT of that form, return false
  // otherwise return array in form [CapitalLetter, PositiveInteger]

  const tester = /^([A-Z]{1})([0-9]+)$/
  const result = string.match(tester);

  if (result === null) {
  	return false;
  } else {
  	return result.slice(1, 3);
  }
}

const isSumFunction = function(string) {
	// return [startCol, startRow, endRow] if string is a sum function
	// otherwise return false

	// string needs to be of right form
	if (isValidFormat(string) !== null) {
		const func = isValidFormat(string)[0];
		const startCell = isValidFormat(string)[1];
		const endCell = isValidFormat(string)[2];
		// func needs to be SUM
		// startCell and endCell must be in valid form
		if (func === "SUM" &&
			  isValidCell(startCell) &&
			  isValidCell(endCell)) {
			// startCell and endCell must have valid IDs, meaning:
			// column must match and row numbers must be in order
			const startCol = isValidCell(startCell)[0];
			const startRow = parseInt(isValidCell(startCell)[1], 10);
			const endCol = isValidCell(endCell)[0];
			const endRow = parseInt(isValidCell(endCell)[1], 10);
			if (startCol === endCol && startRow < endRow) { 
				// columns must match and rows must be in order
				return [startCol, startRow, endRow];
			}
		}
	}
	// if any of those conditions fail, return false
	return false;
}



module.exports = {
	isValidFormat: isValidFormat,
	isSumFunction: isSumFunction,
	isValidCell: isValidCell
};
},{}],6:[function(require,module,exports){
module.exports = /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { sheet_function: peg$parsesheet_function },
        peg$startRuleFunction  = peg$parsesheet_function,

        peg$c0 = function(func, params) {
          	return {
            	func: func,
                params: params
            };
          },
        peg$c1 = "=",
        peg$c2 = peg$literalExpectation("=", false),
        peg$c3 = /^[A-Z]/,
        peg$c4 = peg$classExpectation([["A", "Z"]], false, false),
        peg$c5 = function(chars) { return chars.join(''); },
        peg$c6 = "(",
        peg$c7 = peg$literalExpectation("(", false),
        peg$c8 = ")",
        peg$c9 = peg$literalExpectation(")", false),
        peg$c10 = function(param) {
          	return param;
          },
        peg$c11 = /^[a-zA-Z0-9]/,
        peg$c12 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        peg$c13 = /^[:,]/,
        peg$c14 = peg$classExpectation([":", ","], false, false),
        peg$c15 = /^[ \t\n\r]/,
        peg$c16 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parsesheet_function() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseequal_sign();
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsefunction_name();
            if (s4 !== peg$FAILED) {
              s5 = peg$parse_();
              if (s5 !== peg$FAILED) {
                s6 = peg$parseparams();
                if (s6 !== peg$FAILED) {
                  peg$savedPos = s0;
                  s1 = peg$c0(s4, s6);
                  s0 = s1;
                } else {
                  peg$currPos = s0;
                  s0 = peg$FAILED;
                }
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseequal_sign() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 61) {
        s0 = peg$c1;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c2); }
      }

      return s0;
    }

    function peg$parsefunction_name() {
      var s0, s1, s2;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c3.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c4); }
      }
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c3.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c4); }
        }
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c5(s1);
      }
      s0 = s1;

      return s0;
    }

    function peg$parseparams() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c6;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c7); }
      }
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseparam();
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseparam();
        }
        if (s2 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 41) {
            s3 = peg$c8;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c9); }
          }
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c10(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseparam() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = [];
      if (peg$c11.test(input.charAt(peg$currPos))) {
        s2 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c12); }
      }
      if (s2 !== peg$FAILED) {
        while (s2 !== peg$FAILED) {
          s1.push(s2);
          if (peg$c11.test(input.charAt(peg$currPos))) {
            s2 = input.charAt(peg$currPos);
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c12); }
          }
        }
      } else {
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parsedelimiter();
          if (s3 === peg$FAILED) {
            s3 = null;
          }
          if (s3 !== peg$FAILED) {
            s4 = peg$parse_();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c5(s1);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsedelimiter() {
      var s0;

      if (peg$c13.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c15.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c16); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c15.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c16); }
        }
      }

      return s0;
    }

    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();

},{}],7:[function(require,module,exports){
class TableModel {
	constructor(numCols=10, numRows=15) {
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


	shiftDataRow(row) {
		let shiftedData = {};
		for (let key in this.data) {
			// get column and row numbers of any existing entries in spreadsheet
			const colNum = parseInt(key.split(":")[0], 10);
			const rowNum = parseInt(key.split(":")[1], 10);
			// add them, shifted, to new data
			if (rowNum >= row) {
				shiftedData[colNum.toString() + ":" + (rowNum+1).toString()] = this.data[key];
			} else {
				shiftedData[key] = this.data[key]
			}	
		}
		// replace data with newly generated data
		this.data = shiftedData;
	}

	shiftDataCol(col) {
		let shiftedData = {};
		for (let key in this.data) {
			// get column and row numbers of any existing entries in spreadsheet
			const colNum = parseInt(key.split(":")[0], 10);
			const rowNum = parseInt(key.split(":")[1], 10);
			// add them, shifted, to new data
			if (colNum >= col) {
				shiftedData[(colNum+1).toString() + ":" + rowNum.toString()] = this.data[key];
			} else {
				shiftedData[key] = this.data[key]
			}	
		}
		// replace data with newly generated data
		this.data = shiftedData;
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

	computeSum(colNumber, rowStart, rowEnd) {
		const values = [];
		
		// iterate the given column
		for (let r = rowStart - 1; r < rowEnd; r++) {
			const value = this.getValue({ col : colNumber - 1, row: r });
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
},{}],8:[function(require,module,exports){
const { getLetterRange } = require('./array-util');
const { removeChildren, 
	      createTR,
	      createTH,
	      createTD } = require('./dom-util');
const { isValidFormat,
	      isSumFunction,
	      isValidCell
	    } = require('./is-sum-function');

const parser = require('./parser.js');
const { isSumFormula } = require('./is-sum-formula.js');


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

		this.computeSumFormulaEl = document.getElementById('compute-sum-formula');

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
		
		// get letters and build elements, each with a unique id
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

		const context = this;

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

		this.computeSumFormulaEl.addEventListener('click', this.
			handleFormulaBarEnter.bind(this));
			
	}


	handleFormulaBarEnter(event) {
		// see if value is a valid sum formula
		const value = this.formulaBarEl.value;	
		const validSumFormula = isSumFormula(value, this.model.numCols, this.model.numRows);
		
		// if value is a valid sum formula,
		// compute sum and set value of current cell to sum
		if (validSumFormula !== false) {		
			const rowStart = validSumFormula[1];
			const rowEnd = validSumFormula[2];
			const colNumber = validSumFormula[0];
						
			const sum = this.model.computeSum(colNumber, rowStart, rowEnd);		  
		  this.model.setValue(this.currentCellLocation, sum.toString());
		
		// if value invalid, keep value of current cell the same	
	  } else {	
		  this.model.setValue(this.currentCellLocation, value);
		}
		
		// redraw table
		this.renderTableBody();
		this.renderTableFooter();
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
			this.model.shiftDataCol(this.model.colHighlighted); 
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
},{"./array-util":2,"./dom-util":3,"./is-sum-formula.js":4,"./is-sum-function":5,"./parser.js":6}]},{},[1]);
