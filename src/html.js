/**
   html utility module

   @namespace Nehan.Html
*/
var Html = {
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
      .replace(/'/g, "&#039;")
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
    * Html.attr({width:"100", height:"200"}); // width='100' height = '200'
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
     * Html.tagWrap("a", "homepage", {href:"#"}); // "<a href='#'>homepage</a>"
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
     * Html.tagSingle("img", {src:"/path/to/img"}); // "<img src='/path/to/img' />"
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
     * Html.tagStart("div"); // "<div>"
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
     * Html.tagEnd("div"); // "</div>"
  */
  tagEnd : function(name){
    return "</" + name + ">";
  }
};
