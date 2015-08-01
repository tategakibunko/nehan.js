Nehan.PseudoSelector = (function(){
  /**
     @memberof Nehan
     @class PseudoSelector
     @classdesc abstraction of css pseudo element or pseudo class selector
     @constructor
     @param expr {String}
     @example
     * var ps = new PseudoSelector("::first-letter").hasPseudoElement(); // true
  */
  function PseudoSelector(expr){
    this.name = this._normalize(expr);
  }

  /**
   @memberof Nehan.PseudoSelector
   @return {boolean}
   */
  PseudoSelector.prototype.hasPseudoElement = function(){
    return (this.name === "before" ||
	    this.name === "after" ||
	    this.name === "first-letter" ||
	    this.name === "first-line");
  };
  /**
   @memberof Nehan.PseudoSelector
   @param style {Nehan.StyleContext}
   @return {boolean}
   */
  PseudoSelector.prototype.test = function(style){
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
  };

  PseudoSelector.prototype._normalize = function(expr){
    return expr.replace(/:+/g, "");
  };

  return PseudoSelector;
})();

