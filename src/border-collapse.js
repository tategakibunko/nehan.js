/**
   @namespace Nehan.BorderCollapse
*/
Nehan.BorderCollapse = (function(){
  var __find_parent_enable_border = function(style, target){
    var parent_style = style.parent;
    if(parent_style.edge && parent_style.edge.border && parent_style.edge.border.getByName(style.flow, target) > 0){
      return parent_style.edge.border;
    }
    return parent_style.parent? __find_parent_enable_border(parent_style, target) : null;
  };

  var __collapse_border = function(style, border){
    switch(style.display){
    case "table-header-group":
    case "table-row-group":
    case "table-footer-group":
    case "table-row":
      __collapse_border_table_row(style, border);
      break;
    case "table-cell":
      __collapse_border_table_cell(style, border);
      break;
    }
  };

  var __collapse_border_table_row = function(style, border){
    var parent_start_border = __find_parent_enable_border(style, "start");
    if(parent_start_border){
      __collapse_border_between(
	style,
	{border:parent_start_border, target:"start"},
	{border:border, target:"start"}
      );
    }
    var parent_end_border = __find_parent_enable_border(style, "end");
    if(parent_end_border){
      __collapse_border_between(
	style,
	{border:parent_end_border, target:"end"},
	{border:border, target:"end"}
      );
    }
    if(style.prev && style.prev.edge && style.prev.edge.border){
      __collapse_border_between(
	style,
	{border:style.prev.edge.border, target:"after"},
	{border:border, target:"before"}
      );
    }
    if(style.isFirstChild()){
      var parent_before_border = __find_parent_enable_border(style, "before");
      if(parent_before_border){
	__collapse_border_between(
	  style,
	  {border:parent_before_border, target:"before"},
	  {border:border, target:"before"}
	);
      }
    }
    if(style.isLastChild()){
      var parent_after_border = __find_parent_enable_border(style, "after");
      if(parent_after_border){
	__collapse_border_between(
	  style,
	  {border:parent_after_border, target:"after"},
	  {border:border, target:"after"}
	);
      }
    }
  };

  var __collapse_border_table_cell = function(style, border){
    if(style.prev && style.prev.edge && style.prev.edge.border){
      __collapse_border_between(
	style,
	{border:style.prev.edge.border, target:"end"},
	{border:border, target:"start"}
      );
    }
    var parent_before_border = __find_parent_enable_border(style, "before");
    if(parent_before_border){
      __collapse_border_between(
	style,
	{border:parent_before_border, target:"before"},
	{border:border, target:"before"}
      );
    }
    var parent_after_border = __find_parent_enable_border(style, "after");
    if(parent_after_border){
      __collapse_border_between(
	style,
	{border:parent_after_border, target:"after"},
	{border:border, target:"after"}
      );
    }
    if(style.isFirstChild()){
      var parent_start_border = __find_parent_enable_border(style, "start");
      if(parent_start_border){
	__collapse_border_between(
	  style,
	  {border:parent_start_border, target:"start"},
	  {border:border, target:"start"}
	);
      }
    }
    if(style.isLastChild()){
      var parent_end_border = __find_parent_enable_border(style, "end");
      if(parent_end_border){
	__collapse_border_between(
	  style,
	  {border:parent_end_border, target:"end"},
	  {border:border, target:"end"}
	);
      }
    }
  };

  var __collapse_border_between = function(style, prev, cur){
    var prev_size = prev.border.getByName(style.flow, prev.target);
    var cur_size = cur.border.getByName(style.flow, cur.target);
    var new_size = Math.max(0, cur_size - prev_size);
    var rm_size = cur_size - new_size;
    switch(cur.target){
    case "before": case "after":
      style.contentExtent += rm_size;
      break;
    case "start": case "end":
      style.contentMeasure += rm_size;
      break;
    }
    cur.border.setByName(style.flow, cur.target, new_size);
  };

  return {
    /**
     @memberof Nehan.BorderCollapse
     @param style {Nehan.Style}
     */
    collapse : function(style){
      __collapse_border(style);
    }
  };
})();
