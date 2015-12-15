Nehan.FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var __pop_float_group = function(flow, float_direction, blocks){
    var head = blocks.pop() || null;
    if(head === null){
      return null;
    }
    var extent = head.getLayoutExtent(flow);
    var group = new Nehan.FloatGroup([head], float_direction);

    // group while previous floated-element has smaller extent than the head
    while(true){
      var next = blocks.pop();
      if(next && next.getLayoutExtent(flow) <= extent){
	group.add(next);
      } else {
	blocks.push(next); // push back
	break;
      }
    }
    return group;
  };

  // [floated element] -> [FloatGroup]
  var __make_float_groups = function(flow, float_direction, blocks){
    var ret = [], group;
    do{
      group = __pop_float_group(flow, float_direction, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);

    if(ret.length > 0){
      ret[0].setLast(true);
    }
    return ret;
  };

  /**
     @memberof Nehan
     @class FloatGroupStack
     @classdesc pop {@link Nehan.FloatGroup} with larger extent from start or end.
     @constructor
     @param flow {Nehan.BoxFlow}
     @param start_blocks {Array.<Nehan.Box>}
     @param end_blocks {Array.<Nehan.Box>}
  */
  function FloatGroupStack(flow, start_blocks, end_blocks){
    var start_groups = __make_float_groups(flow, Nehan.FloatDirections.start, start_blocks);
    var end_groups = __make_float_groups(flow, Nehan.FloatDirections.end, end_blocks);
    this.stack = start_groups.concat(end_groups).sort(function(g1, g2){
      return g1.getExtent(flow) - g2.getExtent(flow);
    });
    var max_group =  Nehan.List.maxobj(this.stack, function(group){
      return group.getExtent(flow);
    });
    this.flow = flow;
    this.lastGroup = null;
    //console.log("max group from %o is %o", this.stack, max_group);
    this.extent = max_group? max_group.getExtent(flow) : 0;
  }

  /**
   @memberof Nehan.FloatGroupStack
   @return {boolean}
   */
  FloatGroupStack.prototype.isEmpty = function(){
    return this.stack.length === 0;
  };
  /**
   @memberof Nehan.FloatGroupStack
   @return {int}
   */
  FloatGroupStack.prototype.getExtent = function(){
    return this.extent;
  };
  /**
   @memberof Nehan.FloatGroupStack
   @return {Nehan.FloatGroup}
   */
  FloatGroupStack.prototype.getLastGroup = function(){
    return this.lastGroup;
  };
  /**
   pop {@link Nehan.FloatGroup} with larger extent from start or end.

   @memberof Nehan.FloatGroupStack
   @return {Nehan.FloatGroup}
   */
  FloatGroupStack.prototype.pop = function(){
    this.lastGroup = this.stack.pop() || null;
    return this.lastGroup;
  };

  return FloatGroupStack;
})();

