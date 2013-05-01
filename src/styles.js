var Styles = {
  addRule : function(key, prop, value){
    var entry = Style[key] || null;
    if(entry){
      entry[prop] = value;
    } else {
      var obj = {};
      obj[prop] = value;
      Style[key] = obj;
      Selectors.addSelector(key);
    }
  },
  addRules : function(key, obj){
    for(var prop in obj){
      this.addRule(key, prop, obj[prop]);
    }
  }
};
