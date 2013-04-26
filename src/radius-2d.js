var Radius2d = (function(){
  function Radius2d(){
    this.hori = 0;
    this.vert = 0;
  }

  Radius2d.prototype = {
    setSize : function(){
      if(arguments.length == 1){
	var size = arguments[0];
	if(size instanceof Array){
	  this.setSizeByArray(size);
	} else if(typeof size == "object"){
	  this.setSizeByObj(size);
	} else {
	  this.hori = this.vert = size;
	}
      } else if(arguments.length === 2){
	this.hori = arguments[0];
	this.vert = arguments[1];
      } else {
	this.hori = this.vert = 0;
      }
    },
    setSizeByObj : function(size){
      if(typeof size.hori != "undefined"){
	this.hori = size.hori;
      }
      if(typeof size.vert != "undefined"){
	this.vert = size.vert;
      }
    },
    setSizeByArray : function(size){
      switch(size.length){
      case 1:
	this.hori = this.vert = size[0];
	break;
      case 2:
	this.hori = size[0];
	this.vert = size[1];
	break;
      }
    },
    getCssValue : function(){
      var ret = [];
      if(this.hori == this.vert){
	return this.hori + "px";
      }
      return [this.hori + "px", this.vert + "px"].join(" ");
    },
    isEnable : function(){
      return (this.hori > 0 || this.vert > 0);
    }
  };
  
  return Radius2d;
})();
