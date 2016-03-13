/* 
 single element type selector

 example:

   1. type selector
     div {font-size:xxx}
     /h[1-6]/ {font-weight:xxx}

   2. class selector
     div.class{font-size:xxx}
     div.class1.class2{color:yyy}

   3. id selector
     div#id{font-size:xxx}

   4. attribute selector
     div[name=value]{font-size:xxx}
     div[name1=value1][name1^=xxx]{color:yyy}

   5. pseudo-class selector
     li:first-child{font-weight:bold}

   6. pseudo-element selector
     div::first-line{font-size:xxx}
*/
Nehan.CompoundSelector = (function(){
  /**
     @memberof Nehan
     @class CompoundSelector
     @classdesc selector abstraction(name, class, id, attribute, pseudo).
     @constructor
     @param opt {Object}
     @param opt.name {String}
     @param opt.nameRex {RegExp}
     @param opt.id {String}
     @param opt.classes {Array<String>}
     @param opt.attrs {Array<Nehan.AttrSelector>}
     @param opt.pseudoClass {Nehan.PseudoClassSelector}
     @param opt.pseudoElement {Nehan.PseudoElementSelector}
     @description <pre>

     1. name selector
       div {font-size:xxx}
       /h[1-6]/ {font-weight:xxx}

     2. class selector
       div.class{font-size:xxx}
       div.class1.class2{color:yyy}

     3. id selector
       div#id{font-size:xxx}

     4. attribute selector
       div[name=value]{font-size:xxx}
       div[name1=value1][name1^=xxx]{color:yyy}

     5. pseudo-class selector
       li:first-child{font-weight:bold}

     6. pseudo-element selector
       div::first-line{font-size:xxx}
     </pre>
  */
  function CompoundSelector(opt){
    this.name = opt.name || null;
    this.nameRex = opt.nameRex || null;
    this.id = opt.id || null;
    this.classes = opt.classes || [];
    this.attrs = opt.attrs || [];
    this.pseudoClass = opt.pseudoClass || null;
    this.pseudoElement = opt.pseudoElement || null;
    this.classes.sort();
  }
  
  /**
   check if [style] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param style {Nehan.Style}
   @return {boolean}
   */
  CompoundSelector.prototype.test = function(style){
    if(style === null){
      return false;
    }
    // name selector
    if(this.name && !this.testName(style.getMarkupName())){
      return false;
    }
    // name selector(by rex)
    if(this.nameRex && !this.testNameRex(style.getMarkupName())){
      return false;
    }
    // class selector
    if(this.classes.length > 0 && !this.testClassNames(style.getMarkupClasses())){
      return false;
    }
    // id selector
    if(this.id && style.getMarkupId() != this.id){
      return false;
    }
    // attribute selectgor
    if(this.attrs.length > 0 && !this._testAttrs(style)){
      return false;
    }
    // pseudo-class selector
    if(this.pseudoClass && !this.pseudoClass.test(style)){
      return false;
    }
    return true;
  };
  /**
   check if [markup_name] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_name {String}
   @return {boolean}
   */
  CompoundSelector.prototype.testName = function(markup_name){
    if(this.name === null){
      return false;
    }
    if(this.name === "*"){
      return true;
    }
    return markup_name === this.name;
  };
  /**
   check if [markup_name] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_name {String}
   @return {boolean}
   */
  CompoundSelector.prototype.testNameRex = function(markup_name){
    if(this.nameRex === null){
      return false;
    }
    return this.nameRex.test(markup_name);
  };
  /**
   check if [markup_classes] is matched to this selector

   @memberof Nehan.CompoundSelector
   @param markup_classes {Array.<String>}
   @return {boolean}
   */
  CompoundSelector.prototype.testClassNames = function(markup_classes){
    return this.classes.every(function(klass){
      return Nehan.List.exists(markup_classes, Nehan.Closure.eq(klass));
    });
  };
  /**
   get name specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getNameSpec = function(){
    if(this.nameRex){
      return 1;
    }
    if(this.name === null || this.name === "*"){
      return 0;
    }
    return 1;
  };
  /**
   get id specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getIdSpec = function(){
    return this.id? 1 : 0;
  };
  /**
   get class specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getClassSpec = function(){
    return this.classes.length;
  };
  /**
   get attribute specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getAttrSpec = function(){
    return this.attrs.length;
  };
  /**
   get pseudo-class specificity of this selector

   @memberof Nehan.CompoundSelector
   @return {int}
   */
  CompoundSelector.prototype.getPseudoClassSpec = function(){
    if(this.pseudoClass && !this.pseudoElement){
      return 1;
    }
    return 0;
  };

  CompoundSelector.prototype._testAttrs = function(style){
    return this.attrs.every(function(attr){
      return attr.test(style);
    });
  };

  return CompoundSelector;
})();

