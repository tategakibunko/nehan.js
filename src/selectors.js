var Selectors = (function(){
  var selectors = {};
  for(var key in Style){
    selectors[key] = new Selector(key, Style[key]);
  }
  return {
    addSelector : function(key){
      var selector = selectors[key] || null;
      if(selector === null){
	selectors[key] = new Selector(key, Style[key]);
      }
    },
    getSelectors : function(key){
      var ret = [];
      Obj.iter(selectors, function(obj, prop, selector){
	if(selector.match(key)){
	  ret.push(selector);
	}
      });
      return ret;
    },
    getValue : function(key){
      var ret = {};
      Obj.iter(selectors, function(obj, prop, selector){
	if(selector.match(key)){
	  Args.copy(ret, selector.getValue());
	}
      });
      return ret;
    }
  };
})();

