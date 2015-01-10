var Break = (function(){
  function Break(value){
    this.value = value;
  }

  Break.prototype = {
    isAlways : function(){
      return this.value === "always";
    },
    isAvoid : function(){
      return this.value === "avoid";
    },
    isFirst : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "left") : (this.value === "right");
    },
    isSecond : function(){
      return (Display.getPagingDirection() === "lr")? (this.value === "right") : (this.value === "left");
    },
    isNth : function(order){
    }
  };

  return Break;
})();

