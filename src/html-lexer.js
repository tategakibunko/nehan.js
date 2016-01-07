Nehan.HtmlLexer = (function (){
  var __rex_tag = /<:{0,2}[a-zA-Z][^>]*>/;

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
    var restart_buff = buff.substring(restart_pos2);
    if(restart_buff.length < close_tag.length){
      return -1;
    }
    var final_pos = __find_close_pos(restart_buff, tag_name, open_tag_rex, close_tag);
    if(final_pos < 0){
      return -1;
    }
    return restart_pos2 + final_pos;
  };

  // discard close tags defined as single tag in LexingRule.
  var __replace_single_close_tags = function(str, single_tag_names){
    return single_tag_names.reduce(function(ret, name){
      return ret.replace(new RegExp("</" + name + ">", "g"), "");
    }, str);
  };

  /**
   @memberof Nehan
   @class HtmlLexer
   @classdesc lexer of html tag elements.
   @constructor
   @param src {String}
   @param opt {Object}
   @param opt.flow {Nehan.BoxFlow} - document flow(optional)
   */
  function HtmlLexer(src, opt){
    opt = opt || {};
    this.pos = 0;
    this.buff = this._normalize(src);
    this.src = this.buff;
    this.singleTagNames = opt.singleTagNames || [];
  }

  HtmlLexer.prototype._normalize = function(src){
    src = src.replace(/(<\/[^>]+>)/gm, function(str, p1){
      return p1.toLowerCase();
    }); // convert close tag to lower case(for innerHTML of IE)
    if(this.singleTagNames){
      src = __replace_single_close_tags(src, this.singleTagNames);
    }
    return src;
  };
  /**
   @memberof Nehan.HtmlLexer
   @return {boolean}
   */
  HtmlLexer.prototype.isEmpty = function(){
    return this.src === "";
  };
  /**
   get token and step cusor to next position.

   @memberof Nehan.HtmlLexer
   @return {Nehan.Token}
   */
  HtmlLexer.prototype.get = function(){
    var token = this._getToken();
    if(token){
      token.spos = this.pos;
    }
    return token;
  };
  /**
   get lexer source text

   @memberof Nehan.HtmlLexer
   @return {String}
   */
  HtmlLexer.prototype.getSrc = function(){
    return this.src;
  };
  /**
   get current pos in percentage format.

   @memberof Nehan.HtmlLexer
   @return {int}
   */
  HtmlLexer.prototype.getSeekPercent = function(seek_pos){
    return Math.round(100 * seek_pos / this.src.length);
  };

  HtmlLexer.prototype._stepBuff = function(count){
    var part = this.buff.substring(0, count);
    this.pos += count;
    this.buff = this.buff.slice(count);
    return part;
  };

  HtmlLexer.prototype._getToken = function(){
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
    content = Nehan.Utils.trimHeadCRLF(content);
    return new Nehan.Text(content);
  };

  HtmlLexer.prototype._getTagContent = function(tag){
    // why we added [\\s|>] for open_tag_rex?
    // if tag_name is "p", 
    // both "<p>" and "<p class='foo'" also must be matched,
    // or if tag_name is "a"
    // "<a>" must be matched but "<address" is not.
    var tag_name = tag.name;
    var open_tag_rex = new RegExp("<" + tag_name + "[\\s|>]");
    var close_tag = "</" + tag_name + ">"; // tag name is already lower-cased by preprocessor.
    var close_pos = __find_close_pos(this.buff, tag_name, open_tag_rex, close_tag);

    if(close_pos >= 0){
      return {closed:true, content:this.buff.substring(0, close_pos)};
    }

    // try to ommit tag close if
    // 1. close pos not found
    // 2. Nehan.Config.enableAutoClose is true
    // 3. tag has no attributes
    // reference: http://www.w3.org/TR/html5/syntax.html#optional-tags
    if(!tag.hasAttr() && Nehan.Config.enableAutoCloseTag){
      var auto_close_pos = this._findAutoClosePos(tag_name);
      if(auto_close_pos > 0){
	return {closed:false, content:this.buff.substring(0, auto_close_pos)};
      }
    }

    console.warn("invalid syntax:%s is not closed properly, use rest content", tag_name);

    // all other case, return whole rest buffer.
    return {closed:false, content:this.buff};
  };

  HtmlLexer.prototype._findAutoClosePos = function(tag_name){
    switch(tag_name){
    case "p": return this._selectClosePos([
      "address", "article", "aside", "blockquote", "div", "dl", "fieldset", "footer", "form",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "header", "hgroup", "hr", "main", "nav", "ol", "p", "pre", "section", "table", "ul"
    ]);
    case "dt":
    case "dd":
      return this._selectClosePos(["dd", "dt"]);
    case "li":
      return this._selectClosePos(["li"]);
    case "thead":
    case "tbody":
    case "tfoot":
      return this._selectClosePos(["thead", "tbody", "tfoo"]);
    case "tr":
      return this._selectClosePos(["tr"]);
    case "td":
    case "th":
      return this._selectClosePos(["td", "th"]);
    default:
      return -1;
    }
  };

  HtmlLexer.prototype._selectClosePos = function(close_names){
    var matches = close_names.map(function(name){
      return this.buff.indexOf("<" + name);
    }.bind(this)).filter(function(pos){
      return pos > 0;
    }).sort(function(p1, p2){
      return p1 - p2;
    });
    return (matches.length === 0)? -1 : matches[0];
  };

  HtmlLexer.prototype._parseTag = function(tagstr){
    var tag = new Nehan.Tag(tagstr);
    this._stepBuff(tagstr.length);
    var tag_name = tag.getName();
    if(Nehan.List.exists(this.singleTagNames, Nehan.Closure.eq(tag_name))){
      tag._single = true;
      return tag;
    }
    return this._parseChildContentTag(tag);
  };

  HtmlLexer.prototype._parseChildContentTag = function(tag){
    var result = this._getTagContent(tag);
    tag.setContent(result.content);
    if(result.closed){
      this._stepBuff(result.content.length + tag.name.length + 3); // 3 = "</>".length
    } else {
      this._stepBuff(result.content.length);
    }
    return tag;
  };

  return HtmlLexer;
})();
