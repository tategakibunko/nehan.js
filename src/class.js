/**
   @namespace Nehan.Class
*/
Nehan.Class = {};

/**
   @memberof Nehan.Class
   @param childCtor {Object}
   @param parentCtor {Object}
   @return {Object}
*/
Nehan.Class.extend = function(childCtor, parentCtor) {
  function TempCtor() {}
  TempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new TempCtor();
  childCtor.prototype.constructor = childCtor;
};

