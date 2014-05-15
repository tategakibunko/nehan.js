var Page = (function(){
  function Page(opt){
    Args.merge(this, {
      element:null,
      seekPos:0,
      pageNo:0,
      charPos:0,
      charCount:0,
      percent:0
    }, opt);
  }

  return Page;
})();

