var BoxChild = (function(){
  function BoxChild(){
    this.forward = [];
    this.normal = [];
    this.backward = [];
  }

  BoxChild.prototype = {
    get : function(){
      return this.forward.concat(this.normal).concat(this.backward);
    },
    setNormal : function(elements){
      this.normal = elements;
    },
    getLength : function(){
      return this.forward.length + this.normal.length + this.backward.length;
    },
    getFirst : function(){
      if(this.forward.length > 0){
	return this.forward[0];
      }
      if(this.normal.length > 0){
	return this.normal[0];
      }
      if(this.backward.length > 0){
	return this.backward[this.backward.length - 1];
      }
      return null;
    },
    add : function(child){
      if(child.backward){
	this.backward.unshift(child);
      } else if(child.forward){
	this.forward.push(child);
      } else {
	this.normal.push(child);
      }
    }
  };

  return BoxChild;
})();
