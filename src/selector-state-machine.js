var SelectorStateMachine = (function(){
  var find_parent = function(style, parent_type){
    var ptr = style.parent;
    while(ptr !== null){
      if(parent_type.test(ptr)){
	return ptr;
      }
      ptr = ptr.parent;
    }
    return null;
  };

  var find_direct_parent = function(style, parent_type){
    var ptr = style.parent;
    if(ptr === null){
      return null;
    }
    return parent_type.test(ptr)? ptr : null;
  };

  // return the style context that matches f1 selector
  // in the condition that 'style' matches f2 and direct sibling of f1 is 'style'.
  // this situation described as 'f1 + f2' in css.
  var find_adj_sibling = function(style, f1, f2){
    // search style that matches f1,
    // and 'direct sibling' of it matches f2,
    // and the sibling itself is just equal to 'style'
    return List.find(style.getParentChilds(), function(child){
      var sibling = child.getNextSibling();
      return sibling && sibling === style && f1.test(child) && f2.test(sibling);
    });
  };

  // return the style context that matches f1 selector
  // in the condition that 'style' matches f2 and 'style' is found from all siblings after f1.
  // this situation described as 'f1 ~ f2' in css.
  var find_gen_sibling = function(style, f1, f2){
    // search style context that matches f1 selector.
    var style1 = List.find(style.getParentChilds(), function(child){
      return f1.test(child);
    });
    if(style1 === null){
      return null;
    }
    // search style context that matches f2 selector from 'all siblings' after style1,
    // and sibling itself is just equal to 'style'.
    var sibling = style1.getNextSibling();
    while(sibling !== null){
      if(sibling === style && f2.test(sibling)){
	return style1;
      }
      sibling = sibling.getNextSibling();
    }
    return null;
  }

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
	// test f1 combinator f2 by style-context
	// notice that f2 is selector subject and 'style' is style-context of f2.
	switch(combinator){
	case " ": style = find_parent(style, f1); break; // f2 = style-context itself.
	case ">": style = find_direct_parent(style, f1); break; // f2 = style-context itself.
	case "+": style = find_adj_sibling(style, f1, f2); break; // find f1+f2 in the context of style(subject = f2).
	case "~": style = find_gen_sibling(style, f1, f2); break; // find f1~f2 in the context of style(subject = f1).
	default: throw "selector syntax error:invalid combinator(" + combinator + ")";
	}
	// can't find style-context that matches f1 combinator f2.
	if(style === null){
	  return false;
	}
	// to start next loop from f1, push bach f1 token.
	push_back();
      }
      return true; // all accepted
    }
  }
})();

