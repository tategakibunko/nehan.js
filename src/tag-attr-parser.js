var TagAttrParser = (function(){
  var parse = function(src, attr){
    var peek = function(){
      return src.charAt(0);
    };

    var step = function(count){
      src = src.substring(count);
    };

    var get_symbol = function(delimiters){
      var delim_pos = -1;
      List.iter(delimiters, function(delim){
	var pos = src.indexOf(delim, 1);
	if(delim_pos < 0 || pos < delim_pos){
	  delim_pos = pos;
	}
      });
      return ((delim_pos >= 0)? src.substring(0, delim_pos) : src).toLowerCase();
    };

    var get_quoted_value = function(quote_str){
      var quote_pos = src.indexOf(quote_str, 1);
      return (quote_pos >= 1)? src.substring(1, quote_pos) : src;
    };

    var get_attr = function(left){
      if(src === ""){
	if(left){
	  //console.log("single[%s]", left);
	  attr[left] = true;
	}
	return;
      }
      var s1 = peek();
      //console.log("s1[%s], left[%s]", s1, left);
      var value;
      if(s1 === " "){
	step(1);
	arguments.callee(left);
      } else if(s1 === "="){
	step(1);
	if(src.length > 0){
	  var s2 = peek();
	  if(s2 === "\"" || s2 === "'"){
	    value = get_quoted_value(s2);
	    step(value.length + 2);
	  } else {
	    value = get_symbol([" "]);
	    step(value.length);
	  }
	  attr[left] = value;
	}
      } else if(left){
	//console.log("single'[%s]", left);
	attr[left] = true; // treat as single attribute
      } else {
	left = get_symbol([" ", "="]);
	step(left.length);
	arguments.callee(left);
      }
    };

    while(src !== ""){
      get_attr();
    }
    return attr;
  };

  var normalize = function(src){
    return src
      .replace(/<[\S]+/, "") // cut tag start
      .replace(/^\s+/, "") // cut head space
      .replace("/>", "") // cut tag tail(close tag)
      .replace(">", "") // cut tag tail(open tag)
      .replace(/\s+$/, "") // cut tail space
      .replace(/\n/g, " ") // conv from multi line to single space
      .replace(/[　|\s]+/g, " ") // conv from multi space to single space
      .replace(/\s+=/g, "=") // cut multi space before '='
      .replace(/=\s+/g, "="); // cut multi space after '='
  };

  return {
    parse : function(src){
      src = normalize(src);
      return parse(src, {});
    }
  };
})();
