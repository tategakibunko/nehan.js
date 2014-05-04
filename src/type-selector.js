/* 
   single element type selector

   example:

   1. name selector
     div {font-size:xxx}

   2. class selector
     div.class{font-size:xxx}

   3. id selector
     div#id{font-size:xxx}

   4. attribute selector
     div[name=value]{font-size:xxx}

   5. pseudo-class selector
     li:first-child{font-weight:bold}

   6. pseudo-element selector
     div::first-line{font-size:xxx}
*/
var TypeSelector = (function(){
  function TypeSelector(opt){
    this.name = opt.name;
    this.id = opt.id;
    this.className = opt.className;
    this.attrs = opt.attrs;
    this.pseudo = opt.pseudo;
  }
  
  TypeSelector.prototype = {
    test : function(style){
      if(style === null){
	return false;
      }
      // name selector
      if(this.name && this.name != "*" && style.getMarkupName() != this.name){
	return false;
      }
      // class selector
      if(this.className && !style.hasMarkupClassName(this.className)){
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
    },
    getIdSpec : function(){
      return this.id? 1 : 0;
    },
    getClassSpec : function(){
      return this.className? 1 : 0;
    },
    getTypeSpec : function(){
      return (this.name !== "*" && this.name !== "") ? 1 : 0;
    },
    getPseudoClassSpec : function(){
      if(this.pseudo){
	return this.pseudo.hasPseudoElement()? 0 : 1;
      }
      return 0;
    },
    getAttrSpec : function(){
      return this.attrs.length;
    },
    _testAttrs : function(style){
      return List.forall(this.attrs, function(attr){
	return attr.test(style);
      });
    }
  };

  return TypeSelector;
})();

