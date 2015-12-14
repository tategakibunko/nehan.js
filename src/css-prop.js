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
    "border-color-start":{name:"border-color", attr:"start"},

    // border-radius
    "border-before-start-radius":{name:"border-radius", attr:"before-start"},
    "border-before-end-radius":{name:"border-radius", attr:"before-end"},
    "border-after-end-radius":{name:"border-radius", attr:"after-end"},
    "border-after-start-radius":{name:"border-radius", attr:"after-start"},

    // list-style
    "list-style-position":{name:"list-style", attr:"position"},
    "list-style-type":{name:"list-style", attr:"type"},
    "list-style-image":{name:"list-style", attr:"image"},

    // text-emphasis
    "text-emphasis-position":{name:"text-emphasis", attr:"position"},
    "text-emphasis-style":{name:"text-emphasis", attr:"style"},
    "text-emphasis-color":{name:"text-emphasis", attr:"color"},

    // font
    "font-size":{name:"font", attr:"size"},
    "font-family":{name:"font", attr:"family"},
    "font-style":{name:"font", attr:"style"},
    "font-weight":{name:"font", attr:"weight"},
    "font-variant":{name:"font", attr:"variant"}
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

  /**
   @memberof Nehan.CssProp
   @return {String}
   */
  CssProp.prototype.getName = function(){
    return this.name;
  };

  /**
   @memberof Nehan.CssProp
   @return {String}
   */
  CssProp.prototype.getAttr = function(){
    return this.attr;
  };

  /**
   @memberof Nehan.CssProp
   @return {bool}
   */
  CssProp.prototype.hasAttr = function(){
    return this.attr !== null;
  };

  return CssProp;
})();

