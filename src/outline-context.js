var OutlineContext = (function(){
  function OutlineContext(style){
    this.logs = [];
    this.style = style;
  }

  var __header_id__ = 0; // glocal unique header id
  var gen_header_id = function(){
    return __header_id__++;
  };

  OutlineContext.prototype = {
    isEmpty : function(){
      return this.logs.length === 0;
    },
    getMarkupName : function(){
      return this.style.getMarkupName();
    },
    addStartSection : function(type, page_no){
      this.logs.push({
	name:"start-section",
	type:type,
	pageNo:page_no
      });
      return this;
    },
    addEndSection : function(type){
      this.logs.push({
	name:"end-section",
	type:type
      });
      return this;
    },
    addSectionHeader : function(opt){
      this.logs.push({
	name:"set-header",
	type:opt.type,
	rank:opt.rank,
	title:opt.title,
	pageNo:opt.pageNo,
	headerId:gen_header_id() // header id is used to associate header box object with outline.
      });
      return this;
    }
  };

  return OutlineContext;
})();
