var SelectorStateMachine = {
  accept : function(tokens, style){
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
      switch(combinator){
      case " ": style = style.findParent(f1); break;
      case ">": style = style.findDirectParent(f1); break;
      case "+": style = style.findAdjSibling(f1, f2); break;
      case "~": style = style.findGenSibling(f1, f2); break;
      default: throw "selector syntax error:invalid combinator(" + combinator + ")";
      }
      if(style === null){
	return false;
      }
      push_back();
    }
    return true; // all accepted
  }
};
