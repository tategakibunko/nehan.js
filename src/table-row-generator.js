// parent : table | thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  function TableRowGenerator(style, stream){
    var generators = this._getGenerators(style, stream);
    ParallelGenerator.call(this, style, generators);
  }
  Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style, stream){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(style, child_tags);
    return List.map(child_styles, function(child_style){
      return new TableCellGenerator(child_style, new TokenStream(child_style.getMarkupContent()));
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(style, child_tags){
    var self = this;
    var cell_count = child_tags.length;
    var rest_measure = style.contentMeasure;
    var part_set = style.getPartitionSet();
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (cell_count - i));
      if(part_set){
	measure = part_set.getSize(cell_count, i);
      }
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure
      });
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return stream.getAllIf(function(token){
      return (token instanceof Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowGenerator;
})();
