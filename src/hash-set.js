var HashSet = (function(){
  function HashSet(){
    this._values = {};
  }

  HashSet.prototype = {
    iter : function(fn){
      Obj.iter(this._values, fn);
    },
    filter : function(fn){
      return Obj.filter(this._values, fn);
    },
    // return merged value when conflict.
    // simply overwrite by default.
    merge : function(old_value, new_value){
      return new_value;
    },
    union : function(set){
      var self = this;
      set.iter(function(key, value){
	self.add(key, value);
      });
      return this;
    },
    get : function(name){
      return this._values[name] || null;
    },
    add : function(name, value){
      var old_value = this._values[name] || null;
      this._values[name] = old_value? this.merge(old_value, value) : value;
    },
    // this function is used when performance matters,
    // instead of using this.union(new HashSet(values))
    addValues : function(values){
      values = values || {};
      for(var prop in values){
	this.add(prop, values[prop]);
      }
    },
    remove : function(name){
      delete this._values[name];
    }
  };

  return HashSet;
})();



