var Text = (function(){
  /**
     @memberof Nehan
     @class Text
     @param content {String}
  */
  function Text(content){
    this.content = content;
  }

  Text.prototype = {
    isWhiteSpaceOnly: function(){
      return this.content.replace(/[\s\n]/g, "") === "";
    },
    getContent: function(){
      return this.content;
    }
  };

  return Text;
})();
