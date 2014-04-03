var DocumentContext = (function(){
  function DocumentContext(opt){
    opt = opt || {};
    this.layout = opt.layout || new LayoutContext();
  }

  DocumentContext.prototype = {
    createStartContext : function(){
    },
    createChildBlockContext : function(opt){
      return new DocumentContext({
	layout:this.createLayoutContext(
	  opt.measure || this.layout.getBlockRestMeasure(),
	  opt.extent || this.layout.getInlineRestMeasure()
	),
	style:this.style
      });
    }
  };
  
  return DocumentContext;
})();


  

