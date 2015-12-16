Nehan.Set = (function(){
  /**
   @memberof Nehan
   @class Set
   @constructor
   */
  function Set(){
    this.values = [];
  }

  /**
   @memberof Nehan.Set
   @param {Function} value -> index -> ()
   */
  Set.prototype.iter = function(fn){
    this.values.forEach(fn);
  };

  /**
   @memberof Nehan.Set
   @return {int}
   */
  Set.prototype.length = function(){
    return this.values.length;
  };

  /**
   @memberof Nehan.Set
   @return {bool}
   */
  Set.prototype.isEmpty = function(value){
    return this.length() === 0;
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {bool}
   */
  Set.prototype.exists = function(value){
    return Nehan.List.exists(this.values, Nehan.Closure.eq(value));
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {Nehan.Set}
   */
  Set.prototype.remove = function(value){
    var index = Nehan.List.indexOf(this.values, Nehan.Closure.eq(value));
    if(index >= 0){
      this.values.splice(index, 1);
    }
    return this;
  };

  /**
   @memberof Nehan.Set
   @param value {Any}
   @return {Nehan.Set}
   */
  Set.prototype.add = function(value){
    if(!this.exists(value)){
      this.values.push(value);
    }
    return this;
  };

  /**
   @memberof Nehan.Set
   @param values {Array}
   @return {Nehan.Set}
   */
  Set.prototype.addValues = function(values){
    values.forEach(function(value){
      this.add(value);
    }.bind(this));
    return this;
  };

  /**
   @memberof Nehan.Set
   @param set {Nehan.Set}
   @return {Nehan.Set}
   */
  Set.prototype.union = function(set){
    var union_values = this.values.concat(); // create cloned array
    set.iter(function(value){
      if(!this.exists(value)){
	union_values.push(value);
      }
    }.bind(this));
    var union_set = new Set();
    union_set.values = union_values;
    return union_set;
  };

  /**
   @memberof Nehan.Set
   @return {Array}
   */
  Set.prototype.getValues = function(){
    return this.values;
  };

  return Set;
})();

