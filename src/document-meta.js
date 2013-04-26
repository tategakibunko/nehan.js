var DocumentMeta = (function (){
  function DocumentMeta(){
    this.values = {};
  }

  DocumentMeta.prototype = {
    get : function(name){
      var entry = this.values[name] || null;
      if(entry){
	if(entry.length === 1){
	  return entry[0];
	}
	return entry;
      }
      return null;
    },
    add : function(name, value){
      var entry = this.values[name] || null;
      if(entry){
	entry.push(value);
      } else {
	this.values[name] = [value];
      }
    }
  };

  return DocumentMeta;
})();

