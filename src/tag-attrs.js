var TagAttrs = (function(){
  /**
     @memberof Nehan
     @class TagAttrs
     @classdesc tag attribute set wrapper
     @constructor
     @param src {String}
  */
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
    /**
       @memberof Nehan.TagAttrs
       @param name {String} - attribute name
       @return {boolean}
    */
    hasAttr : function(name){
      return (typeof this.attrs.name !== "undefined");
    },
    /**
       @memberof Nehan.TagAttrs
       @param klass {String} - css class name
       @return {boolean}
    */
    hasClass : function(klass){
      return List.exists(this.classes, Closure.eq(klass));
    },
    /**
     * add class name, but note that all css classes is force added prefix 'nehan-'.<br>
     * that is, if you add class "foo", it's registered as "nehan-foo"<br>
     * to avoid external css classes defined in client browser window.

       @memberof Nehan.TagAttrs
       @param klass {String} - css class name
       @return {Array.<String>} current css classes
    */
    addClass : function(klass){
      klass = (klass.indexOf("nehan-") < 0)? "nehan-" + klass : klass;
      if(!this.hasClass(klass)){
	this.classes.push(klass);
	this.setAttr("class", [this.getAttr("class"), klass].join(" "));
      }
      return this.classes;
    },
    /**
       @memberof Nehan.TagAttrs
       @param klass {String} - css class name(prefiex by "nehan-")
    */
    removeClass : function(klass){
      this.classes = List.filter(this.classes, function(cls){
	return cls != klass;
      });
      this.setAttr("class", this.classes.join(" "));
      return this.classes;
    },
    /**
       @memberof Nehan.TagAttrs
       @param name {String}
       @param def_value {default_value}
       @return {attribute_value}
    */
    getAttr : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
    },
    /**
       get dataset value

       @memberof Nehan.TagAttrs
       @param name {String}
       @param def_value {default_value}
       @return {dataset_value}
    */
    getData : function(name, def_value){
      def_value = (typeof def_value === "undefined")? null : def_value;
      return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
    },
    /**
       get classes NOT prefixed by "nehan-".

       @memberof Nehan.TagAttrs
       @return {Array.<String>}
    */
    getClassesRaw : function(){
      return List.map(this.classes, function(klass){
	return klass.replace("nehan-", "");
      });
    },
    /**
       @memberof Nehan.TagAttrs
       @param name {String}
       @param value {attribute_value}
    */
    setAttr : function(name, value){
      if(name.indexOf("data-") === 0){
	this.setData(__data_name_of(name), value);
      } else {
	this.attrs[name] = value;
      }
    },
    /**
       set dataset value

       @memberof Nehan.TagAttrs
       @param name {String}
       @param value {dataset_value}
    */
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
    _parseDatasetValue : function(value){
      switch(value){
      case "true": return true;
      case "false": return false;
      default: return value;
      }
    },
    _parseDataset : function(attrs_raw){
      var dataset = {};
      for(var name in attrs_raw){
	if(name.indexOf("data-") === 0){
	  dataset[__data_name_of(name)] = this._parseDatasetValue(attrs_raw[name]);
	}
      }
      return dataset;
    }
  };

  return TagAttrs;
})();

