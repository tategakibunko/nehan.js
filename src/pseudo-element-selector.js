Nehan.PseudoElementSelector = (function(){
  /**
   @memberof Nehan
   @class PseudoElementSelector
   @classdesc abstraction of css pseudo element or pseudo class selector
   @constructor
   @param expr {String}
   */
  function PseudoElementSelector(expr){
    this.name = expr;
  }

  /**
   @memberof Nehan.PseudoElementSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  PseudoElementSelector.prototype.test = function(style){
    switch(this.name){
    case "::before": return true;
    case "::after": return true;
    case "::first-letter": return !style.isMarkupEmpty();
    case "::first-line": return !style.isMarkupEmpty();
    case "::marker": return !style.isMarkupEmpty();
    }
    return false;
  };

  return PseudoElementSelector;
})();

