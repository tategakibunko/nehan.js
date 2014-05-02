var PageGroup = (function(){
  function PageGroup(group_size, pages){
    var first = pages[0];
    Page.call(this, {
      percent:first.percent,
      pageNo:first.pageNo,
      seekPos:first.seekPos,
      charPos:first.charPos,
      charCount:List.sum(pages, function(page){ return page.charCount; })
    });
    this.groupSize = group_size;
    this.pages = pages;
  }
  Class.extend(PageGroup, Page);

  PageGroup.prototype.getGroupSize = function(){
    return this.groupSize;
  };

  PageGroup.prototype.getGroup = function(pos){
    var page = this.pages[pos] || null;
    return page? page.element : null;
  };

  return PageGroup;
})();
