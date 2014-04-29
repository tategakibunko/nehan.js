var PseudoSelector = (function(){
  function PseudoSelector(expr){
    this.name = this._normalize(expr);
  }

  PseudoSelector.prototype = {
    hasPseudoElement : function(){
      return (this.name === "before" ||
	      this.name === "after" ||
	      this.name === "first-letter" ||
	      this.name === "first-line");
    },
    test : function(style){
      switch(this.name){
      // pseudo-element
      case "before": return true;
      case "after": return true;
      case "first-letter": return !style.isMarkupEmpty();
      case "first-line": return !style.isMarkupEmpty();

      // pseudo-class
      case "first-child": return style.isFirstChild();
      case "last-child": return style.isLastChild();
      case "first-of-type": return style.isFirstOfType();
      case "last-of-type": return style.isLastOfType();
      case "only-child": return style.isOnlyChild();
      case "only-of-type": return style.isOnlyOfType();
      case "empty": return style.isMarkupEmpty();
      case "root": return style.isRoot();
      }
      return false;
    },
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    }
  };

  return PseudoSelector;
})();

