var PartitionSetParser = {
  _getPartition : function(style, cell_tags){
    var self = this;
    var partition_units = List.map(cell_tags, function(cell_tag){
      return self._getPartitionUnit(style, cell_tag);
    });
    return new Partition(partition_units);
  },
  _getPartitionUnit : function(style, cell_tag){
    var measure = cell_tag.getAttr("measure") || cell_tag.getAttr("width") || null;
    if(measure){
      return new PartitionUnit({size:measure, isImportant:true});
    }
    var content = cell_tag.getContent();
    var lines = cell_tag.getContent().split("\n");
    var max_line = List.maxobj(lines, function(line){ return line.length; });
    var max_part_size = Math.floor(style.contentMeasure / 2);
    var size = Math.min(max_line.length * style.getFontSize(), max_part_size);
    return new PartitionUnit({size:size, isImportant:false});
  },
  _getCellStream : function(tag){
    return new FilteredTokenStream(tag.getContent(), function(token){
      return Token.isTag(token) && (token.getName() === "td" || token.getName() === "th");
    });
  },
  _getRowStream : function(tag){
    return new FilteredTokenStream(tag.getContent(), function(token){
      return Token.isTag(token) && token.getName() === "tr";
    });
  },
  parse : function(style, stream){
    var pset = new PartitionSet(style.contentMeasure);
    while(stream.hasNext()){
      var token = stream.get();
      if(token === null){
	break;
      }
      if(!Token.isTag(token)){
	continue;
      }
      switch(token.getName()){
      case "tbody": case "thead": case "tfoot":
	var pset2 = this.parse(style, this._getRowStream(token));
	pset.addSet(pset2);
	break;

      case "tr":
	var cell_tags = this._getCellStream(token).getAll();
	var cell_count = cell_tags.length;
	var partition = this._getPartition(style, cell_tags);
	pset.add(cell_count, partition);
	break;
      }
    }
    return pset;
  }
};

