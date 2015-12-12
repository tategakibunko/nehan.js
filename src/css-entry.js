Nehan.CssEntry = (function(){
  /**
   @memberof Nehan
   @class CssEntry
   @constructor
   @param prop {Nehan.CssProp} - formatted css property
   @param value {Object} - formatted css value
   */
  function CssEntry(prop, value){
    this.prop = prop;
    this.value = value;
  }

  /**
   @memberof Nehan.CssEntry
   @return {string} - formatted property name
   */
  CssEntry.prototype.getPropName = function(){
    return this.prop.getName();
  };

  /**
   @memberof Nehan.CssEntry
   @return {string} - formatted property attribute. return null if not exists.
   */
  CssEntry.prototype.getPropAttr = function(){
    return this.prop.getAttr();
  };

  /**
   @memberof Nehan.CssEntry
   @return {Object|Number|String} - formatted css value.
   */
  CssEntry.prototype.getValue = function(){
    return this.value;
  };

  return CssEntry;
})();
