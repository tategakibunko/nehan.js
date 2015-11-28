Nehan.PageParser = (function(){
  /**
     @memberof Nehan
     @class PageParser
     @consturctor
     @param text {String} - html source text
  */
  function PageParser(generator){
    this.generator = generator;
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
   @param opt.onProgress {Function} - fun tree:{@link Nehan.Box} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onPage {Function} - fun page:{@link Nehan.Page} -> {@link Nehan.RenderingContext} -> ()
   @param opt.onComplete {Function} - fun time:{Float} -> context:{@link Nehan.RenderingContext} -> ()
   @param opt.onError {Function} - fun error:{String} -> ()
   @param opt.capturePageText {bool} output text node or not for each page object.
   @param opt.maxPageCount {int} upper bound of page count
   */
  PageParser.prototype.parse = function(opt){
    // set defaults
    opt = Nehan.Args.merge({}, {
      capturePageText: false,
      maxPageCount: Nehan.Config.maxPageCount,
      onPage: null,
      onComplete: function(time, ctx){},
      onProgress: function(tree, ctx){},
      onError: function(error){}
    }, opt || {});

    // if onPage is defined, rewrite onProgress callback.
    if(opt.onPage){
      var original_onprogress = opt.onProgress;
      opt.onProgress = function(tree, ctx){
	console.log("tree:", tree);
	original_onprogress(tree, ctx);
	var page = this.generator.context.getPage(tree.pageNo);
	if(page){
	  console.log("page:", page);
	  opt.onPage(page, ctx);
	}
      }.bind(this);
    }

    this._setTimeStart();
    this._parse(opt);
  };

  PageParser.prototype._setTimeStart = function(){
    this._timeStart = (new Date()).getTime();
    return this._timeStart;
  };

  PageParser.prototype._getTimeElapsed = function(){
    return (new Date()).getTime() - this._timeStart;
  };

  PageParser.prototype._parse = function(opt){
    if(!this.generator.hasNext() || (this.generator.context.yieldCount >= opt.maxPageCount)){
      opt.onComplete.call(this, this._getTimeElapsed(), this.generator.context);
      return;
    }
    var tree = this.generator.yield();
    if(tree){
      if(opt.capturePageText){
	tree.text = tree.toString();
      }
      opt.onProgress.call(this, tree, this.generator.context);
    }
    reqAnimationFrame(function(){
      this._parse(opt);
    }.bind(this));
  };

  return PageParser;
})();

