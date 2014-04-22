var AttrSelector = (function(){
  function AttrSelector(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var rex_symbol = /[^=^~|$*\s]+/;
  var op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  AttrSelector.prototype = {
    _normalize : function(expr){
      return expr.replace(/\[/g, "").replace(/\]/g, "");
    },
    _parseSymbol : function(expr){
      var match = expr.match(rex_symbol);
      if(match){
	return match[0];
      }
      return "";
    },
    _parseOp : function(expr){
      return List.find(op_symbols, function(symbol){
	return expr.indexOf(symbol) >= 0;
      });
    },
    _parseExpr : function(expr){
      this.left = this._parseSymbol(expr);
      if(this.left){
	expr = Utils.trim(expr.slice(this.left.length));
      }
      this.op = this._parseOp(expr);
      if(this.op){
	expr = Utils.trim(expr.slice(this.op.length));
	this.right = Utils.cutQuote(Utils.trim(expr));
      }
    },
    _testHasAttr : function(style){
      return style.getMarkupAttr(this.left) !== null;
    },
    _testEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value === this.right;
    },
    _testCaretEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      var rex = new RegExp("^" + this.right);
      return rex.test(value);
    },
    _testDollarEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      var rex = new RegExp(this.right + "$");
      return rex.test(value);
    },
    _testTildeEqual : function(style){
      var values = style.getMarkupAttr(this.left).split(/\s+/);
      return List.exists(values, Closure.eq(this.right));
    },
    _testPipeEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value == this.right || value.indexOf(this.right + "-") >= 0;
    },
    _testStarEqual : function(style){
      var value = style.getMarkupAttr(this.left);
      return value.indexOf(this.right) >= 0;
    },
    _testOp : function(style){
      switch(this.op){
      case "=":  return this._testEqual(style);
      case "^=": return this._testCaretEqual(style);
      case "$=": return this._testDollarEqual(style);
      case "|=": return this._testPipeEqual(style);
      case "~=": return this._testTildeEqual(style);
      case "*=": return this._testStarEqual(style);
      }
      throw "undefined operation:" + this.op;
    },
    test : function(style){
      if(this.op && this.left && this.right){
	return this._testOp(style);
      }
      if(this.left){
	return this._testHasAttr(style);
      }
      return false;
    }
  };

  return AttrSelector;
})();

