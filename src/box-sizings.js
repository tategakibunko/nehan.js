var BoxSizings = {
  "content-box":(new BoxSizing("content-box")),
  "border-box":(new BoxSizing("border-box")),
  "margin-box":(new BoxSizing("margin-box")),
  getByName : function(name){
    return this[name] || this["margin-box"];
  }
};

