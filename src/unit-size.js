var UnitSize = {
  mapFontSize : function(val, font_size){
    var str = (typeof val == "string")? val : String(val);
    if(str.indexOf("rem") > 0){
      var rem_scale = parseFloat(str.replace("rem",""));
      return Math.floor(Layout.fontSize * rem_scale); // use root font-size
    }
    if(str.indexOf("em") > 0){
      var em_scale = parseFloat(str.replace("em",""));
      return Math.floor(font_size * em_scale);
    }
    if(str.indexOf("pt") > 0){
      return Math.floor(parseInt(str, 10) * 4 / 3);
    }
    if(str.indexOf("%") > 0){
      return Math.floor(font_size * parseInt(str, 10) / 100);
    }
    var px = parseInt(str, 10);
    return isNaN(px)? 0 : px;
  },
  mapBoxSize : function(val, font_size, max_size){
    var str = (typeof val == "string")? val : String(val);
    if(str.indexOf("%") > 0){
      var scaled_size = Math.floor(max_size * parseInt(str, 10) / 100);
      return Math.min(max_size, scaled_size); // restrict less than maxMeasure
    }
    return this.mapFontSize(val, font_size);
  },
  parseEdgeSize : function(obj, font_size, max_size){
    if(obj instanceof Array){
      return List.map(obj, function(val){
	return UnitSize.mapBoxSize(val, font_size, max_size);
      });
    }
    if(typeof obj == "object"){
      var ret = {};
      var callee = arguments.callee;
      for(var prop in obj){
	ret[prop] = callee(obj[prop], font_size, max_size);
      }
      return ret;
    }
    return UnitSize.mapBoxSize(obj, font_size, max_size);
  }
};
