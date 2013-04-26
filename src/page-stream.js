var PageStream = Class.extend({
  init : function(text){
    this.text = this._createSource(text);
    this.generator = this._createGenerator(this.text);
    this.evaluator = this._createEvaluator();
    this.buffer = [];
    this._timeStart = null;
    this._timeElapsed = null;
    this._seekPageNo = 0;
  },
  hasPage : function(page_no){
    return (typeof this.buffer[page_no] != "undefined");
  },
  hasNext : function(){
    return this.generator.hasNext();
  },
  getNext : function(){
    if(!this.hasNext()){
      return null;
    }
    if(!this.hasPage(this._seekPageNo)){
      this._addBuffer(this._yield());
    }
    return this.get(this._seekPageNo++);
  },
  // int -> EvalResult
  get : function(page_no){
    var entry = this.buffer[page_no];
    if(entry instanceof EvalResult){ // already evaluated.
      return entry;
    }
    // if still not evaluated, eval and get EvalResult
    var result = this.evaluator.evaluate(entry);
    this.buffer[page_no] = result; // over write buffer entry by result.
    return result;
  },
  getPageCount : function(){
    return this.buffer.length;
  },
  getOutlineTree : function(root_name){
    return this.generator.getOutlineTree(root_name || "body");
  },
  getOutlineNode : function(root_name, opt){
    var tree = this.getOutlineTree(root_name);
    var converter = new OutlineConverter(tree, opt || {});
    return converter.outputNode();
  },
  getAnchors : function(){
    return this.generator.getAnchors();
  },
  getAnchorPageNo : function(anchor_name){
    return this.generator.getAnchorPageNo(anchor_name);
  },
  setAnchor : function(name, page_no){
    this.generator.setAnchor(name, page_no);
  },
  getTimeElapsed : function(){
    return this._timeElapsed;
  },
  syncGet : function(){
    this._setTimeStart();
    while(this.generator.hasNext()){
      this.getNext();
    }
    return this._setTimeElapsed();
  },
  asyncGet : function(opt){
    Args.merge(this, {
      onComplete : function(time){},
      onProgress : function(page_no, percent, seek_pos){}
    }, opt || {});
    this._setTimeStart();
    this._asyncGet(0, opt.wait || 0);
  },
  _yield : function(){
    return this.generator.yield();
  },
  _setTimeStart : function(){
    this._timeStart = (new Date()).getTime();
    return this._timeStart;
  },
  _setTimeElapsed : function(){
    this._timeElapsed = (new Date()).getTime() - this._timeStart;
    return this._timeElapsed;
  },
  _asyncGet : function(page_no, wait){
    if(!this.generator.hasNext()){
      var time = this._setTimeElapsed();
      this.onComplete(time);
      return;
    }
    var self = this;
    var entry = this._yield();
    this._addBuffer(entry);
    this.onProgress(page_no, entry.percent, entry.seekPos);
    setTimeout(function(){
      self._asyncGet(page_no + 1, wait);
    }, wait);
  },
  _addBuffer : function(entry){
    // if entry can't be lazy, eval immediately.
    if(!entry.lazy){
      entry = this.evaluator.evaluate(entry);
    }
    this.buffer.push(entry);
  },
  // common preprocessor
  _createSource : function(text){
    return text.replace(/(<[^>]+>)/g, function(all, grp){
	return grp.toLowerCase();
      })
      .replace(/(\/[a-z0-9\-]+>)[\s\n]+(<[^\/])/g, "$1$2") // discard space between close tag and open tag.
      .replace(/\t/g, "") // discard TAB
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/g, "") // discard rp
      .replace(/<rb>/g, "") // discard rb
      .replace(/<\/rb>/g, "") // discard /rb
      .replace(/<rt><\/rt>/g, ""); // discard empty rt
  },
  _createGenerator : function(text){
    return new BodyPageGenerator(text);
  },
  _createEvaluator : function(){
    return new PageEvaluator();
  }
});
