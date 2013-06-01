var Selector = (function(){
  function Selector(key, val){
    this.key = this._createKey(key);
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
    hasClass : function(){
      return (/\.[^\.\s]+/).test(this.key);
    },
    hasId : function(){
      return (/#[^#\s]+/).test(this.key);
    },
    hasContext : function(){
      return (/[\S]+\s+[\S]+/).test(this.key);
    },
    _createKey : function(key){
      return Utils.trim(key).toLowerCase()
	.replace(/\s+/g, " ") // shorten space
      ;
    },
    _createPattern : function(key){
      return key
	.replace(/([^\s#\^]*)#(\S+)/g, "$1#$2")
	.replace(/([^\s\.\^]*)\.(\S+)/g, "$1\\.$2")
	.replace(/\s/g, "(\\s|[a-z0-9-_=:\\[\\]])*") + "$";
    },
    _createRegExp : function(key){
      if(!this.hasId() && !this.hasClass() && !this.hasContext()){
	return null;
      }
      var pat = this._createPattern(key);
      return new RegExp(pat);
    }
  };

  return Selector;
})();

