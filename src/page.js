var Page = (function(){
  function Page(opt){
    Args.merge(this, {
      html:"",
      seekPos:0,
      pageNo:0,
      charPos:0,
      charCount:0,
      percent:0
    }, opt);
  }

  Page.prototype = {
    getGroupSize : function(){
      return 1;
    },
    getGroupHtml : function(pos){
      return this.html;
    }
  };

  return Page;
})();

