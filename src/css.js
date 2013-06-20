var Css = {
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      tmp.push(prop + ":" + Html.escape(args[prop] + ""));
    }
    return tmp.join(";");
  },
  addNehanPrefix : function(name){
    return "nehan-" + name;
  },
  addNehanHeaderPrefix : function(name){
    return "nehan-header-" + name;
  },
  addNehanTocLinkPrefix : function(name){
    return "nehan-toc-link-" + name;
  }
};
