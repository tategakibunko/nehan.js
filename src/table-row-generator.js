// parent : table | thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  /**
     @memberof Nehan
     @class TableRowGenerator
     @classdesc generator of table row(TR) content.
     @constructor
     @extends {Nehan.ParallelGenerator}
     @param style {Nehan.StyleContext}
     @param stream {Nehan.TagStream}
  */
  function TableRowGenerator(style, stream){
    var generators = this._getGenerators(style, stream);
    ParallelGenerator.call(this, style, generators);
  }
  Nehan.Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style_tr, stream){
    var child_styles = this._getChildStyles(style_tr, stream);
    return Nehan.List.map(child_styles, function(child_style){
      return new TableCellGenerator(child_style, this._createStream(child_style));
    }.bind(this));
  };

  TableRowGenerator.prototype._getChildStyles = function(style_tr, stream){
    var self = this;
    var child_tags = stream.getTokens();
    var rest_measure = style_tr.contentMeasure;
    var partition = style_tr.getTablePartition();
    var part_sizes = partition? partition.getSizes({
      partitionCount:child_tags.length,
      measure:style_tr.contentMeasure
    }) : [];
    return Nehan.List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style_tr);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_tags.length - i));
      if(part_sizes.length > 0){
	measure = part_sizes[i];
      }
      rest_measure -= measure;
      default_style.floatDirection = Nehan.FloatDirections.get("start");
      default_style.initContextMeasure(measure);
      return default_style;
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return Nehan.List.filter(stream.getTokens(), function(token){
      return (token instanceof Nehan.Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowGenerator;
})();
