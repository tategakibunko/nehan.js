var BorderRadius = (function(){
  function BorderRadius(){
    this.topLeft = new Radius2d();
    this.topRight = new Radius2d();
    this.bottomRight = new Radius2d();
    this.bottomLeft = new Radius2d();
  }

  BorderRadius.prototype = {
    getArray : function(){
      return [
	this.topLeft,
	this.topRight,
	this.bottomRight,
	this.bottomLeft
      ];
    },
    getCssValueHori : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueHori();
      }).join(" ");
    },
    getCssValueVert : function(){
      return List.map(this.getArray(), function(radius){
	return radius.getCssValueVert();
      }).join(" ");
    },
    getCssValue : function(){
      return [this.getCssValueHori(), this.getCssValueVert()].join("/");
    },
    getCss : function(){
      var css = {};
      var css_value = this.getCssValue();
      List.iter(Const.cssVenderPrefixes, function(prefix){
	var prop = [prefix, "border-radius"].join("-");
	css[prop] = css_value;
      });
      return css;
    },
    getCorner : function(dir1, dir2){
      var name = BoxCorner.getCornerName(dir1, dir2);
      return this[name];
    },
    setSize : function(flow, size){
      if(typeof size["start-before"] != "undefined"){
	this.setStartBefore(flow, size["start-before"]);
      }
      if(typeof size["start-after"] != "undefined"){
	this.setStartAfter(flow, size["start-after"]);
      }
      if(typeof size["end-before"] != "undefined"){
	this.setEndBefore(flow, size["end-before"]);
      }
      if(typeof size["end-after"] != "undefined"){
	this.setEndAfter(flow, size["end-after"]);
      }
    },
    setStartBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropBefore());
      radius.setSize(value);
    },
    setStartAfter : function(flow, value){
      var radius = this.getCorner(flow.getPropStart(), flow.getPropAfter());
      radius.setSize(value);
    },
    setEndBefore : function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropBefore());
      radius.setSize(value);
    },
    setEndAfter :  function(flow, value){
      var radius = this.getCorner(flow.getPropEnd(), flow.getPropAfter());
      radius.setSize(value);
    },
    clearBefore : function(flow){
      this.setStartBefore(flow, [0, 0]);
      this.setEndBefore(flow, [0, 0]);
    },
    clearAfter : function(flow){
      this.setStartAfter(flow, [0, 0]);
      this.setEndAfter(flow, [0, 0]);
    }
  };

  return BorderRadius;
})();
