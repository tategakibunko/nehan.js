Nehan.PseudoSelector = (function(){
  /**
   @memberof Nehan
   @class PseudoSelector
   @classdesc abstraction of css pseudo element or pseudo class selector
   @constructor
   @param expr {String}
   @param args {Array.<Nehan.CompoundSelector>}
   @example
   * var ps = new PseudoSelector("::first-letter").hasPseudoElement(); // true
   */
  function PseudoSelector(expr, args){
    this.name = expr;
    this.args = args || [];
  }

  /**
   @memberof Nehan.PseudoSelector
   @return {boolean}
   */
  PseudoSelector.prototype.hasPseudoElement = function(){
    return (this.name === "::before" ||
	    this.name === "::after" ||
	    this.name === "::first-letter" ||
	    this.name === "::first-line" ||
	    this.name === "::marker");
  };
  /**
   @memberof Nehan.PseudoSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  PseudoSelector.prototype.test = function(style){
    switch(this.name){
      // pseudo-element
    case "::before": return true;
    case "::after": return true;
    case "::first-letter": return !style.isMarkupEmpty();
    case "::first-line": return !style.isMarkupEmpty();
    case "::marker": return !style.isMarkupEmpty();

      // pseudo-class
    case ":first-child": return style.isFirstChild();
    case ":last-child": return style.isLastChild();
    case ":first-of-type": return style.isFirstOfType();
    case ":last-of-type": return style.isLastOfType();
    case ":only-child": return style.isOnlyChild();
    case ":only-of-type": return style.isOnlyOfType();
    case ":empty": return style.isMarkupEmpty();
    case ":root": return style.isRoot();
    case ":not": return style.not(this.args);
    case ":matches": return style.matches(this.args);
    case ":lang": return style.lang(this.args.map(function(arg){ return arg.name; }));
    }
    return false;
  };

  return PseudoSelector;
})();

