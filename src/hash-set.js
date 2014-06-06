var HashSet = (function(){
  function HashSet(values){
    this._values = {};
    if(values){
      this.addValues(values);
    }
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
    get : function(name){
      return this._values[name] || null;
    },
    getValues : function(){
      return this._values;
    },
    add : function(name, value){
      var old_value = this._values[name] || null;
      this._values[name] = old_value? this.merge(old_value, value) : value;
    },
    addValues : function(values){
      for(var prop in values){
	this.add(prop, values[prop]);
      }
    }
  };

  return HashSet;
})();



