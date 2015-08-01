Nehan.Text = (function(){
  /**
     @memberof Nehan
     @class Text
     @param content {String}
  */
  function Text(content){
    this.content = content;
  }

  /**
   check if text consists of white space only

   @memberof Nehan.Text
   @return {boolean}
   */
  Text.prototype.isWhiteSpaceOnly = function(){
    // \s contain multi character space,
    // but we want to replace half one only.
    var replaced = this.content
	  .replace(/ /g, "") // half space
	  .replace(/\n/g, "")
	  .replace(/\t/g, "");
    return replaced === "";
  };

  /**
   @memberof Nehan.Text
   @return {String}
   */
  Text.prototype.getContent = function(){
    return this.content;
  };

  return Text;
})();
