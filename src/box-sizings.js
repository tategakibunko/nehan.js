var BoxSizings = {
  "content-box":(new BoxSizing("content-box")),
  "padding-box":(new BoxSizing("padding-box")),
  "border-box":(new BoxSizing("border-box")),
  "margin-box":(new BoxSizing("margin-box")),
  getByName : function(name){
    if(typeof this[name] === "undefined"){
      throw "undefined box-sizing:" + name;
    }
    return this[name];
  }
};

