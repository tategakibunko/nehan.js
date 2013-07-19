var SelectorPseudo = (function(){
  function SelectorPseudo(expr){
    this.name = this._normalize(expr);
  }

  SelectorPseudo.prototype = {
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    },
    test : function(markup){
      switch(this.name){
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

