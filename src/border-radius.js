var BorderRadius = (function(){
  function BorderRadius(){
    this.borderTopLeftRadius = new Radius2d();
    this.borderTopRightRadius = new Radius2d();
    this.borderBottomLeftRadius = new Radius2d();
    this.borderBottomRightRadius = new Radius2d();
  }

  BorderRadius.prototype = {
    getCss : function(){
      var self = this;
      var css = {};
      List.iter(Const.cssBorderRadius, function(css_radius_prop){
	var radius = self[Css.toClassProp(css_radius_prop)];
	if(radius.isEnable()){
	  var radius_css_value = radius.getCssValue();
	  List.iter(Css.toVenderizedList(css_radius_prop), function(css_vender_radius_prop){
	    css[css_vender_radius_prop] = radius_css_value;
	  });
	}
      });
      return css;
    },
    getRadius : function(dir1, dir2){
      var corner = Css.sortCorner(dir1, dir2).join("-");
      var prop = ["border", corner, "radius"].join("-");
      var class_prop = Css.toClassProp(prop);
      return this[class_prop];
    },
    setAll : function(value){
      this.borderTopLeftRadius.setSize(value);
      this.borderTopRightRadius.setSize(value);
      this.borderBottomLeftRadius.setSize(value);
      this.borderBottomRightRadius.setSize(value);
    },
    setSize : function(flow, size){
      if(size instanceof Array){
	this.setSizeByArray(flow, size);
      } else if(typeof size == "object"){
	this.setSizeByObj(flow, size);
      } else {
	this.setAll(size);
      }
    },
    setSizeByObj : function(flow, size){
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
    setSizeByArray : function(flow, size){
      switch(size.length){
      case 1:
	this.setAll(size[0]);
	break;
      case 2:
	this.setStartBefore(flow, size[0]);
	this.setEndAfter(flow, size[0]);
	this.setStartAfter(flow, size[1]);
	this.setEndBefore(flow, size[1]);
	break;
      case 3:
	// 0, 2 is discarded.
	this.setStartAfter(flow, size[1]);
	this.setEndBefore(flow, size[1]);
	break;
      case 4:
	this.setStartBefore(flow, size[0]);
	this.setEndBefore(flow, size[1]);
	this.setEndAfter(flow, size[2]);
	this.setStartAfter(flow, size[3]);
	break;
      }
    },
    setStartBefore : function(flow, value){
      var radius = this.getRadius(flow.getPropStart(), flow.getPropBefore());
      radius.setSize(value);
    },
    setStartAfter : function(flow, value){
      var radius = this.getRadius(flow.getPropStart(), flow.getPropAfter());
      radius.setSize(value);
    },
    setEndBefore : function(flow, value){
      var radius = this.getRadius(flow.getPropEnd(), flow.getPropBefore());
      radius.setSize(value);
    },
    setEndAfter :  function(flow, value){
      var radius = this.getRadius(flow.getPropEnd(), flow.getPropAfter());
      radius.setSize(value);
    },
    clearBefore : function(flow){
      this.setStartBefore(flow, 0);
      this.setEndBefore(flow, 0);
    },
    clearAfter : function(flow){
      this.setStartAfter(flow, 0);
      this.setEndAfter(flow, 0);
    }
  };

  return BorderRadius;
})();
