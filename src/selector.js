var Selector = (function(){
  function Selector(key, val){
    this.key = key.toLowerCase();
    this.rex = this._createRegExp(this.key);
    this.val = val;
  }

  Selector.prototype = {
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.val;
    },
    test : function(dst_key){
      dst_key = dst_key.toLowerCase();
      if(this.rex === null){
	return this.key === dst_key;
      }
      return this.rex.test(dst_key);
    },
    _createPattern : function(key){
      return key
	.replace(/\s+/g, " ")
	.replace(/([^\s\.\^]*)\.(\S+)/g, "$1\\.$2")
	.replace(/\s/g, "(\\s|[a-z0-9-_=:\\[\\]])*") + "$";
    },
    _createRegExp : function(key){
      if(key.indexOf(".") < 0 && key.indexOf(" ") < 0){
	return null;
      }
      var pat = this._createPattern(key);
      return new RegExp(pat);
    }
  };

  return Selector;
})();

