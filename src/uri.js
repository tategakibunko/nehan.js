Nehan.Uri = (function(){
  /**
     @memberof Nehan
     @class Uri
     @classdesc abstraction of URI. 
     @constructor
     @param address {String}
  */
  function Uri(address){
    this.address = this._normalize(address || "");
  }

  Uri.prototype = {
    _normalize : function(address){
      return address.replace(/\s/g, "");
    },
    /**
       @memberof Nehan.Uri
       @return {String}
    */
    getAddress : function(){
      return this.address;
    },
    /**
       @memberof Nehan.Uri
       @return {String}
       @example
       * new Uri("http://example.com/top#foo").getAnchorName(); // "foo"
    */
    getAnchorName : function(){
      var sharp_pos = this.address.indexOf("#");
      if(sharp_pos < 0){
	return "";
      }
      var anchor_name = this.address.substring(sharp_pos + 1);
      return (anchor_name.length > 0)? anchor_name : "";
    }
  };

  return Uri;
})();

