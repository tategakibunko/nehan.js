Nehan.Section = (function(){
  /**
   @memberof Nehan
   @class Section
   @classdesc section tree node with parent, next, child pointer.
   @constructor
  */
  function Section(type, parent, page_no){
    this._type = type;
    this._header = null;
    this._auto = false;
    this._next = null;
    this._child = null;
    this._parent = parent || null;
    this._pageNo = page_no || 0;
  }

  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.isRoot = function(){
    return this._parent === null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.isAuto = function(){
    return this._auto;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasHeader = function(){
    return this._header !== null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasHeaderId = function(){
    return this.getHeaderId() > 0;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasChild = function(){
    return this._child !== null;
  };
  /**
   @memberof Nehan.Section
   @return {boolean}
   */
  Section.prototype.hasNext = function(){
    return this._next !== null;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getNext = function(){
    return this._next;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getChild = function(){
    return this._child;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.Section}
   */
  Section.prototype.getParent = function(){
    return this._parent;
  };
  /**
   @memberof Nehan.Section
   @return {Nehan.SectionHeader}
   */
  Section.prototype.getHeader = function(){
    return this._header;
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getHeaderId = function(){
    if(this._header){
      return this._header.getId();
    }
    return null;
  };
  /**
   @memberof Nehan.Section
   @param header {Nehan.SectionHeader}
   */
  Section.prototype.setHeader = function(header){
    this._header = header;
  };
  /**
   @memberof Nehan.Section
   */
  Section.prototype.setAuto = function(){
    this._auto = true;
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getRank = function(){
    return this._header? this._header.rank : 0;
  };
  /**
   @memberof Nehan.Section
   @return {String}
   */
  Section.prototype.getTitle = function(){
    return this._header? this._header.title : ["untitled", this._type].join(" ");
  };
  /**
   @memberof Nehan.Section
   @return {String}
   */
  Section.prototype.getType = function(){
    return this._type;
  };
  /**
   @memberof Nehan.Section
   @return {int}
   */
  Section.prototype.getPageNo = function(){
    return this._pageNo;
  };
  /**
   @memberof Nehan.Section
   @param page_no {int}
   */
  Section.prototype.updatePageNo = function(page_no){
    this._pageNo = page_no;
  };
  /**
   @memberof Nehan.Section
   @param section {Nehan.Section}
   */
  Section.prototype.addChild = function(section){
    if(this._child === null){
      this._child = section;
    } else {
      this._child.addNext(section);
    }
  };
  /**
   @memberof Nehan.Section
   @param section {Nehan.Section}
   */
  Section.prototype.addNext = function(section){
    if(this._next === null){
      this._next = section;
    } else {
      this._next.addNext(section);
    }
  };

  return Section;
})();

