var SelectorPseudo = (function(){
  function SelectorPseudo(expr){
    this.name = this._normalize(expr);
  }

  SelectorPseudo.prototype = {
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    },
    isPseudoElement : function(){
      return (this.name === "before" ||
	      this.name === "after" ||
	      this.name === "first-letter" ||
	      this.name === "first-line");
    },
    test : function(markup){
      switch(this.name){
      // pseudo-element
      case "before": return true;
      case "after": return true;
      case "first-letter": return !markup.isEmpty();
      case "first-line": return !markup.isEmpty();

      // pseudo-class
      case "first-child": return markup.isFirstChild();
      case "last-child": return markup.isLastChild();
      case "first-of-type": return markup.isFirstOfType();
      case "last-of-type": return markup.isLastOfType();
      case "only-child": return markup.isOnlyChild();
      case "only-of-type": return markup.isOnlyOfType();
      case "empty": return markup.isEmpty();
      case "root": return markup.isRoot();
      }
      return false;
    }
  };

  return SelectorPseudo;
})();

