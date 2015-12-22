Nehan.LowerNameSet = (function(){
  /**
   @memberof Nehan
   @class LowerNameSet
   @constructor
   */
  function LowerNameSet(){
    Nehan.Set.call(this);
  }
  Nehan.Class.extend(LowerNameSet, Nehan.Set);

  /**
   @memberof Nehan.LowerNameSet
   @param value {String}
   @return {Nehan.LowerNameSet}
   */
  LowerNameSet.prototype.add = function(name){
    return Nehan.Set.prototype.add.call(this, name.toLowerCase());
  };

  return LowerNameSet;
})();
