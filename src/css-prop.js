Nehan.CssProp = (function(){

  var __attr_props = {
    // margin
    "margin-before":{name:"margin", attr:"before"},
    "margin-end":{name:"margin", attr:"end"},
    "margin-after":{name:"margin", attr:"after"},
    "margin-start":{name:"margin", attr:"start"},

    // padding
    "padding-before":{name:"padding", attr:"before"},
    "padding-end":{name:"padding", attr:"end"},
    "padding-after":{name:"padding", attr:"after"},
    "padding-start":{name:"padding", attr:"start"},

    // border-width
    "border-width-before":{name:"border-width", attr:"before"},
    "border-width-end":{name:"border-width", attr:"end"},
    "border-width-after":{name:"border-width", attr:"after"},
    "border-width-start":{name:"border-width", attr:"start"},

    // border-style
    "border-style-before":{name:"border-style", attr:"before"},
    "border-style-end":{name:"border-style", attr:"end"},
    "border-style-after":{name:"border-style", attr:"after"},
    "border-style-start":{name:"border-style", attr:"start"},

    // border-color
    "border-color-before":{name:"border-color", attr:"before"},
    "border-color-end":{name:"border-color", attr:"end"},
    "border-color-after":{name:"border-color", attr:"after"},
    "border-color-start":{name:"border-color", attr:"start"}
  };

  /**
   @memberof Nehan
   @class CssProp
   @constructor
   @param raw_name {string} - unformatted raw property name
   @example
   * var prop = new Nehan.CssProp("margin-start");
   * prop.getName(); // => "margin"
   * prop.getAttr(); // => "start"
   */
  function CssProp(raw_name){
    var chain_name = Nehan.Utils.camelToChain(raw_name);
    var attr_prop = __attr_props[chain_name];
    this.name = attr_prop? attr_prop.name : chain_name;
    this.attr = attr_prop? attr_prop.attr : null;
  }

  CssProp.prototype.getName = function(){
    return this.name;
  };

  CssProp.prototype.getAttr = function(){
    return this.attr;
  };

  return CssProp;
})();

