/**
   @namespace Nehan.MathUtils
*/
var MathUtils = {
  /**
     convert [decial] number by [base]

     @memberof Nehan.MathUtils
     @param deciaml {int}
     @param base {int}
     @return {int}
  */
  convBase : function(decimal, base){
   if(decimal === 0){
      return [0];
    }
    var ret = [];
    var work = decimal;
    while(work > 0){
      ret.unshift(work % base);
      work = Math.floor(work / base);
    }
    return ret;
  }
};

