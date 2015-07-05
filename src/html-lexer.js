Nehan.HtmlLexer = (function (){
  var __rex_tag = /<[a-zA-Z][^>]*>/;

  /*
  var __close_abbr_tags = [
    "li",
    "dt",
    "dd",
    "p",
    "tr",
    "td",
    "th",
    "rt",
    "rp",
    "optgroup",
    "option",
    "thread",
    "tfoot"
  ];*/

  var __find_close_pos = function(buff, tag_name, open_tag_rex, close_tag){
    var close_pos = buff.indexOf(close_tag);
    if(close_pos < 0){
      return -1;
    }
    var recur_match = buff.match(open_tag_rex);
    var recur_pos = recur_match? recur_match.index : -1;
    if(recur_pos < 0 || close_pos < recur_pos){
      return close_pos;
    }
    var restart_pos = recur_pos + tag_name.length + 2; // 2 = "<>".length
    var close_pos2 = __find_close_pos(buff.substring(restart_pos), tag_name, open_tag_rex, close_tag);
    if(close_pos2 < 0){
      return -1;
    }
    var restart_pos2 = restart_pos + close_pos2 + tag_name.length + 3; // 3 = "</>".length
    return restart_pos2 + __find_close_pos(buff.substring(restart_pos2), tag_name, open_tag_rex, close_tag);
  };

  /**
     @memberof Nehan
     @class HtmlLexer
     @classdesc lexer of html tag elements.
     @constructor
     @param src {String}
  */
  function HtmlLexer(src){
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
  }

  // discard close tags defined as single tag in LexingRule.
  var __replace_single_close_tags = function(str){
    return Nehan.List.fold(Nehan.LexingRule.getSingleTagNames(), str, function(ret, name){
      return ret.replace(new RegExp("</" + name + ">", "g"), "");
    });
  };

  HtmlLexer.prototype = {
    _normalize : function(src){
      var src = src.replace(/(<\/[^>]+>)/gm, function(str, p1){
	  return p1.toLowerCase();
      }); // convert close tag to lower case(for innerHTML of IE)
      src = __replace_single_close_tags(src);
      //src = src.replace(/“([^”]+)”/g, "〝$1〟") // convert double quote to double quotation mark
      src = src
	.replace(/“([^”]+)”/g, "”$1”")
	.replace(/｢/g, "「") // half size left corner bracket -> full size left corner bracket
	.replace(/｣/g, "」") // half size right corner bracket -> full size right corner bracket
	.replace(/､/g, "、") // half size ideographic comma -> full size ideographic comma
	.replace(/｡/g, "。") // half size ideographic full stop -> full size
	//.replace(/^[\s]+/, "") // shorten head space
	//.replace(/[\s]+$/, "") // discard tail space
	.replace(/\r/g, ""); // discard CR
      //console.log("HtmlLexer::normalized to:", src);
      return src;
    },
    /**
       @memberof Nehan.HtmlLexer
       @return {boolean}
    */
    isEmpty : function(){
      return this.src === "";
    },
    /**
       get token and step cusor to next position.

       @memberof Nehan.HtmlLexer
       @return {Nehan.Token}
    */
    get : function(){
      var token = this._getToken();
      if(token){
	token.spos = this.pos;
      }
      return token;
    },
    /**
       get lexer source text

       @memberof Nehan.HtmlLexer
       @return {String}
    */
    getSrc : function(){
      return this.src;
    },
    /**
       get current pos in percentage format.

       @memberof Nehan.HtmlLexer
       @return {int}
    */
    getSeekPercent : function(seek_pos){
      return Math.round(100 * seek_pos / this.src.length);
    },
    /**
       @memberof Nehan.HtmlLexer
       @param text {String}
     */
    addText : function(text){
      this.buff = this.buff + this._normalize(text);
    },
    _stepBuff : function(count){
      var part = this.buff.substring(0, count);
      this.pos += count;
      this.buff = this.buff.slice(count);
      return part;
    },
    _getToken : function(){
      if(this.buff === ""){
	return null;
      }
      var match, content;
      match = this.buff.match(__rex_tag);
      if(match === null){
	content = this._stepBuff(this.buff.length);
	return new Nehan.Text(content);
      }
      if(match.index === 0){
	return this._parseTag(match[0]);
      }
      content = this._stepBuff(match.index);
      return new Nehan.Text(content);
    },
    _getTagContent : function(tag_name){
      // why we added [\\s|>] for open_tag_rex?
      // if tag_name is "p", 
      // both "<p>" and "<p class='foo'" also must be matched.
      var open_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
      var close_tag = "</" + tag_name + ">"; // tag name is already lower-cased by preprocessor.
      var close_pos = __find_close_pos(this.buff, tag_name, open_tag_rex, close_tag);

      if(close_pos >= 0){
	return {closed:true, content:this.buff.substring(0, close_pos)};
      }

      // if close pos not found and Nehan.Config.enableAutoClose is true,
      // 1. return the text until next same start tag.
      // 2. or else, return whole rest buff.
      // (TODO): this is not strict lexing, especially when dt, dd, td, etc.
      if(Nehan.Config.enableAutoCloseTag){
	var next_open_match = this.buff.match(open_tag_rex);
	if(next_open_match){
	  return {closed:false, content:this.buff.substring(0, nexd_open_match.index)};
	}
      }

      // all other case, return whole rest buffer.
      return {closed:false, content:this.buff};
    },
    _parseTag : function(tagstr){
      var tag = new Nehan.Tag(tagstr);
      this._stepBuff(tagstr.length);
      var tag_name = tag.getName();
      if(Nehan.LexingRule.isSingleTag(tag_name)){
	tag._single = true;
	return tag;
      }
      return this._parseChildContentTag(tag);
    },
    _parseChildContentTag : function(tag){
      var result = this._getTagContent(tag.name);
      tag.setContent(result.content);
      if(result.closed){
	this._stepBuff(result.content.length + tag.name.length + 3); // 3 = "</>".length
      } else {
	this._stepBuff(result.content.length);
      }
      return tag;
    }
  };
  return HtmlLexer;
})();


