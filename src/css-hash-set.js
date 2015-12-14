Nehan.CssHashSet = (function(){
  /**
     @memberof Nehan
     @class CssHashSet
     @classdesc hash set for css
     @extends {Nehan.HashSet}
  */
  function CssHashSet(values){
    Nehan.HashSet.call(this, values);
  }
  Nehan.Class.extend(CssHashSet, Nehan.HashSet);

  /**
     add [value] by [name]. CssHashSet::merge is called if [name] is already registered.

     @memberof Nehan.CssHashSet
     @param name {String} - css property name(camel-cased, or chain-cased)
     @param value
  */
  CssHashSet.prototype.add = function(name, value){
    Nehan.HashSet.prototype.add.call(this, name, value);
  };

  /**
   * merge css value<br>
   * 1. if old_value is object, merge each properties.<br>
   * 2. other case, simplly overwrite new_value to old_value(even if new_value is function).<br>

   @memberof Nehan.CssHashSet
   @method merge
   @param old_value
   @param new_value
  */
  CssHashSet.prototype.merge = function(old_value, new_value){
    if(typeof old_value === "object" && typeof new_value === "object"){
      return Nehan.Obj.copy(old_value, new_value);
    }
    return new_value;
  };

  return CssHashSet;
})();
