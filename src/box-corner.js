/**
   @namespace Nehan.BoxCorner
*/
Nehan.BoxCorner = (function(){
  var __sort = function(dir1, dir2){
    var order = {top:0, bottom:1, left:2, right:3};
    return [dir1, dir2].sort(function (c1, c2){
      return order[c1] - order[c2];
    });
  };
  return {
    /**
     @memberof Nehan.BoxCorner
     @param flow {Nehan.BoxFlow}
     @param corner_name {String} logical corner name ['before-start' | 'before-end' | 'after-end' | 'after-start']
     */
    getPhysicalCornerName : function(flow, corner_name){
      var dirs = corner_name.split("-");
      var dir1 = flow.getProp(dirs[0]);
      var dir2 = flow.getProp(dirs[1]);
      return __sort(dir1, dir2).join("-");
    }
  };
})();
