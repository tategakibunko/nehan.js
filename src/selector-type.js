var SelectorType = (function(){
  function SelectorType(opt){
    this.name = opt.name;
    this.id = opt.id;
    this.className = opt.className;
    this.attr = opt.attr;
    this.pseudo = opt.pseudo;
  }
  
  SelectorType.prototype = {
    // see: http://www.w3.org/TR/css3-selectors/#specificity
    _countSpecificity : function(){
    },
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
      if(this.attr && !this.attr.test(markup)){
	return false;
      }
      if(this.pseudo && !this.pseudo.test(markup)){
	return false;
      }
      return true;
    }
  };

  return SelectorType;
})();

