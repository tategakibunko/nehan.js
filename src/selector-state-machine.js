var SelectorStateMachine = (function(){
  var __find_parent = function(style, parent_type){
    var ptr = style.parent;
    while(ptr !== null){
      if(parent_type.test(ptr)){
	return ptr;
      }
      ptr = ptr.parent;
    }
    return null;
  };

  var __find_direct_parent = function(style, parent_type){
    var ptr = style.parent;
    if(ptr === null){
      return null;
    }
    return parent_type.test(ptr)? ptr : null;
  };

  // search adjacent sibling forom 'style' that matches f1 selector.
  var __find_adj_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    var prev_sibling = style.getParentNthChild(sibling_index - 1) || null;
    return (prev_sibling && f1.test(prev_sibling))? prev_sibling : null;
  };

  // search style context that matches f1 selector from all preceding siblings of 'style'.
  var __find_prev_sibling = function(style, f1){
    var sibling_index = style.getChildIndex();
    for(var i = 0; i < sibling_index; i++){
      var prev_sibling = style.getParentNthChild(i);
      if(prev_sibling && f1.test(prev_sibling)){
	return prev_sibling;
      }
    }
    return null;
  };

  return {
    // return true if all the selector-tokens(TypeSelector or combinator) matches the style-context.
    accept : function(style, tokens){
      if(tokens.length === 0){
	throw "selector syntax error:" + src;
      }
      var pos = tokens.length - 1;
      var pop = function(){
	return (pos < 0)? null : tokens[pos--];
      };
      var push_back = function(){
	pos++;
      };
      var f2, tmp, f1, combinator;
      while(pos >= 0){
	f2 = pop();
	if(f2 instanceof TypeSelector === false){
	  throw "selector syntax error:" + src;
	}
	if(!f2.test(style)){
	  return false;
	}
	tmp = pop();
	if(tmp === null){
	  return true;
	}
	if(tmp instanceof TypeSelector){
	  f1 = tmp;
	  combinator = " "; // descendant combinator
	} else if(typeof tmp === "string"){
	  combinator = tmp;
	  f1 = pop();
	  if(f1 === null || f1 instanceof TypeSelector === false){
	    throw "selector syntax error:" + src;
	  }
	}
	// test [f1 combinator f2]
	// notice that f2 is already accepted at this point, so next we check [f1 combinator] parts.
	// if style-context that matches [f1 combinator] is found, update 'style' to it, and next loop.
	switch(combinator){
	case " ": style = __find_parent(style, f1); break; // search parent context that matches f1.
	case ">": style = __find_direct_parent(style, f1); break; // search direct parent context that matches f1.
	case "+": style = __find_adj_sibling(style, f1); break; // find adjacent sibling context that matches f1.
	case "~": style = __find_prev_sibling(style, f1); break; // find previous sibling context that matches f1.
	default: throw "selector syntax error:invalid combinator(" + combinator + ")";
	}
	// can't find style-context that matches [f1 combinator f2]
	if(style === null){
	  return false;
	}
	// to start next loop from f1, push bach f1 token.
	push_back();
      }
      return true; // all accepted
    }
  };
})();

