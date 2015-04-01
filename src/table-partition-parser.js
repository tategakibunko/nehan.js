/**
   table partition parser module

   @namespace Nehan.TablePartitionParser
*/
var TablePartitionParser = {
  /**
    @memberof Nehan.TablePartitionParser
    @param style {Nehan.StyleContext}
    @param stream {Nehan.TokenStream}
    @return {Nehan.PartitionHashSet}
  */
  parse : function(style, stream){
    var pset = new PartitionHashSet();
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
	pset = pset.union(pset2);
	break;

      case "tr":
	var cell_tags = this._getCellStream(token).getTokens();
	var cell_count = cell_tags.length;
	var partition = this._getPartition(style, cell_tags);
	pset.add(cell_count, partition);
	break;
      }
    }
    return pset;
  },
  _getPartition : function(style, cell_tags){
    var self = this;
    var partition_count = cell_tags.length;
    var partition_units = List.map(cell_tags, function(cell_tag){
      return self._getPartitionUnit(style, cell_tag, partition_count);
    });
    return new Partition(partition_units);
  },
  _getPartitionUnit : function(style, cell_tag, partition_count){
    var measure = cell_tag.getAttr("measure") || cell_tag.getAttr("width") || null;
    if(measure){
      return new PartitionUnit({weight:measure, isStatic:true});
    }
    var content = cell_tag.getContent();
    var lines = cell_tag.getContent().replace(/<br \/>/g, "\n").replace(/<br>/g, "\n").split("\n");
    // this sizing algorithem is not strict, but still effective,
    // especially for text only table.
    var max_line = List.maxobj(lines, function(line){ return line.length; });
    var max_weight = Math.floor(style.contentMeasure / 2);
    var min_weight = Math.floor(style.contentMeasure / (partition_count * 2));
    var weight = max_line.length * style.getFontSize();
    // less than 50% of parent size, but more than 50% of average partition size.
    weight = Math.max(min_weight, Math.min(weight, max_weight));

    // but confirm that weight is more than single font size of parent style.
    weight = Math.max(style.getFontSize(), weight);
    return new PartitionUnit({weight:weight, isStatic:false});
  },
  _getCellStream : function(tag){
    return new TokenStream(tag.getContent(), {
      filter:Closure.isTagName(["td", "th"])
    });
  },
  _getRowStream : function(tag){
    return new TokenStream(tag.getContent(), {
      filter:Closure.isTagName(["tr"])
    });
  }
};

