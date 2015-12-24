/**
 @memberof Nehan
 @class SelectorEntry
 @param key {String}
 @param raw_value {Object|Function} - unformatted css entry value
 */
Nehan.SelectorEntry = (function(){
  function SelectorEntry(key, raw_value){
    this.complexSelector = new Nehan.ComplexSelector(key);
    this.value = new Nehan.SelectorValue(raw_value);
  }

  /**
   @memberof Nehan.SelectorEntry
   @return {String}
   */
  SelectorEntry.prototype.getKey = function(){
    return this.complexSelector.getKey();
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {int}
   */
  SelectorEntry.prototype.getSpec = function(){
    return this.complexSelector.getSpec();
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {Object} - formatted css value entries
   */
  SelectorEntry.prototype.getEntries = function(){
    return this.value.getEntries();
  };

  /**
   @memberof Nehan.SelectorEntry
   @param style {Nehan.Style}
   @return {boolean}
   */
  SelectorEntry.prototype.test = function(style){
    return this.complexSelector.test(style);
  };
  
  /**
   @memberof Nehan.SelectorEntry
   @param style {Nehan.Style}
   @param element_name {String} - "before", "after", "first-line", "first-letter"
   @return {boolean}
   */
  SelectorEntry.prototype.testPseudoElement = function(style, element_name){
    return this.complexSelector.testPseudoElement(style, element_name);
  };

  /**
   @memberof Nehan.ComplexSelector
   @return {boolean}
   */
  SelectorEntry.prototype.hasPseudoElement = function(){
    return this.complexSelector.hasPseudoElement();
  };

  /**
   @memberof Nehan.SelectorEntry
   @param element_name {String} - "first-letter", "first-line"
   @return {boolean}
   */
  SelectorEntry.prototype.hasPseudoElementName = function(element_name){
    return this.complexSelector.hasPseudoElementName(element_name);
  };

  /**
   @memberof Nehan.SelectorEntry
   @return {Nehan.SelectorEntry}
   */
  SelectorEntry.prototype.updateValue = function(raw_entries){
    var fmt_value = new Nehan.SelectorValue(raw_entries);
    this.value.merge(fmt_value);
    return this;
  };

  return SelectorEntry;
})();

