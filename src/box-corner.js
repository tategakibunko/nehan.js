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
       get normalized(and camel-cased) corner property name
       @memberof Nehan.BoxCorner
       @param dir1 {string}
       @param dir2 {string}
       @return {string}
       @example
       * BoxCorner.getCornerName("right", "top"); // => "topRight"
    */
    getCornerName : function(dir1, dir2){
      var dirs = __sort(dir1, dir2);
      return [dirs[0], Nehan.Utils.capitalize(dirs[1])].join("");
    }
  };
})();
