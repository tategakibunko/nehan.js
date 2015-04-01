/**
   closure factory
   @namespace Nehan.Closure
*/
var Closure = {
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var echo = Closure.id();
     * echo(1); // 1
     * echo("yo"); // "yo"
  */
  id : function(){
    return function(x){
      return x;
    };
  },
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var is_one = Closure.eq(1);
     * is_one(1); // true
     * is_one(2); // false
  */
  eq : function(x){
    return function(y){
      return x == y;
    };
  },
  /**
     @memberof Nehan.Closure
     @return {Function}
     @example
     * var is_not_one = Closure.neq(1);
     * is_not_one(1); // false
     * is_not_one(2); // true
  */
  neq : function(x){
    return function(y){
      return x != y;
    };
  },
  isTagName : function(names){
    return function(token){
      if(token instanceof Tag === false){
	return false;
      }
      var tag_name = token.getName();
      return List.exists(names, function(name){
	return name === tag_name;
      });
    };
  }
};
