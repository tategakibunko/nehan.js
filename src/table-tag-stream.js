var TableTagStream = FilteredTagStream.extend({
  init : function(markup){
    // TODO: caption not supported yet.
    this._super(markup.getContent(), function(tag){
      var name = tag.getName();
      return (name === "thead" ||
	      name === "tbody" ||
	      name === "tfoot" ||
	      name === "tr");
    });
    this.markup = markup;
    this.markup.tableChilds = this.tokens = this._parseTokens(this.markup, this.tokens);
  },
  getPartition : function(box){
    var self = this;
    var partition = new TablePartition();
    var measure = box.getContentMeasure();
    List.iter(this.tokens, function(row_group){
      var rows = row_group.tableChilds;
      List.iter(rows, function(row){
	var cols = row.tableChilds;
	var cols_count = cols.length;
	if(partition.getPartition(cols_count) === null){
	  var parts = self._parsePartition(cols, box);
	  partition.add(new Partition(parts, measure));
	}
      });
    });
    return partition;
  },
  _parseTokens : function(parent_markup, tokens){
    var theads = [], tfoots = [], tbodies = [], self = this;
    var thead = null, tbody = null, tfoot = null;
    var ctx = {row:0, col:0, maxCol:0};
    List.iter(tokens, function(token){
      if(Token.isTag(token)){
	switch(token.name){
	case "tr":
	  token.row = ctx.row;
	  token.tableChilds = self._parseCols(ctx, token);
	  ctx.row++;
	  tbodies.push(token);
	  break;
	case "thead":
	  thead = token;
	  theads = theads.concat(self._parseRows(ctx, token));
	  break;
	case "tbody":
	  tbody = token;
	  tbodies = tbodies.concat(self._parseRows(ctx, token));
	  break;
	case "tfoot":
	  tfoot = token;
	  tfoots = tfoots.concat(self._parseRows(ctx, token));
	  break;
	}
      }
    });

    var ret = [], nrow = 0;

    if(theads.length > 0){
      if(thead === null){
	thead = new Tag("<thead>");
      }
      thead.tableChilds = theads;
      thead.row = nrow;
      nrow += theads.length;
      ret.push(thead);
    }

    if(tbodies.length > 0){
      if(tbody === null){
	tbody = new Tag("<tbody>");
      }
      tbody.tableChilds = tbodies;
      tbody.row = nrow;
      nrow += tbodies.length;
      ret.push(tbody);
    }

    if(tfoots.length > 0){
      if(tfoot === null){
	tfoot = new Tag("<tfoot>");
      }
      tfoot.tableChilds = tfoots;
      tfoot.row = nrow;
      ret.push(tfoot);
    }

    this.markup.tableChilds = ret;
    this.markup.maxCol = ctx.maxCol;
    this.markup.rowCount = ctx.row;

    return ret;
  },
  _parsePartition : function(childs, box){
    return List.map(childs, function(child){
      var size = child.getTagAttr("measure") || child.getTagAttr("width") || 0;
      if(size){
	return UnitSize.getBoxSize(size, box.getFontSize(), box.getContentMeasure());
      }
      return 0;
    });
  },
  _parseRows : function(ctx, parent){
    var self = this;
    var rows = (new FilteredTagStream(parent.getContent(), function(tag){
      return tag.getName() === "tr";
    })).getAll();

    return List.map(rows, function(row){
      row.row = ctx.row;
      row.tableChilds = self._parseCols(ctx, row);
      ctx.row++;
      return row;
    });
  },
  _parseCols : function(ctx, parent){
    var cols = (new FilteredTagStream(parent.getContent(), function(tag){
      var name = tag.getName();
      return (name === "td" || name === "th");
    })).getAll();

    List.iteri(cols, function(i, col){
      col.row = ctx.row;
      col.col = i;
    });

    if(cols.length > ctx.maxCol){
      ctx.maxCol = cols.length;
    }
    return cols;
  }
});


