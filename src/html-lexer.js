var HtmlLexer = (function (){
  var rex_tcy = /\d\d|!\?|!!|\?!|\?\?/;
  var rex_word = /^([\w!\.\?\/\_:#;"',]+)/;
  var rex_tag = /^(<[^>]+>)/;
  var rex_char_ref = /^(&[^;\s]+;)/;
  var single_tags = [
    "?xml",
    "!doctype",
    "br",
    "end-page",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "pbr",
    "page-break",
    "wbr"
  ];

  function HtmlLexer(src){
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
  }
  HtmlLexer.prototype = {
    _normalize : function(src){
      return src
	.replace(/(<\/[^>]+>)/g, function(p1){
	  return p1.toLowerCase();
	}) // convert close tag to lower case(for innerHTML of IE)
	.replace(/^[ \n]+/, "") // shorten head space
	.replace(/\s+$/, "") // discard tail space
	.replace(/\r/g, ""); // discard CR
    },
    isEmpty : function(){
      return this.src === "";
    },
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    getSrc : function(){
      return this.src;
    },
    getSeekPercent : function(seek_pos){
      return Math.round(100 * seek_pos / this.src.length);
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
      var recur_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
      var end_tag = "</" + tag_name + ">";
      var get_end_pos = function(buff){
	var end_pos = buff.indexOf(end_tag);
	if(end_pos < 0){
	  return -1;
	}
	var recur_match = buff.match(recur_tag_rex);
	var recur_pos = recur_match? recur_match.index : -1;
	if(recur_pos < 0 || end_pos < recur_pos){
	  return end_pos;
	}
	var restart_pos = recur_pos + tag_name.length + 2;
	var end_pos2 = arguments.callee(buff.substring(restart_pos));
	if(end_pos2 < 0){
	  return -1;
	}
	var restart_pos2 = restart_pos + end_pos2 + tag_name.length + 3;
	return restart_pos2 + arguments.callee(buff.substring(restart_pos2));
      };

      var end_pos = get_end_pos(this.buff);
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
      if(List.exists(single_tags, Closure.eq(tag.getName()))){
	return tag;
      }
      return this._parseChildContentTag(tag);
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

