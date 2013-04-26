var TocContext = (function(){
  function TocContext(){
    this.stack = [1];
  }

  TocContext.prototype = {
    getTocStack : function(){
      return this.stack;
    },
    getTocId : function(){
      return this.stack.join(".");
    },
    stepNext : function(){
      var len = this.stack.length;
      if(len > 0){
	this.stack[len-1]++;
      }
      return this;
    },
    startRoot : function(){
      this.stack.push(1);
      return this;
    },
    endRoot : function(){
      this.stack.pop();
      return this;
    }
  };

  return TocContext;
})();
