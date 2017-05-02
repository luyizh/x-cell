/*const peg = require("pegjs");
const parser = peg.generate(
	sheet_function
	  = _ equal_sign _ func:function_name _ params:params {
	  	return {
	    	func: func,
	        params: params
	    };
	  }
	  
	equal_sign
	  = '='
	  
	function_name
	  = chars:[A-Z]* { return chars.join(''); }

	params
	  = '(' param:param* ')' {
	  	return param;
	  }

	param
	  = chars:[a-zA-Z0-9]+ _ delimiter? _ { return chars.join(''); }

	delimiter
	  = [:,]

	_ // whitespace 
	  = [ \t\n\r]*
);

console.log(parser.parse("=SUM(A1:A5)"));*/
