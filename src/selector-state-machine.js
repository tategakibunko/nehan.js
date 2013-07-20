var SelectorStateMachine = {
  accept : function(tokens, markup){
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
    var cur, next, next2, combinator;
    while(pos >= 0){
      cur = pop();
      if(cur instanceof SelectorType === false){
	throw "selector syntax error:" + src;
      }
      if(!cur.test(markup)){
	return false;
      }
      next = pop();
      if(next === null){
	return true;
      }
      if(next instanceof SelectorType){
	next2 = next;
	combinator = " "; // descendant combinator
      } else if(typeof next === "string"){
	combinator = next;
	next2 = pop();
	if(next2 === null || next2 instanceof SelectorType === false){
	  throw "selector syntax error:" + src;
	}
      }
      switch(combinator){
      case " ": markup = SelectorCombinator.findDescendant(markup, next2); break;
      case ">": markup = SelectorCombinator.findChild(markup, next2); break;
      case "+": markup = SelectorCombinator.findAdjSibling(markup, cur, next2); break;
      case "~": markup = SelectorCombinator.findGenSibling(markup, cur, next2); break;
      default: throw "selector syntax error:invalid combinator(" + combinator + ")";
      }
      if(markup === null){
	return false;
      }
      push_back();
    }
    return true; // all accepted
  }
};
