var HashSet = (function(){
  /**
     @memberof Nehan
     @class HashSet
     @classdesc abstraction of (key, value) set.
     @constructor
   */
  function HashSet(values){
    this._values = values || {};
  }

  HashSet.prototype = {
    /**
       @memberof Nehan.HashSet
       @param fn {Function}
    */
    iter : function(fn){
      Obj.iter(this._values, fn);
    },
    /**
       merge new value to old value with same key. simply overwrite by default.

       @memberof Nehan.HashSet
       @param old_value
       @param new_value
    */
    merge : function(old_value, new_value){
      return new_value;
    },
    /**
       return union set between this and [set].

       @memberof Nehan.HashSet
       @param set {Nehan.HashSet}
     */
    union : function(set){
      var self = this;
      set.iter(function(key, value){
	self.add(key, value);
      });
      return this;
    },
    /**
       get value by name(key).

       @memberof Nehan.HashSet
       @name {String}
       @return {value}
    */
    get : function(name){
      return this._values[name] || null;
    },
    getValues : function(){
      return this._values;
    },
    /**
       add [value] by [name]. HashSet::merge is called if [name] is already registered.

       @memberof Nehan.HashSet
       @param name {String}
       @param value
    */
    add : function(name, value){
      var old_value = this._values[name] || null;
      this._values[name] = old_value? this.merge(old_value, value) : value;
    },
    /**
     * this function is used when performance matters,<br>
     * instead of using this.union(new HashSet(values))

       @memberof Nehan.HashSet
       @param values {Array}
    */
    addValues : function(values){
      for(var prop in values){
	this.add(prop, values[prop]);
      }
    },
    /**
       remove value associated with [name].

       @memberof Nehan.HashSet
       @param name {String}
    */
    remove : function(name){
      delete this._values[name];
    }
  };

  return HashSet;
})();



