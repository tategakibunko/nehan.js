var TextEmphaPos = (function(){
  /**
     @memberof Nehan
     @class TextEmphaPos
     @classdesc abstraction of text-empha-position, but not impremented yet.
     @constructor
     @param opt {Object}
     @param opt.hori {String} - horizontal empha pos, default "over"
     @param opt.vert {String} - vertical empha pos, default "right"
  */
  function TextEmphaPos(opt){
    Nehan.Args.merge(this, {
      hori:"over",
      vert:"right"
    }, opt || {});
  }

  TextEmphaPos.prototype = {
    /**
       not implemented yet.

       @memberof Nehan.TextEmphaPos
       @return {Object}
    */
    getCss : function(line){
      var css = {};
      return css;
    }
  };

  return TextEmphaPos;
})();

