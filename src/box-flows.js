var BoxFlows = {
  "tb-rl":(new BoxFlow("tb", "rl")),
  "tb-lr":(new BoxFlow("tb", "lr")),
  "lr-tb":(new BoxFlow("lr", "tb")),
  "rl-tb":(new BoxFlow("rl", "tb")),

  "tb-rl-mc":(new BoxFlow("tb", "rl", true)),
  "tb-lr-mc":(new BoxFlow("tb", "lr", true)),
  "lr-tb-mc":(new BoxFlow("lr", "tb", true)),
  "rl-tb-mc":(new BoxFlow("rl", "tb", true)),

  NORMAL:(new BoxFlow("lr", "tb")),
  get: function(inflow, blockflow, multicol){
    var is_multicol = multicol || false;
    var name = inflow + "-" + blockflow + (is_multicol? "-mc" : "");
    return this.getByName(name);
  },
  getByName : function(name){
    return this[name];
  }
};
