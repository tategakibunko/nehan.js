var SelectorCombinator = {
  findDescendant : function(markup, parent_type){
    markup = markup.getParent();
    while(markup !== null && markup.name != "body"){
      if(parent_type.test(markup)){
	return markup;
      }
      markup = markup.getParent();
    }
    return null;
  },
  findChild : function(markup, parent_type){
    markup = markup.getParent();
    if(markup === null){
      return null;
    }
    return parent_type.test(markup)? markup : null;
  },
  findAdjSibling : function(markup, cur_type, prev_type){
    var childs = markup.getParentChilds();
    return List.find(childs, function(child){
      var next = child.getNext();
      return next && prev_type.test(child) && cur_type.test(next);
    });
  },
  findGenSibling : function(markup, cur_type, prev_type){
    var childs = markup.getParentChilds();
    var sibling = List.find(childs, function(child){
      return prev_type.test(child);
    });
    if(sibling === null){
      return null;
    }
    markup = sibling.getNext();
    while(markup !== null && markup.name != "body"){
      if(cur_type.test(markup)){
	return sibling;
      }
      markup = markup.getNext();
    }
    return null;
  }
};

