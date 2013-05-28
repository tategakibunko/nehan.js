var TagAttrGenerator = (function(){
  // assume that "<" or ">" or "/>" are not included in src.
  function TagAttrGenerator(src){
    this.src = src;
  }

  TagAttrGenerator.prototype = {
    hasNext : function(){
      return this.src.length > 0;
    },
    yield : function(){
      return this.hasNext()? this._getAttr(this) : null;
    },
    _isSpace : function(s1){
      return s1 === "&#3000;" || s1.match(/\s/);
    },
    _getSymbol : function(self, fn_delimter){
      var i = 1;
      while(i < self.src.length){
	var s1 = self.src.charAt(i);
	if(fn_delimter(s1)){
	  return self.src.substring(0, i); // cut until delimiter.
	}
	i++;
      }
      return self.src;
    },
    _getValue : function(self){
      var s1 = self.src.charAt(0);
      var value;
      if(self._isSpace(s1)){
	self.src = self.src.substring(1);
	return arguments.callee(self);
      }
      // quoted value is enclosed by next quote.
      if(s1 === "\"" || s1 === "'"){
	var quote_pos = self.src.indexOf(s1, 1);
	value = self.src.substring(1, quote_pos);
	self.src = self.src.substring(value.length + 2);
	return value;
      }
      // unquoted value is enclosed by next delimiter.
      value = self._getSymbol(self, function(str){
	return self._isSpace(str);
      });
      self.src = self.src.substring(value.length);
      return value;
    },
    _getAttr : function(self, left){
      if(!self.hasNext()){
	return left? {name:left} : null;
      }
      var s1 = self.src.charAt(0);
      var value;

      // if space, just skip.
      if(self._isSpace(s1)){
	self.src = self.src.substring(1);
	return arguments.callee(self, left);
      }
      // if equal, search right value and return name and value attribute.
      if(s1 === "="){
	self.src = self.src.substring(1);
	value = self._getValue(self);
	return left? {name:left, value:value} : null;
      }
      // if not equal but left val exists, return empty attribute(without value).
      if(left){
	return {name:left}; // value empty attribute
      }
      // search left value
      value = self._getSymbol(self, function(str){
	return self._isSpace(str) || str === "=";
      });
      self.src = self.src.substring(value.length);
      return arguments.callee(self, value);
    }
  };

  return TagAttrGenerator;
})();
