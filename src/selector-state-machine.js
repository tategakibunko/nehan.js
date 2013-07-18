var SelectorStateMachine = (function(){
  function SelectorStateMachine(src){
    this.tokens = (new SelectorLexer(src)).getTokens();
    this.pos = this.tokens.length - 1;
  }

  SelectorStateMachine.prototype = {
    accept : function(markup){
      if(this.tokens.length === 0){
	throw "selector syntax error:" + src;
      }
      this._reset();
      var cur, next, next2, combinator;
      while(!this._finish()){
	cur = this._pop();
	if(cur instanceof SelectorType === false){
	  throw "selector syntax error:" + src;
	}
	if(!cur.test(markup)){
	  return false;
	}
	next = this._pop();
	if(next === null){
	  return true;
	}
	if(next instanceof SelectorType){
	  next2 = next;
	  combinator = " "; // descendant combinator
	} else if(typeof next === "string"){
	  combinator = next;
	  next2 = this._pop();
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
	this._pushBack();
      }
      return true; // all accepted
    },
    _reset : function(){
      this.pos = this.tokens.length - 1;
    },
    _finish : function(){
      return this.pos < 0;
    },
    _pop : function(){
      if(this.pos < 0){
	return null;
      }
      return this.tokens[this.pos--];
    },
    _pushBack : function(){
      this.pos++;
    }
  };

  return SelectorStateMachine;
})();

