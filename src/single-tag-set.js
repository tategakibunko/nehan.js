Nehan.SingleTagSet = (function(){
  /**
   @memberof Nehan
   @class SingleTagSet
   @constructor
   */
  function SingleTagSet(){
    Nehan.Set.call(this);
  }
  Nehan.Class.extend(SingleTagSet, Nehan.Set);

  /**
   @memberof Nehan.SingleTagSet
   @param value {String}
   @return {Nehan.SingleTagSet}
   */
  SingleTagSet.prototype.add = function(name){
    return Nehan.Set.prototype.add.call(this, name.toLowerCase());
  };

  return SingleTagSet;
})();
