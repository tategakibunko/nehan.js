var OutlineContext = (function(){
  function OutlineContext(markup_name){
    this.logs = [];
    this.markupName = markup_name;
  }

  OutlineContext.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    get : function(index){
      return this.logs[index] || null;
    },
    getMarkupName : function(){
      return this.markupName;
    },
    startSection : function(type){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:DocumentContext.getPageNo()
      });
      return this;
    },
    endSection : function(type){
      this.logs.push({
	name:"end-section",
	type:type
      });
      return this;
    },
    addHeader : function(opt){
      // header id is used to associate header box object with outline.
      var header_id = DocumentContext.genHeaderId();
      this.logs.push({
	name:"set-header",
	type:opt.type,
	rank:opt.rank,
	title:opt.title,
	pageNo:DocumentContext.getPageNo(),
	headerId:header_id
      });
      return header_id;
    }
  };

  return OutlineContext;
})();
