Nehan.TocContext = (function(){
  /**
     @memberof Nehan
     @class TocContext
     @classdesc context data of toc parsing.
     @constructor
  */
  function TocContext(){
    this.stack = [1];
  }

  /**
   @memberof Nehan.TocContext
   @return {String}
   @example
   * // assume that current toc stack is [1,2,1].
   * ctx.toString(); // "1.2.1"
   */
  TocContext.prototype.toString = function(){
    return this.stack.join(".");
  };
  /**
   countup toc count of current depth.

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2], and
   * // current toc depth is at 1(0 is first).
   * ctx.toString(); // "1.2"
   * ctx.stepNext();
   * ctx.toString(); // "1.3"
   */
  TocContext.prototype.stepNext = function(){
    if(this.stack.length > 0){
      this.stack[this.stack.length - 1]++;
    }
    return this;
  };
  /**
   append toc root

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2].
   * ctx.toString(); // "1.2"
   * ctx.startRoot();
   * ctx.toString(); // "1.2.1"
   */
  TocContext.prototype.startRoot = function(){
    this.stack.push(1);
    return this;
  };
  /**
   finish toc root

   @memberof Nehan.TocContext
   @return {Nehan.TocContext}
   @example
   * // assume that current toc stack is [1,2].
   * ctx.toString(); // "1.2"
   * ctx.startRoot();
   * ctx.toString(); // "1.2.1"
   * ctx.endRoot();
   * ctx.toString(); // "1.2"
   */
  TocContext.prototype.endRoot = function(){
    this.stack.pop();
    return this;
  };

  return TocContext;
})();
