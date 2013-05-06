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
      return src
	.replace(/\s+/g, " ")
	.replace(/([^\s\.\^]*)\.(\S+)/g, "$1\\.$2")
	.replace(/\s/g, "(\\s|[a-z0-9-_=:\\[\\]])*") + "$";
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

