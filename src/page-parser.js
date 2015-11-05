Nehan.PageParser = (function(){
  /**
     @memberof Nehan
     @class PageParser
     @consturctor
     @param text {String} - html source text
  */
  function PageParser(text, context){
    this.context = context;
    this.generator = new Nehan.DocumentGenerator(text, context);
  }

  var reqAnimationFrame = (function(){
    var default_wait = 1000 / 60;
    return window.requestAnimationFrame  ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.msRequestAnimationFrame     ||
      function(callback, wait){
	var _wait = (typeof wait === "undefined")? default_wait : wait;
	window.setTimeout(callback, _wait);
      };
  })();

  /**
   @memberof Nehan.PageParser
   @param opt {Object}
   @param opt.onProgress {Function} - fun {@link Nehan.Box} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> ()
   @param opt.onError {Function} - fun error:{String} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} upper bound of page count
   */
  PageParser.prototype.parse = function(opt){
    this._setTimeStart();
    this._parse(
      Nehan.Args.merge({}, {
	capturePageText: false,
	maxPageCount: Nehan.Config.maxPageCount,
	onComplete: function(time){},
	onProgress: function(tree){},
	onError: function(error){}
      }, opt || {})
    );
  };

  PageParser.prototype._setTimeStart = function(){
    this._timeStart = (new Date()).getTime();
    return this._timeStart;
  };

  PageParser.prototype._getTimeElapsed = function(){
    return (new Date()).getTime() - this._timeStart;
  };

  PageParser.prototype._parse = function(opt){
    if(!this.generator.hasNext() || (this.context.yieldCount >= opt.maxPageCount)){
      opt.onComplete.call(this, this._getTimeElapsed(), this.context);
      return;
    }
    var tree = this.generator.yield();
    if(tree){
      if(opt.capturePageText){
	tree.text = tree.toString();
      }
      opt.onProgress.call(this, tree, this.context);
    }
    reqAnimationFrame(function(){
      this._parse(opt);
    }.bind(this));
  };

  return PageParser;
})();

