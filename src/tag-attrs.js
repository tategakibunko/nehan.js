Nehan.TagAttrs = (function(){
  /**
     @memberof Nehan
     @class TagAttrs
     @classdesc tag attribute set wrapper
     @constructor
     @param src {String}
  */
  function TagAttrs(src){
    var attrs_raw = src? Nehan.TagAttrParser.parse(src) : {};
    this.classes = this._parseClasses(attrs_raw);
    this.attrs = this._parseAttrs(attrs_raw);
    this.dataset = this._parseDataset(attrs_raw);
  }

  var __data_name_of = function(name){
    return Nehan.Utils.camelize(name.slice(5));
  };

  /**
   @memberof Nehan.TagAttrs
   @param name {String} - attribute name
   @return {boolean}
   */
  TagAttrs.prototype.hasAttr = function(name){
    if(name === "class"){
      return this.classes.length > 0;
    }
    return (typeof this.attrs[name] !== "undefined");
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name
   @return {boolean}
   */
  TagAttrs.prototype.hasClass = function(klass){
    return Nehan.List.exists(this.classes, Nehan.Closure.eq(klass));
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name
   @return {Array.<String>} current css classes
   */
  TagAttrs.prototype.addClass = function(klass){
    if(!this.hasClass(klass)){
      this.classes.push(klass);
      this.setAttr("class", [this.getAttr("class"), klass].join(" "));
    }
    return this.classes;
  };
  /**
   @memberof Nehan.TagAttrs
   @param klass {String} - css class name(prefiex by "nehan-")
   */
  TagAttrs.prototype.removeClass = function(klass){
    this.classes = this.classes.filter(function(cls){
      return cls != klass;
    });
    this.setAttr("class", this.classes.join(" "));
    return this.classes;
  };
  /**
   @memberof Nehan.TagAttrs
   @param name {String}
   @param def_value {default_value}
   @return {attribute_value}
   */
  TagAttrs.prototype.getAttr = function(name, def_value){
    def_value = (typeof def_value === "undefined")? null : def_value;
    return (typeof this.attrs[name] === "undefined")? def_value : this.attrs[name];
  };
  /**
   get dataset value

   @memberof Nehan.TagAttrs
   @param name {String}
   @param def_value {default_value}
   @return {dataset_value}
   */
  TagAttrs.prototype.getData = function(name, def_value){
    def_value = (typeof def_value === "undefined")? null : def_value;
    return (typeof this.dataset[name] === "undefined")? def_value : this.dataset[name];
  };
  /**
   get cache key

   @memberof Nehan.TagAttrs
   @param name {String}
   @return {string}
   */
  TagAttrs.prototype.getKey = function(){
    var props = Object.keys(this.attrs).sort();
    return props.map(function(prop){
      return prop + "=" + this.attrs[prop];
    }.bind(this)).join("&");
  };
  /**
   @memberof Nehan.TagAttrs
   @param name {String}
   @param value {attribute_value}
   */
  TagAttrs.prototype.setAttr = function(name, value){
    if(name.indexOf("data-") === 0){
      this.setData(__data_name_of(name), value);
    } else {
      this.attrs[name] = value;
    }
  };
  /**
   set dataset value

   @memberof Nehan.TagAttrs
   @param name {String}
   @param value {dataset_value}
   */
  TagAttrs.prototype.setData = function(name, value){
    this.dataset[name] = value;
  };

  // <p class='hi hey'>
  // => ["nehan-hi", "nehan-hey"]
  TagAttrs.prototype._parseClasses = function(attrs_raw){
    var class_name = attrs_raw["class"] || "";
    class_name = Nehan.Utils.trim(class_name.replace(/\s+/g, " "));
    var classes = (class_name === "")? [] : class_name.split(/\s+/);

    // replace 'nehan-' prefix for backword compatibility(version <= 5.1.0).
    return classes.map(function(klass){
      return (klass.indexOf("nehan-") === 0)? klass.replace("nehan-", "") : klass;
    }); 
  };

  TagAttrs.prototype._parseAttrs = function(attrs_raw){
    var attrs = {};
    Nehan.Obj.iter(attrs_raw, function(name, value){
      if(name.indexOf("data-") < 0){
	attrs[name] = value;
      }
    });
    return attrs;
  };

  TagAttrs.prototype._parseDatasetValue = function(value){
    switch(value){
    case "true": return true;
    case "false": return false;
    default: return isNaN(value)? value : Number(value);
    }
  };

  TagAttrs.prototype._parseDataset = function(attrs_raw){
    var dataset = {};
    for(var name in attrs_raw){
      if(name.indexOf("data-") === 0){
	dataset[__data_name_of(name)] = this._parseDatasetValue(attrs_raw[name]);
      }
    }
    return dataset;
  };

  return TagAttrs;
})();

