var Html = {
  escape : function(str){
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#039;")
      .replace(/"/g, "&quot;");
  },
  attr : function(args){
    var tmp = [];
    for(var prop in args){
      if(typeof args[prop] !== "undefined" && args[prop] !== ""){
	tmp.push(prop + "='" + this.escape(args[prop] + "") + "'");
      }
    }
    return (tmp == [])? "" : tmp.join(" ");
  },
  tagWrap : function(name, content, args){
    return [this.tagStart(name, args || {}), content, this.tagEnd(name)].join("");
  },
  tagSingle : function(name, args){
    return "<" + name + " " + this.attr(args) + "/>";
  },
  tagStart : function(name, args){
    return "<" + name + " " + this.attr(args) + ">";
  },
  tagEnd : function(name){
    return "</" + name + ">";
  }
};
