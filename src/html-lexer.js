var HtmlLexer = (function (){
  var rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var rex_word = /^([\w!\.\?\/\_:#;"',]+)/;
  var rex_tag = /^(<[^>]+>)/;
  var rex_char_ref = /^(&[^;\s]+;)/;

  function HtmlLexer(src){
    this.pos = 0;
    this.buff = this._normalize(src);
    this.length = this.buff.length; // original length
  }
  HtmlLexer.prototype = {
    _normalize : function(src){
      return src
	.replace(/^[ \n]+/, "") // shorten head space
	.replace(/\s+$/, "") // discard tail space
	.replace(/\r/g, ""); // discard CR
    },
    isEmpty : function(){
      return this.length === 0;
    },
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    getBufferLength : function(){
      return this.length;
    },
    getSeekPercent : function(seek_pos){
      return Math.floor(100 * seek_pos / this.length);
    },
    _stepBuff : function(count){
      this.pos += count;
      this.buff = this.buff.slice(count);
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      }
      if(this.buff.match(rex_tag)){
	return this._parseTag(RegExp.$1);
      }
      if(this.buff.match(rex_word)){
	var str = RegExp.$1;
	if(str.length === 1){
	  return this._parseChar(str);
	} else if(str.length === 2 && str.match(rex_tcy)){
	  return this._parseTcy(str);
	}
	return this._parseWord(str);
      }
      if(this.buff.match(rex_char_ref)){
	return this._parseCharRef(RegExp.$1);
      }
      return this._parseChar(this._getChar());
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
      if(!tag.isSingleTag()){
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
      var content = this._getTagContent(tag.name);
      tag.setContentRaw(Utils.trimCRLF(content));
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
  return HtmlLexer;
})();

