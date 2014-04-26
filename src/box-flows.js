var BoxFlows = {
  "tb-rl":(new BoxFlow("tb", "rl")),
  "tb-lr":(new BoxFlow("tb", "lr")),
  "lr-tb":(new BoxFlow("lr", "tb")),
  "rl-tb":(new BoxFlow("rl", "tb")),
  get: function(inflow, blockflow){
    return this.getByName([inflow, blockflow].join("-"));
  },
  getByName : function(name){
    return this[name] || null;
  }
};
