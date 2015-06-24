/**
   pre defined box flow collection.
   @namespace Nehan.BoxFlows
*/
Nehan.BoxFlows = {
  "tb-rl":(new Nehan.BoxFlow("tb", "rl")),
  "tb-lr":(new Nehan.BoxFlow("tb", "lr")),
  "lr-tb":(new Nehan.BoxFlow("lr", "tb")),
  "rl-tb":(new Nehan.BoxFlow("rl", "tb")),
  /**
     get box flow by inflow and blockflow.

     @memberof Nehan.BoxFlows
     @param inflow {string} - "tb" or "lr"
     @param blockflow {string} - "tb" or "lr" or "rl"
     @return {Nehan.BoxFlow}
  */
  get: function(inflow, blockflow){
    return this.getByName([inflow, blockflow].join("-"));
  },
  /**
     get box flow by flow-name.

     @memberof Nehan.BoxFlows
     @param name {string} - "lr-tb" or "tb-rl" or "tb-lr"
     @return {Nehan.BoxFlow}
  */
  getByName : function(name){
    return this[name] || null;
  }
};
