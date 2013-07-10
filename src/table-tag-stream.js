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
    this.markup.tableChilds = this.tokens = this._parseTokens(this.tokens);
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
  _setChildTokens : function(target, childs){
    target.tableChilds = childs;
    var len = childs.length;
    if(len > 0){
      target.firstChild = childs[0];
      target.lastChild = childs[len - 1];
    }
    return target;
  },
  _parseTokens : function(tokens){
    var theads = [], tfoots = [], tbodies = [], self = this;
    var thead = null, tbody = null, tfoot = null;
    var ctx = {row:0, col:0, maxCol:0};
    List.iter(tokens, function(token){
      if(Token.isTag(token)){
	switch(token.name){
	case "tr":
	  token.row = ctx.row;
	  self._setChildTokens(token, self._parseCols(ctx, token.getContent()));
	  ctx.row++;
	  tbodies.push(token);
	  break;
	case "thead":
	  thead = token;
	  theads = theads.concat(self._parseRows(ctx, token.getContent()));
	  break;
	case "tbody":
	  tbody = token;
	  tbodies = tbodies.concat(self._parseRows(ctx, token.getContent()));
	  break;
	case "tfoot":
	  tfoot = token;
	  tfoots = tfoots.concat(self._parseRows(ctx, token.getContent()));
	  break;
	}
      }
    });

    var ret = [], nrow = 0;

    if(theads.length > 0){
      if(thead === null){
	thead = new Tag("<thead>");
      }
      this._setChildTokens(thead, theads);
      thead.row = nrow;
      nrow += thead.tableChilds.length;
      ret.push(thead);
    }

    if(tbodies.length > 0){
      if(tbody === null){
	tbody = new Tag("<tbody>");
      }
      this._setChildTokens(tbody, tbodies);
      tbody.row = nrow;
      nrow += tbody.tableChilds.length;
      ret.push(tbody);
    }

    if(tfoots.length > 0){
      if(tfoot === null){
	tfoot = new Tag("<tfoot>");
      }
      this._setChildTokens(tfoot, tfoots);
      tfoot.row = nrow;
      ret.push(tfoot);
    }

    this._setChildTokens(this.markup, ret);
    this.markup.maxCol = ctx.maxCol;
    this.markup.rowCount = ctx.row;

    return ret;
  },
  _parsePartition : function(childs, box){
    return List.map(childs, function(child){
      var size = child.getTagAttr("measure") || child.getTagAttr("width") || 0;
      if(size){
	return UnitSize.getBoxSize(size, box.fontSize, box.getContentMeasure());
      }
      return 0;
    });
  },
  _parseRows : function(ctx, content){
    var self = this;
    var rows = (new FilteredTagStream(content, function(tag){
      return tag.getName() === "tr";
    })).getAll();

    return List.map(rows, function(row){
      row.row = ctx.row;
      row = self._setChildTokens(row, self._parseCols(ctx, row.getContent()));
      ctx.row++;
      return row;
    });
  },
  _parseCols : function(ctx, content){
    var cols = (new FilteredTagStream(content, function(tag){
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


