var SelectorAttr = (function(){
  function SelectorAttr(expr){
    this.expr = this._normalize(expr);
    this.left = this.op = this.right = null;
    this._parseExpr(this.expr);
  }

  var rex_symbol = /[^=^~|$*\s]+/;
  var op_symbols = ["|=", "~=", "^=", "$=", "*=", "="];

  SelectorAttr.prototype = {
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
    _testHasAttr : function(markup){
      return markup.getTagAttr(this.left) !== null;
    },
    _testEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value === this.right;
    },
    _testCaretEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      var rex = new RegExp("^" + this.right);
      return rex.test(value);
    },
    _testDollarEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      var rex = new RegExp(this.right + "$");
      return rex.test(value);
    },
    _testTildeEqual : function(markup){
      var values = markup.getTagAttr(this.left).split(/\s+/);
      return List.exists(values, Closure.eq(this.right));
    },
    _testPipeEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value == this.right || value.indexOf(this.right + "-") >= 0;
    },
    _testStarEqual : function(markup){
      var value = markup.getTagAttr(this.left);
      return value.indexOf(this.right) >= 0;
    },
    _testOp : function(markup){
      switch(this.op){
      case "=":  return this._testEqual(markup);
      case "^=": return this._testCaretEqual(markup);
      case "$=": return this._testDollarEqual(markup);
      case "|=": return this._testPipeEqual(markup);
      case "~=": return this._testTildeEqual(markup);
      case "*=": return this._testStarEqual(markup);
      }
      throw "undefined operation:" + this.op;
    },
    test : function(markup){
      if(this.op && this.left && this.right){
	return this._testOp(markup);
      }
      if(this.left){
	return this._testHasAttr(markup);
      }
      return false;
    }
  };

  return SelectorAttr;
})();

