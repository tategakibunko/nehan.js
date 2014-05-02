var Uri = (function(){
  function Uri(address){
    this.address = this._normalize(address || "");
  }

  Uri.prototype = {
    _normalize : function(address){
      return address.replace(/\s/g, "");
    },
    hasAnchorName : function(){
      return this.address.indexOf("#") >= 0;
    },
    getAddress : function(){
      return this.address;
    },
    getAnchorName : function(){
      var sharp_pos = this.address.indexOf("#");
      return (sharp_pos < 0)? "" : this.address.substring(sharp_pos + 1);
    }
  };

  return Uri;
})();

