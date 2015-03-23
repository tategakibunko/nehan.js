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
    getContent: function(){
      return this.content;
    }
  };

  return Text;
})();
