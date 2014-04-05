var OutlineContext = (function(){
  function OutlineContext(style){
    this.logs = [];
    this.style = style;
    this.pageNo = 0;
  }

  var __header_id__ = 0; // glocal unique header id
  var gen_header_id = function(){
    return __header_id__++;
  };

  OutlineContext.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    getPageNo : function(){
      return this.pageNo;
    },
    stepPageNo : function(){
      this.pageNo++;
    },
    getMarkupName : function(){
      return this.style.getMarkupName();
    },
    startSection : function(type){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:this.pageNo
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
      var header_id = gen_header_id();
      this.logs.push({
	name:"set-header",
	type:opt.type,
	rank:opt.rank,
	title:opt.title,
	pageNo:this.pageNo,
	headerId:header_id
      });
      return header_id;
    }
  };

  return OutlineContext;
})();
