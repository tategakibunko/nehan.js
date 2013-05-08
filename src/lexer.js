var Lexer = (function (){

  var rexTcy = /\d\d|!\?|!!|\?!|\?\?/;
  var rexWord = /^([\w!\.\?\/\_:#;"',]+)/;
  var rexTag = /^(<[^>]+>)/;
  var rexCharRef = /^(&[^;\s]+;)/;

  function Lexer(src){
    this.pos = 0;
    this.buff = src;
    // TODO:
    // each time lexer is called 'get', this.buff is reduced.
    // but if we implement searching issue in this system,
    // we will need the buffer copy.
    //this.src = src;
    this.bufferLength = this.buff.length;
    this.empty = (this.buff === "");
  }

  Lexer.prototype = {
    isEmpty : function(){
      return this.empty;
    },
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    getBufferLength : function(){
      return this.bufferLength;
    },
    getSeekPercent : function(seek_pos){
      return Math.floor(100 * seek_pos / this.bufferLength);
    },
    _stepBuff : function(count){
      this.pos += count;
      this.buff = this.buff.slice(count);
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      } else if(this.buff.match(rexTag)){
	return this._parseTag(RegExp.$1);
      } else if(this.buff.match(rexWord)){
	var str = RegExp.$1;
	if(str.length === 1){
	  return this._parseChar(str);
	} else if(str.length === 2 && str.match(rexTcy)){
	  return this._parseTcy(str);
	}
	return this._parseWord(str);
      } else if(this.buff.match(rexCharRef)){
	return this._parseCharRef(RegExp.$1);
      } else {
	return this._parseChar(this._getChar());
      }
    },
    _getRb : function(){
      var rb = this.buffRb.substring(0, 1);
      this.buffRb = this.buffRb.slice(1);
      return rb;
    },
    _getChar : function(){
      return this.buff.substring(0,1);
    },
    _getTagContentAux : function(tag_name){
      var start_tag = "<" + tag_name;
      var end_tag = "</" + tag_name;
      var get_end_pos = function(buff, offset){
	var callee = arguments.callee;
	var start_pos = buff.indexOf(start_tag, offset);
	var end_pos = buff.indexOf(end_tag, offset);
	if(start_pos < 0 || end_pos < start_pos){
	  return end_pos;
	}
	var end_pos2 = callee(buff, start_pos + tag_name.length + 2);
	return callee(buff, end_pos2 + tag_name.length + 3);
      };
      var end_pos = get_end_pos(this.buff, 0);
      if(end_pos < 0){
	return this.buff; // tag not closed, so return whole rest buff.
      }
      return this.buff.substring(0, end_pos);
    },
    _getTagContent : function(tag_name){
      try {
	return this._getTagContentAux(tag_name);
      } catch (e){
	return "";
      }
    },
    _parseTag : function(tagstr){
      var tag = new Tag(tagstr);
      this._stepBuff(tagstr.length);

      if(tag.isTcyTag()){
	return this._parseTcyTag(tag);
      }
      if(tag.isChildContentTag()){
	return this._parseChildContentTag(tag);
      }
      return tag;
    },
    _parseTcyTag : function(tag){
      var content = this._getTagContent(tag.name);
      this._stepBuff(content.length + tag.name.length + 3); // 3 = "</>".length
      return new Tcy(content);
    },
    _parseChildContentTag : function(tag){
      try {
	var content = this._getTagContent(tag.name);
      } catch(e){
	console.log("failed to get content of %s", tag.name);
	content = "";
      }
      tag.setContent(Utils.trimCRLF(content));
      this._stepBuff(content.length + tag.name.length + 3); // 3 = "</>".length
      return tag;
    },
    _parseWord : function(str){
      this._stepBuff(str.length);
      return new Word(str);
    },
    _parseTcy : function(str){
      this._stepBuff(str.length);
      return new Tcy(str);
    },
    _parseChar : function(str){
      this._stepBuff(str.length);
      return new Char(str, false);
    },
    _parseCharRef : function(str){
      this._stepBuff(str.length);
      return new Char(str, true);
    }
  };

  return Lexer;
})();

