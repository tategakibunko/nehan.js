var TagAttrs = (function(){
  function TagAttrs(src){
    var attrs_raw = src? (new TagAttrParser(src)).parse() : {};
    this.classes = this._parseClasses(attrs_raw);
    this.attrs = this._parseAttrs(attrs_raw, this.classes);
    this.dataset = this._parseDataset(attrs_raw);
  }

  var __data_name_of = function(name){
    return Utils.camelize(name.slice(5));
  };

  TagAttrs.prototype = {
    hasAttr : function(name){
      return (typeof this.attrs.name !== "undefined");
    },
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    addClass : function(klass){
      klass = (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      if(!this.hasClass(klass)){
	this.classes.push(klass);
	this.setAttr("class", [this.getAttr("class"), klass].join(" "));
      }
      return this.classes;
    },
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
      this.setAttr("class", this.classes.join(" "));
      return this.classes;
    },
    getAttr : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
    },
    getData : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
    },
    getClassesRaw : function(){
      return List.map(this.classes, function(klass){
	return klass.replace("nehan-", "");
      });
    },
    setAttr : function(name, value){
      if(name.indexOf("data-") === 0){
	this.setData(__data_name_of(name), value);
      } else {
	this.attrs[name] = value;
      }
    },
    setData : function(name, value){
      this.dataset[name] = value;
    },
    // <p class='hi hey'>
    // => ["nehan-hi", "nehan-hey"]
    _parseClasses : function(attrs_raw){
      var class_name = attrs_raw["class"] || "";
      class_name = Utils.trim(class_name.replace(/\s+/g, " "));
      var classes = (class_name === "")? [] : class_name.split(/\s+/);
      return List.map(classes, function(klass){
	return (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      });
    },
    _parseAttrs : function(attrs_raw, classes){
      var attrs = {};
      Obj.iter(attrs_raw, function(name, value){
	if(name === "id"){ // force add prefix "nehan-".
	  attrs[name] = (value.indexOf("nehan-") === 0)? value : "nehan-" + value;
	} else if(name === "class"){
	  attrs[name] = classes.join(" ");
	} else if(name.indexOf("data-") < 0){
	  attrs[name] = value;
	}
      });
      return attrs;
    },
    _parseDataset : function(attrs_raw){
      var dataset = {};
      for(var name in attrs_raw){
	if(name.indexOf("data-") === 0){
	  dataset[__data_name_of(name)] = attrs_raw[name];
	}
      }
      return dataset;
    }
  };

  return TagAttrs;
})();

