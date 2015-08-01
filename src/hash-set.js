Nehan.HashSet = (function(){
  /**
     @memberof Nehan
     @class HashSet
     @classdesc abstraction of (key, value) set.
     @constructor
   */
  function HashSet(values){
    this._values = Nehan.Obj.clone(values || {});
  }

  /**
   @memberof Nehan.HashSet
   @param fn {Function}
   */
  HashSet.prototype.iter = function(fn){
    Nehan.Obj.iter(this._values, fn);
  };
  /**
   merge new value to old value with same key. simply overwrite by default.

   @memberof Nehan.HashSet
   @param old_value
   @param new_value
   */
  HashSet.prototype.merge = function(old_value, new_value){
    return new_value;
  };
  /**
   return union set between this and [set].

   @memberof Nehan.HashSet
   @param set {Nehan.HashSet}
   */
  HashSet.prototype.union = function(set){
    set.iter(function(key, value){
      this.add(key, value);
    }.bind(this));
    return this;
  };
  /**
   get value by name(key).

   @memberof Nehan.HashSet
   @name {String}
   @return {value}
   */
  HashSet.prototype.get = function(name){
    return this._values[name] || null;
  };
  /**
   get all value by name(key).

   @memberof Nehan.HashSet
   @name {String}
   @return {Object}
   */
  HashSet.prototype.getValues = function(){
    return this._values;
  };
  /**
   add [value] by [name]. HashSet::merge is called if [name] is already registered.

   @memberof Nehan.HashSet
   @param name {String}
   @param value
   */
  HashSet.prototype.add = function(name, value){
    var old_value = this._values[name] || null;
    var new_value = old_value? this.merge(old_value, value) : value;
    this._values[name] = new_value;
  };
  /**
   * this function is used when performance matters,<br>
   * instead of using this.union(new HashSet(values))

   @memberof Nehan.HashSet
   @param values {Array}
   */
  HashSet.prototype.addValues = function(values){
    for(var prop in values){
      this.add(prop, values[prop]);
    }
  };
  /**
   remove value associated with [name].

   @memberof Nehan.HashSet
   @param name {String}
   */
  HashSet.prototype.remove = function(name){
    delete this._values[name];
  };

  return HashSet;
})();



