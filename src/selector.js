var Selector = (function(){
  function Selector(src, val){
    this.src = src.toLowerCase();
    this.rex = this._createRegExp(this.src);
    this.val = val;
  }

  Selector.prototype = {
    getValue : function(){
      return this.val;
    },
    test : function(key){
      key = key.toLowerCase();
      if(this.rex === null){
	return this.src === key;
      }
      return this.rex.test(key);
    },
    _createPattern : function(src){
      return src.toLowerCase().replace(/\s+/g, " ").replace(/\./g, ".*\\.").replace(/\s/g, ".+");
    },
    _createRegExp : function(src){
      if(src.indexOf(".") < 0 && src.indexOf(" ") < 0){
	return null;
      }
      var pat = this._createPattern(src);
      return new RegExp(pat);
    }
  };

  return Selector;
})();

