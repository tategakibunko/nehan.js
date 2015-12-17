Nehan.SectionHeader = (function(){
  /**
   @memberof Nehan
   @class SectionHeader
   @classdesc abstraction of section header with header rank, header title, and system unique id(optional).
   @param opt {Object}
   @param opt.id {String} - header_id string
   @param opt.rank {int} - header rank(h1 = 1, h2 = 2, ... etc)
   @param opt.title {String} - header title
   @constructor
   */
  function SectionHeader(opt){
    this.id = (typeof opt.id === "undefined")? -1 : opt.id;
    this.rank = opt.rank || 0;
    this.title = opt.title || "";
  }

  /**
   @memberof Nehan.SectionHeader
   @return {int}
   */
  SectionHeader.prototype.getId = function(){
    return this.id;
  };

  /**
   @memberof Nehan.SectionHeader
   @return {String}
   */
  SectionHeader.prototype.getTitle = function(){
    return this.title;
  };

  /**
   @memberof Nehan.SectionHeader
   @return {int}
   */
  SectionHeader.prototype.getRank = function(){
    return this.rank;
  };

  return SectionHeader;
})();
