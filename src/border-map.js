var BorderMap = (function(){
  function BorderMap(row_count, max_col){
    this.rowCount = row_count;
    this.maxCol = max_col;
    this.map = this._create(row_count, max_col);
  }

  BorderMap.prototype = {
    _create : function(row_count, max_col){
      var map = [];
      var make_row = function(max_col){
	var row = [];
	for(var i = 0; i < max_col; i++){
	  row.push({start:0, end:0, before:0, after:0});
	}
	return row;
      };
      for(var i = 0; i < row_count; i++){
	map.push(make_row(max_col));
      }
      return map;
    },
    get : function(row, col){
      return this.map[row][col];
    },
    getAsStyle : function(row, col){
      var border = this.get(row, col);
      var ret = {};
      for(var prop in border){
	ret[prop] = border[prop] + "px";
      }
      return ret;
    },
    set : function(row, col, border){
      for(var prop in border){
	this.setBorderProp(row, col, prop, border);
      }
    },
    collapse : function(){
      this._collapseCol();
      this._collapseRow();
    },
    _collapseCol : function(){
      for(var row = 0; row < this.rowCount; row++){
	for(var col = 0; col < this.maxCol - 1; col++){
	  var c1 = this.get(row, col);
	  var c2 = this.get(row, col+1);
	  if(c1.end && c2.start){
	    if(c1.end > c2.start){
	      c2.start = 0;
	    } else {
	      c1.end = 0;
	    }
	  }
	}
      }
    },
    _collapseRow : function(){
      for(var row = 0; row < this.rowCount - 1; row++){
	for(var col = 0; col < this.maxCol; col++){
	  var r1 = this.get(row, col);
	  var r2 = this.get(row+1, col);
	  if(r1.after && r2.before){
	    if(r1.after > r2.before){
	      r2.before = 0;
	    } else {
	      r1.after = 0;
	    }
	  }
	}
      }
    },
    setBorderProp : function(row, col, prop, border){
      var cur = this.get(row, col);
      if(border[prop] > cur[prop]){
	cur[prop] = border[prop];
      }
    },
    setRange : function(start_row, start_col, end_row, end_col, border){
      for(var row = start_row; row < end_row; row++){
	for(var col = start_col; col < end_col; col++){
	  if(row == start_row){
	    this.setBorderProp(row, col, "before", border);
	  }
	  if(row == end_row - 1){
	    this.setBorderProp(row, col, "after", border);
	  }
	  if(col == start_col){
	    this.setBorderProp(row, col, "start", border);
	  }
	  if(col == end_col - 1){
	    this.setBorderProp(row, col, "end", border);
	  }
	}
      }
    }
  };

  return BorderMap;
})();
