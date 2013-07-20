var SelectorType = (function(){
  function SelectorType(opt){
    this.name = opt.name;
    this.id = opt.id;
    this.className = opt.className;
    this.attrs = opt.attrs;
    this.pseudo = opt.pseudo;
  }
  
  SelectorType.prototype = {
    test : function(markup){
      if(markup === null){
	return false;
      }
      if(this.name && this.name != "*" && markup.getName() != this.name){
	return false;
      }
      if(this.className && !markup.hasClass(this.className)){
	return false;
      }
      if(this.id && markup.getTagAttr("id") != this.id){
	return false;
      }
      if(this.attrs.length > 0 && !this._testAttrs(markup)){
	return false;
      }
      if(this.pseudo && !this.pseudo.test(markup)){
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
	return this.pseudo.isPseudoElement()? 0 : 1;
      }
      return 0;
    },
    getAttrSpec : function(){
      return this.attrs.length;
    },
    _testAttrs : function(markup){
      return List.forall(this.attrs, function(attr){
	return attr.test(markup);
      });
    }
  };

  return SelectorType;
})();

