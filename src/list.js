/**
   list utility module

   @namespace Nehan.List
*/
Nehan.List = {
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> ()
  */
  iter : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> ()
  */
  iteri : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      fn(i, lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> ()
  */
  reviter : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> ()
  */
  reviteri : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      fn(i, lst[i]);
    }
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {boolean}
  */
  forall : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(!fn(lst[i])){
	return false;
      }
    }
    return true;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> obj
     @return {Array}
  */
  map : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret.push(fn(lst[i]));
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun index -> obj -> obj
     @return {Array}
  */
  mapi : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret.push(fn(i, lst[i]));
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param acm {foldable_value} - accumulator
     @param fn {Function} - fun acm -> obj -> acm
     @return {folded_value}
  */
  fold : function(lst, acm, fn){
    var ret = acm;
    for(var i = 0, len = lst.length; i < len; i++){
      ret = fn(ret, lst[i]);
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {Array}
  */
  filter : function(lst, fn){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	ret.push(lst[i]);
      }
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {first_founded_object}
  */
  find : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj)){
	return obj;
      }
    }
    return null;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {first_founded_object}
  */
  revfind : function(lst, fn){
    for(var i = lst.length - 1; i >= 0; i--){
      var obj = lst[i];
      if(fn(obj)){
	return obj;
      }
    }
    return null;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {int}
  */
  indexOf : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      var obj = lst[i];
      if(fn(obj)){
	return i;
      }
    }
    return -1;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {boolean}
  */
  exists : function(lst, fn){
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	return true;
      }
    }
    return false;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {boolean}
  */
  mem : function(lst, val){
    for(var i = 0, len = lst.length; i < len; i++){
      if(lst[i] == val){
	return true;
      }
    }
    return false;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param start {Number}
     @param fn {Function}
     @return {Number}
  */
  sum : function(lst, start, fn){
    return this.fold(lst, start, function(ret, obj){
      return ret + fn(obj);
    });
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {Number}
     @return {min_obj}
  */
  minobj : function(lst, fn){
    var min_obj = null, min_val = null;
    this.iter(lst, function(obj){
      var val = fn(obj);
      if(min_val === null || val < min_val){
	min_obj = obj;
	min_val = val;
      }
    });
    return min_obj;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {Number}
     @return {max_obj}
  */
  maxobj : function(lst, fn){
    var max_obj = null, max_val = null;
    this.iter(lst, function(obj){
      var val = fn(obj);
      if(max_val === null || val > max_val){
	max_obj = obj;
	max_val = val;
      }
    });
    return max_obj;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @return {Array}
  */
  refcopy : function(lst){
    var ret = [];
    for(var i = 0, len = lst.length; i < len; i++){
      ret[i] = lst[i];
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @param fn {Function} - fun obj -> {boolean}
     @return {int}
  */
  count : function(lst, fn){
    var ret = 0;
    for(var i = 0, len = lst.length; i < len; i++){
      if(fn(lst[i])){
	ret++;
      }
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param count {int} - array length
     @param init_val - initialized value filled in new array
     @return {Array}
  */
  create : function(count, init_val){
    var ret = [];
    for(var i = 0; i < count; i++){
      ret.push((typeof init_val !== "undefined")? init_val : i);
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @return {first_object | null}
  */
  first : function(lst){
    return lst[0] || null;
  },
  /**
     @memberof Nehan.List
     @param lst {Array}
     @return {last_object | null}
  */
  last : function(lst){
    var len = lst.length;
    if(len === 0){
      return null;
    }
    return lst[len - 1];
  },
  /**
     @memberof Nehan.List
     @param lst1 {Array}
     @param lst2 {Array}
     @return {Array.<Array>}
  */
  zip : function(lst1, lst2){
    var ret = [];
    for(var i = 0, len = Math.min(lst1.length, lst2.length); i < len; i++){
      ret[i] = [lst1[i], lst2[i]];
    }
    return ret;
  },
  /**
     @memberof Nehan.List
     @param props {Array}
     @param values {Array}
     @return {Object}
     @example
     * Nehan.List.zipObj(["a", "b", "c"], [1, 2, 3]); // {a:1, b:2, c:3}
  */
  zipObj : function(props, values){
    var ret = {};
    if(props.length !== values.length){
      throw "invalid args:List.zipObj";
    }
    for(var i = 0, len = props.length; i < len; i++){
      ret[props[i]] = values[i];
    }
    return ret;
  },
  /**
     non destructive reverse

     @memberof Nehan.List
     @param lst {Array}
     @return {Array}
  */
  reverse : function(lst){
    var ret = [];
    this.reviter(lst, function(obj){
      ret.push(obj);
    });
    return ret;
  }
};

