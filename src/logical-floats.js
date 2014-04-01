var LogicalFloats = {
  start:(new LogicalFloat("start")),
  end:(new LogicalFloat("end")),
  none:(new LogicalFloat("none")),
  get : function(name){
    name = name || "none";
    return this[name];
  }
};
