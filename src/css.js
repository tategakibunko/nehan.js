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
  },
  toVenderizedList:function(prop){
    var ret = List.map(Const.cssVenderPrefixes, function(prefix){
      return [prefix, prop].join("-");
    });
    ret.push(prop); // add non vendered prop
    return ret;
  },
  toClassProp: function(cssProp){
    var parts = cssProp.split("-");
    return parts[0] + List.fold(parts.slice(1), "", function(ret, rest){
      return ret + Utils.capitalize(rest);
    });
  },
  sortCorner : function(dir1, dir2){
    var order = {top:0, bottom:1, left:2, right:3};
    return [dir1, dir2].sort(function (c1, c2){
      return order[c1] - order[c2];
    });
  }
};
