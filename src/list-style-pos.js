Nehan.ListStylePos = (function(){
  /**
   @memberof Nehan
   @class ListStylePos
   @classdesc abstraction of list-style-pos.
   @constructor
   @param pos {String} - "outside" or "inside"
   */
  function ListStylePos(pos){
    this.pos = pos;
  }

  /**
   @memberof Nehan.ListStylePos
   @return {boolean}
   */
  ListStylePos.prototype.isOutside = function(){
    return this.pos === "outside";
  };
  /**
   @memberof Nehan.ListStylePos
   @return {boolean}
   */
  ListStylePos.prototype.isInside = function(){
    return this.pos === "inside";
  };

  return ListStylePos;
})();

