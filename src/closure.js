var Closure = {
  id : function(){
    return function(x){
      return x;
    };
  },
  eq : function(x){
    return function(y){
      return x == y;
    };
  },
  neq : function(x){
    return function(y){
      return x != y;
    };
  }
};
