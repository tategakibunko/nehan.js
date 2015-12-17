/**
 @namespace Nehan.MarginCancel
*/
Nehan.MarginCancel = (function(){
  // prerequisite: style.edge.margin is available
  var __cancel_margin = function(style){
    if(style.parent && style.parent.edge && style.parent.edge.margin){
      __cancel_margin_parent(style);
    }
    if(style.prev && style.prev.isBlock() && style.prev.edge){
      // cancel margin between previous sibling and cur element.
      if(style.prev.edge.margin && style.edge.margin){
	__cancel_margin_sibling(style);
      }
    }
  };

  // cancel margin between parent and current element
  var __cancel_margin_parent = function(style){
    if(style.isFirstChild()){
      __cancel_margin_first_child(style);
    }
    if(style.isLastChild()){
      __cancel_margin_last_child(style);
    }
  };

  // cancel margin between parent and first-child(current element)
  var __cancel_margin_first_child = function(style){
    if(style.flow === style.parent.flow){
      __cancel_margin_between(
	style,
	{edge:style.parent.edge, target:"before"},
	{edge:style.edge, target:"before"}
      );
    }
  };

  // cancel margin between parent and first-child(current element)
  var __cancel_margin_last_child = function(style){
    if(style.flow === style.parent.flow){
      __cancel_margin_between(
	style,
	{edge:style.parent.edge, target:"after"},
	{edge:style.edge, target:"after"}
      );
    }
  };

  // cancel margin prev sibling and current element
  var __cancel_margin_sibling = function(style){
    if(style.flow === style.prev.flow){
      // both prev and cur are floated to same direction
      if(style.isFloated() && style.prev.isFloated()){
	if(style.isFloatStart() && style.prev.isFloatStart()){
	  // [start] x [start]
	  __cancel_margin_between(
	    style,
	    {edge:style.prev.edge, target:"end"},
	    {edge:style.edge, target:"start"}
	  );
	} else if(style.isFloatEnd() && style.prev.isFloatEnd()){
	  // [end] x [end]
	  __cancel_margin_between(
	    style,
	    {edge:style.prev.edge, target:"start"},
	    {edge:style.edge, target:"end"}
	  );
	}
      } else if(!style.isFloated() && !style.prev.isFloated()){
	// [block] x [block]
	__cancel_margin_between(
	    style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"before"}
	);
      }
    } else if(style.prev.isTextHorizontal() && style.isTextVertical()){
      // [hori] x [vert]
      __cancel_margin_between(
	style,
	{edge:style.prev.edge, target:"after"},
	{edge:style.edge, target:"before"}
      );
    } else if(style.prev.isTextVertical() && style.isTextHorizontal()){
      if(style.prev.flow.isBlockRightToLeft()){
	// [vert:tb-rl] x [hori]
	__cancel_margin_between(
	  style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"end"}
	);
      } else {
	// [vert:tb-lr] x [hori]
	__cancel_margin_between(
	  style,
	  {edge:style.prev.edge, target:"after"},
	  {edge:style.edge, target:"start"}
	);
      }
    }
  };

  // if prev_margin > cur_margin, just clear cur_margin.
  var __cancel_margin_between = function(style, prev, cur){
    // margin collapsing is ignored if there is a border between two edge.
    if(prev.edge.border && prev.edge.border.getByName(style.flow, prev.target) ||
       cur.edge.border && cur.edge.border.getByName(style.flow, cur.target)){
      return;
    }
    var prev_size = prev.edge.margin.getByName(style.flow, prev.target);
    var cur_size = cur.edge.margin.getByName(style.flow, cur.target);

    // we use float for layouting each block element in evaluation phase,
    // so standard margin collapsing doesn't work.
    // that is because we use 'differene' of margin for collapsed size.
    var new_size = (prev_size > cur_size)? 0 : cur_size - prev_size;

    cur.edge.margin.setByName(style.flow, cur.target, new_size);

    var rm_size = cur_size - new_size;

    // update content size
    style.contentExtent += rm_size;
  };

  return {
    /**
     @memberof Nehan.MarginCancel
     @param style {Nehan.Style}
     */
    cancel : function(style){
      __cancel_margin(style);
    }
  };
})();
