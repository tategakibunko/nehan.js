var CssHashSet = (function(){
  function CssHashSet(values){
    HashSet.call(this, values || null);
  }
  Class.extend(CssHashSet, HashSet);

  // merge css value
  // 1. if old_value is object, merge each properties.
  // 2. other case, simplly overwrite new_value to old_value(even if new_value is function).
  CssHashSet.prototype.merge = function(old_value, new_value){
    if(typeof old_value === "object"){
      Args.copy(old_value, new_value);
      return old_value;
    }
    return new_value;
  };

  return CssHashSet;
})();
