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

  // selector 'f1 + f2'
  var find_adj_sibling = function(style, f1, f2){
    return List.find(style.getParentChilds(), function(child){
      var sibling = child.getNextSibling();
      return sibling && f1.test(child) && f2.test(sibling);
    });
  };

  // selector 'f1 ~ f2'
  var find_gen_sibling = function(style, f1, f2){
    var f1_style = List.find(style.getParentChilds(), function(child){
      return f1.test(child);
    });
    if(f1_style === null){
      return null;
    }
    var sibling = f1_style.getNextSibling();
    while(sibling !== null){
      if(f2.test(sibling)){
	return f1_style;
      }
      ptr = ptr.getNextSibling();
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

