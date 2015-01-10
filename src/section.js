var Section = (function(){
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

  Section.prototype = {
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    isRoot : function(){
      return this._parent === null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    isAuto : function(){
      return this._auto;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasHeader : function(){
      return this._header !== null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasHeaderId : function(){
      return this.getHeaderId() > 0;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasChild : function(){
      return this._child !== null;
    },
    /**
       @memberof Nehan.Section
       @return {boolean}
    */
    hasNext : function(){
      return this._next !== null;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getNext : function(){
      return this._next;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getChild : function(){
      return this._child;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.Section}
    */
    getParent : function(){
      return this._parent;
    },
    /**
       @memberof Nehan.Section
       @return {Nehan.SectionHeader}
    */
    getHeader : function(){
      return this._header;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getHeaderId : function(){
      if(this._header){
	return this._header.getId();
      }
      return null;
    },
    /**
       @memberof Nehan.Section
       @param header {Nehan.SectionHeader}
    */
    setHeader : function(header){
      this._header = header;
    },
    /**
       @memberof Nehan.Section
    */
    setAuto : function(){
      this._auto = true;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getRank : function(){
      return this._header? this._header.rank : 0;
    },
    /**
       @memberof Nehan.Section
       @return {String}
    */
    getTitle : function(){
      return this._header? this._header.title : ["untitled", this._type].join(" ");
    },
    /**
       @memberof Nehan.Section
       @return {String}
    */
    getType : function(){
      return this._type;
    },
    /**
       @memberof Nehan.Section
       @return {int}
    */
    getPageNo : function(){
      return this._pageNo;
    },
    /**
       @memberof Nehan.Section
       @param page_no {int}
    */
    updatePageNo : function(page_no){
      this._pageNo = page_no;
    },
    /**
       @memberof Nehan.Section
       @param section {Nehan.Section}
    */
    addChild : function(section){
      if(this._child === null){
	this._child = section;
      } else {
	this._child.addNext(section);
      }
    },
    /**
       @memberof Nehan.Section
       @param section {Nehan.Section}
    */
    addNext : function(section){
      if(this._next === null){
	this._next = section;
      } else {
	this._next.addNext(section);
      }
    }
  };

  return Section;
})();

