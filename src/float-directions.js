var FloatDirections = {
  start:(new FloatDirection("start")),
  end:(new FloatDirection("end")),
  none:(new FloatDirection("none")),
  get : function(name){
    return this[name] || null;
  }
};
