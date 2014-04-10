// pop floated element both from start and end, but select larger one.
var FloatGroupStack = (function(){

  // [float block] -> FloatGroup
  var pop_float_group = function(flow, float_direction, blocks){
    var head = blocks.pop() || null;
    if(head === null){
      return null;
    }
    var extent = head.getBoxExtent(flow);
    var group = new FloatGroup([head], float_direction);

    // group while previous floated-element has smaller extent than the head
    while(true){
      var next = blocks.pop();
      if(next && next.getBoxExtent(flow) <= extent){
	group.add(next);
      } else {
	blocks.push(next); // push back
	break;
      }
    }
    return group;
  };

  // [float block] -> [FloatGroup]
  var make_float_groups = function(flow, float_direction, blocks){
    var ret = [];
    do{
      var group = pop_float_group(flow, float_direction, blocks);
      if(group){
	ret.push(group);
      }
    } while(group !== null);
    return ret;
  };

  function FloatGroupStack(flow, start_blocks, end_blocks){
    var start_groups = make_float_groups(flow, FloatDirections.get("start"), start_blocks);
    var end_groups = make_float_groups(flow, FloatDirections.get("end"), end_blocks);
    this.stack = start_groups.concat(end_groups).sort(function(g1, g2){
      return g1.getExtent(flow) - g2.getExtent(flow);
    });
  }

  FloatGroupStack.prototype = {
    isEmpty : function(){
      return this.stack.length === 0;
    },
    pop : function(){
      return this.stack.pop() || null;
    }
  };

  return FloatGroupStack;
})();

