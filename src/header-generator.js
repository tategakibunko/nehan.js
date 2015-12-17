Nehan.HeaderGenerator = (function(){
  /**
   @memberof Nehan
   @class HeaderGenerator
   @classdesc generator of header tag(h1 - h6) conetnt, and create header context when complete.
   @constructor
   @extends {Nehan.BlockGenerator}
   @param context {Nehan.RenderingContext}
   */
  function HeaderGenerator(context){
    Nehan.BlockGenerator.call(this, context);
  }
  Nehan.Class.extend(HeaderGenerator, Nehan.BlockGenerator);

  HeaderGenerator.prototype._onComplete = function(block){
    var header_id = this.context.startHeaderContext();
    block.id = Nehan.Css.addNehanHeaderPrefix(header_id);
  };
  
  return HeaderGenerator;
})();

