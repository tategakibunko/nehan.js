var TagAttrGenerator = (function(){
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
    _isDelimiter : function(s1){
      return s1 === "&#3000;" || s1.match(/[\s=]/);
    },
    _getPhrase : function(){
      var i = 1;
      while(i < this.src.length){
	var s1 = this.src.substring(i, i+1);
	if(this._isDelimiter(s1)){
	  return this.src.substring(0, i);
	}
	i++;
      }
      return this.src;
    },
    _getAttr : function(self, left){
      if(!self.hasNext()){
	return left? {name:left} : null;
      }
      var callee = arguments.callee;
      var s1 = self.src.charAt(0);
      var value;
      if(self._isDelimiter(s1)){
	self.src = self.src.substring(1);
	return callee(self, left);
      } else if(s1 === "\"" || s1 === "'"){
	var quote_pos = self.src.indexOf(s1, 1);
	value = self.src.substring(1, quote_pos);
	self.src = self.src.substring(value.length + 2);
	return left? {name:left, value:value} : callee(self, value);
      } else if(left){
	return {name:left}; // value empty attribute
      } else {
	value = self._getPhrase(self.src);
	self.src = self.src.substring(value.length);
	return callee(self, value);
      }
    }
  };

  return TagAttrGenerator;
})();
