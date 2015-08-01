/* 
   single element type selector

   example:

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
*/
Nehan.TypeSelector = (function(){
  /**
     @memberof Nehan
     @class TypeSelector
     @classdesc selector abstraction(name, class, id, attribute, pseudo).
     @constructor
     @param opt {Object}
     @param opt.name {String}
     @param opt.nameRex {RegExp}
     @param opt.id {String}
     @param opt.classes {Array<String>}
     @param opt.attrs {Array<Nehan.AttrSelector>}
     @param opt.pseudo {Nehan.PseudoSelector}
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
  function TypeSelector(opt){
    this.name = opt.name || null;
    this.nameRex = opt.nameRex || null;
    this.id = opt.id || null;
    this.classes = opt.classes || [];
    this.attrs = opt.attrs || [];
    this.pseudo = opt.pseudo || null;
    this.classes.sort();
  }
  
  /**
   check if [style] is matched to this selector

   @memberof Nehan.TypeSelector
   @param style {Nehan.StyleContext}
   @return {boolean}
   */
  TypeSelector.prototype.test = function(style){
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
    // pseudo-element, pseudo-class selector
    if(this.pseudo && !this.pseudo.test(style)){
      return false;
    }
    return true;
  };
  /**
   check if [markup_name] is matched to this selector

   @memberof Nehan.TypeSelector
   @param markup_name {String}
   @return {boolean}
   */
  TypeSelector.prototype.testName = function(markup_name){
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

   @memberof Nehan.TypeSelector
   @param markup_name {String}
   @return {boolean}
   */
  TypeSelector.prototype.testNameRex = function(markup_name){
    if(this.nameRex === null){
      return false;
    }
    return this.nameRex.test(markup_name);
  };
  /**
   check if [markup_classes] is matched to this selector

   @memberof Nehan.TypeSelector
   @param markup_classes {Array.<String>}
   @return {boolean}
   */
  TypeSelector.prototype.testClassNames = function(markup_classes){
    return Nehan.List.forall(this.classes, function(klass){
      return Nehan.List.exists(markup_classes, Nehan.Closure.eq(klass));
    });
  };
  /**
   get name specificity of this selector

   @memberof Nehan.TypeSelector
   @return {int}
   */
  TypeSelector.prototype.getNameSpec = function(){
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

   @memberof Nehan.TypeSelector
   @return {int}
   */
  TypeSelector.prototype.getIdSpec = function(){
    return this.id? 1 : 0;
  };
  /**
   get class specificity of this selector

   @memberof Nehan.TypeSelector
   @return {int}
   */
  TypeSelector.prototype.getClassSpec = function(){
    return this.classes.length;
  };
  /**
   get attribute specificity of this selector

   @memberof Nehan.TypeSelector
   @return {int}
   */
  TypeSelector.prototype.getAttrSpec = function(){
    return this.attrs.length;
  };
  /**
   get pseudo-class specificity of this selector

   @memberof Nehan.TypeSelector
   @return {int}
   */
  TypeSelector.prototype.getPseudoClassSpec = function(){
    if(this.pseudo){
      return this.pseudo.hasPseudoElement()? 0 : 1;
    }
    return 0;
  };

  TypeSelector.prototype._testAttrs = function(style){
    return Nehan.List.forall(this.attrs, function(attr){
      return attr.test(style);
    });
  };

  return TypeSelector;
})();

