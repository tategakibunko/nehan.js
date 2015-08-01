Nehan.SectionHeader = (function(){
  /**
     @memberof Nehan
     @class SectionHeader
     @classdesc abstraction of section header with header rank, header title, and system unique id(optional).
     @constructor
  */
  function SectionHeader(rank, title, id){
    this.rank = rank;
    this.title = title;
    this._id = id || 0;
  }

  /**
   @memberof Nehan.SectionHeader
   @return {int}
   */
  SectionHeader.prototype.getId = function(){
    return this._id;
  };

  return SectionHeader;
})();
