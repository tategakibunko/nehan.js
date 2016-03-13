Nehan.PseudoClassSelector = (function(){
  /**
   @memberof Nehan
   @class PseudoClassSelector
   @classdesc abstraction of css pseudo element or pseudo class selector
   @constructor
   @param expr {String}
   @param args {Array.<Nehan.CompoundSelector>}
   */
  function PseudoClassSelector(expr, args){
    this.name = expr;
    this.args = args || [];
  }

  /**
   @memberof Nehan.PseudoClassSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  PseudoClassSelector.prototype.test = function(style){
    switch(this.name){
    case ":nth-child":
      if(this.args.length === 0){
	return false;
      }
      var nth = parseInt(this.args[0].name, 10);
      return style.isNthChild(nth);
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

  return PseudoClassSelector;
})();

