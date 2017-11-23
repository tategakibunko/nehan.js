/**
 html utility module

 @namespace Nehan.Html
 */
Nehan.Html = {
  /**
   escape special text like &lt;, &gt;, etc.

   @memberof Nehan.Html
   @method escape
   @param str {String}
   @return {String}
   */
  escape : function(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
  },
  /**
   unescape special text.

   @memberof Nehan.Html
   @method unescape
   @param str {String}
   @return {String}
   */
  unescape : function(str) {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/ /g, "&nbsp;")
      .replace(/\r/g, "&#13;")
      .replace(/\n/g, "&#10;");
    return div.textContent || div.innerText;
  },
  /*
   generate html attribute string

   @memberof Nehan.Html
   @method attr
   @param args {Object}
   @return {String}
   @example
   * Nehan.Html.attr({width:"100", height:"200"}); // width='100' height = '200'
   */
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      if(typeof args[prop] !== "undefined" && args[prop] !== ""){
	tmp.push(prop + "='" + this.escape(args[prop] + "") + "'");
      }
    }
    return (tmp == [])? "" : tmp.join(" ");
  },
  /**
   generate html tag string

   @memberof Nehan.Html
   @method tagWrap
   @param name {String} - tag name
   @param content {String} - tag content text
   @param args {Object} - tag attributes
   @return {String}
   @example
   * Nehan.Html.tagWrap("a", "homepage", {href:"#"}); // "<a href='#'>homepage</a>"
   */
  tagWrap : function(name, content, args){
    return [this.tagStart(name, args || {}), content, this.tagEnd(name)].join("");
  },
  /**
   generate unwrapped single html tag string

   @memberof Nehan.Html
   @method tagSingle
   @param name {String} - tag name
   @param args {Object} - tag attributes
   @return {String}
   @example
   * Nehan.Html.tagSingle("img", {src:"/path/to/img"}); // "<img src='/path/to/img' />"
   */
  tagSingle : function(name, args){
    return "<" + name + " " + this.attr(args) + "/>";
  },
  /**
   generate open tag string

   @memberof Nehan.Html
   @method tagStart
   @return {String}
   @param name {String} - tag name
   @param args {Object} - tag attributes
   @example
   * Nehan.Html.tagStart("div"); // "<div>"
   */
  tagStart : function(name, args){
    return "<" + name + " " + this.attr(args) + ">";
  },
  /**
   generate enclose tag string

   @memberof Nehan.Html
   @method tagEnd
   @return {String}
   @param name {String} - tag name
   @example
   * Nehan.Html.tagEnd("div"); // "</div>"
   */
  tagEnd : function(name){
    return "</" + name + ">";
  },
  /**
   normalize html text
   @memberof Nehan.Html
   @method normalize
   @return {String}
   @param name {String} - html text
   */
  normalize : function(text){
    return text
      .replace(/\u0008/g, "") // discard BackSpace
      .replace(/\u000B/g, "") // vertical tab
      .replace(/\u000C/g, "") // form feed
      .replace(/\u200B/g, "") // zero width space
      .replace(/\u2028/g, "") // line separator
      .replace(/\u2029/g, "") // paragraph separator
      .replace(/\r/g, "") // discard CR
      .replace(/<!--[\s\S]*?-->/g, "") // discard comment
      .replace(/<rp>[^<]*<\/rp>/gi, "") // discard rp
      .replace(/<rb>/gi, "") // discard rb
      .replace(/<\/rb>/gi, "") // discard /rb
      .replace(/<rt><\/rt>/gi, ""); // discard empty rt
  }
};
