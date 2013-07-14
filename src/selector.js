var Selector = (function(){
  function Selector(key, value){
    this.key = this._createKey(key);
    this.rex = this._createRegExp(this.key);
    this.value = this._formatValue(value);
  }

  var set_format_value = function(ret, prop, format_value){
    if(format_value instanceof Array){
      set_format_values(ret, format_value);
    } else {
      ret[prop] = format_value;
    }
  };

  var set_format_values = function(ret, format_values){
    List.iter(format_values, function(fmt_value){
      for(var prop in fmt_value){
	set_format_value(ret, prop, fmt_value[prop]);
      }
    });
  };

  Selector.prototype = {
    getKey : function(){
      return this.key;
    },
    getValue : function(){
      return this.value;
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
    _formatValue : function(value){
      var ret = {};
      for(var prop in value){
	set_format_value(ret, prop, CssParser.format(prop, value[prop]));
      }
      return ret;
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

