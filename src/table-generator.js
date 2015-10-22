/*
  type partion_set = (col_count, partition) HashSet.t
  and col_count = int
  and partition = [partition_unit]
  and partition_unit = PartitionUnit(size, is_important)
  and size = int
  and is_important = bool
*/

// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
var TableGenerator = (function(){
  /**
     @memberof Nehan
     @class TableGenerator
     @classdesc generator of table tag content.
     @constructor
     @extends {Nehan.BlockGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);

    // load partition set after context size is calculated.
    if(style.getCssAttr("table-layout") === "auto"){
      style.tablePartition = this._createAutoPartition(stream);
      stream.rewind();
    }
  }
  Nehan.Class.extend(TableGenerator, BlockGenerator);

  TableGenerator.prototype._createAutoPartition = function(stream){
    var pset = new Nehan.PartitionHashSet();
    while(stream.hasNext()){
      var token = stream.get();
      if(token === null){
	break;
      }
      if(!Nehan.Token.isTag(token)){
	continue;
      }
      switch(token.getName()){
      case "tbody": case "thead": case "tfoot":
	var pset2 = this._createAutoPartition(new Nehan.TokenStream(token.getContent(), {
	  flow:this.style.flow,
	  filter:Nehan.Closure.isTagName(["tr"])
	}));
	pset = pset.union(pset2);
	break;

      case "tr":
	var cell_tags = new Nehan.TokenStream(token.getContent(), {
	  flow:this.style.flow,
	  filter:Nehan.Closure.isTagName(["td", "th"])
	}).getTokens();
	var cell_count = cell_tags.length;
	var partition = this._getPartition(cell_tags);
	pset.add(cell_count, partition);
	break;
      }
    }
    return pset;
  };

  TableGenerator.prototype._getPartition = function(cell_tags){
    var partition_count = cell_tags.length;
    var partition_units = cell_tags.map(function(cell_tag){
      return this._getPartitionUnit(cell_tag, partition_count);
    }.bind(this));
    return new Nehan.Partition(partition_units);
  };

  TableGenerator.prototype._getPartitionUnit = function(cell_tag, partition_count){
    var measure = cell_tag.getAttr("measure") || cell_tag.getAttr("width") || null;
    if(measure){
      return new Nehan.PartitionUnit({weight:measure, isStatic:true});
    }
    var content = cell_tag.getContent();
    var lines = cell_tag.getContent().replace(/<br \/>/g, "\n").replace(/<br>/g, "\n").split("\n");
    // this sizing algorithem is not strict, but still effective,
    // especially for text only table.
    var max_line = Nehan.List.maxobj(lines, function(line){ return line.length; });
    var max_weight = Math.floor(this.style.contentMeasure / 2);
    var min_weight = Math.floor(this.style.contentMeasure / (partition_count * 2));
    var weight = max_line.length * this.style.getFontSize();
    // less than 50% of parent size, but more than 50% of average partition size.
    weight = Math.max(min_weight, Math.min(weight, max_weight));

    // but confirm that weight is more than single font size of parent style.
    weight = Math.max(this.style.getFontSize(), weight);
    return new Nehan.PartitionUnit({weight:weight, isStatic:false});
  };

  return TableGenerator;
})();

