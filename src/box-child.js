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
