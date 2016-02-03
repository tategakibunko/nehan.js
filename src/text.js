Nehan.Text = (function(){
  /**
     @memberof Nehan
     @class Text
     @param content {String}
  */
  function Text(content){
    this.content = this._normalize(content);
  }

  Text.prototype._normalize = function(text){
    return text.replace(/^\n+/, "");
  };

  /**
   check if text consists of white space only

   @memberof Nehan.Text
   @return {boolean}
   */
  Text.prototype.isWhiteSpaceOnly = function(){
    // avoid recognizing 'IDEOGRAPHIC SPACE' as white-space.
    if(this.content.indexOf("\u3000") >= 0){
      return false;
    }
    return this.content.match(/[\S]/)? false : true;
  };

  /**
   @memberof Nehan.Text
   @return {String}
   */
  Text.prototype.getContent = function(){
    return this.content;
  };

  /**
   @memberof Nehan.Text
   @return {Nehan.Char}
   */
  Text.prototype.getHeadChar = function(){
    return new Nehan.Char({data:this.content.substring(0,1)});
  };

  /**
   @memberof Nehan.Text
   @return {Nehan.Text}
   */
  Text.prototype.cutHeadChar = function(){
    this.content = this.content.substring(1);
    return this;
  };

  /**
   @memberof Nehan.Text
   @param flow {Nehan.BoxFlow}
   @return {String}
   */
  Text.prototype.toString = function(flow){
    return this.getContent();
  };

  return Text;
})();
