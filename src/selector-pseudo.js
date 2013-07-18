var SelectorPseudo = (function(){
  function SelectorPseudo(expr){
    this.name = this._normalize(expr);
  }

  SelectorPseudo.prototype = {
    _normalize : function(expr){
      return expr.replace(/:+/g, "");
    },
    test : function(markup){
      return true;
    }
  };

  return SelectorPseudo;
})();

