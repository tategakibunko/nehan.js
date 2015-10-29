Nehan.AttrSelector = (function(){
  /**
     @memberof Nehan
     @class AttrSelector
     @classdesc css attribute selector
     @constructor
     @param {string} expr - attribute selector string
     @example
     * var as = new AttrSelector("[name='taro']");
  */
  function AttrSelector(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var __rex_symbol = /[^=^~|$*\s]+/;
  var __op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  /**
   @memberof Nehan.AttrSelector
   @method test
   @param style {Nehan.Style}
   @return {boolean} true if style is matched to this attribute selector.
   */
  AttrSelector.prototype.test = function(style){
    if(this.op && this.left && this.right){
      return this._testOp(style);
    }
    if(this.left){
      return this._testHasAttr(style);
    }
    return false;
  };

  AttrSelector.prototype._normalize = function(expr){
    return expr.replace(/\[/g, "").replace(/\]/g, "");
  };

  AttrSelector.prototype._parseSymbol = function(expr){
    var match = expr.match(__rex_symbol);
    if(match){
      return match[0];
    }
    return "";
  };

  AttrSelector.prototype._parseOp = function(expr){
    return Nehan.List.find(__op_symbols, function(symbol){
      return expr.indexOf(symbol) >= 0;
    });
  };

  AttrSelector.prototype._parseExpr = function(expr){
    this.left = this._parseSymbol(expr);
    if(this.left){
      expr = Nehan.Utils.trim(expr.slice(this.left.length));
    }
    this.op = this._parseOp(expr);
    if(this.op){
      expr = Nehan.Utils.trim(expr.slice(this.op.length));
      this.right = Nehan.Utils.cutQuote(Nehan.Utils.trim(expr));
    }
  };

  AttrSelector.prototype._testHasAttr = function(style){
    return style.getMarkupAttr(this.left) !== null;
  };

  AttrSelector.prototype._testEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value === this.right;
  };

  AttrSelector.prototype._testCaretEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var rex = new RegExp("^" + this.right);
    return rex.test(value);
  };

  AttrSelector.prototype._testDollarEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var rex = new RegExp(this.right + "$");
    return rex.test(value);
  };

  AttrSelector.prototype._testTildeEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    var values = value? value.split(/\s+/) : [];
    return Nehan.List.exists(values, Nehan.Closure.eq(this.right));
  };

  AttrSelector.prototype._testPipeEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value? (value == this.right || value.indexOf(this.right + "-") >= 0) : false;
  };

  AttrSelector.prototype._testStarEqual = function(style){
    var value = style.getMarkupAttr(this.left);
    return value.indexOf(this.right) >= 0;
  };

  AttrSelector.prototype._testOp = function(style){
    switch(this.op){
    case "=":  return this._testEqual(style);
    case "^=": return this._testCaretEqual(style);
    case "$=": return this._testDollarEqual(style);
    case "|=": return this._testPipeEqual(style);
    case "~=": return this._testTildeEqual(style);
    case "*=": return this._testStarEqual(style);
    }
    throw "undefined operation:" + this.op;
  };

  return AttrSelector;
})();

