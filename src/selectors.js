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
    getValue : function(key){
      var ret = {};
      Obj.iter(selectors, function(obj, prop, selector){
	if(selector.test(key)){
	  Args.copy(ret, selector.getValue());
	}
      });
      return ret;
    }
  };
})();

