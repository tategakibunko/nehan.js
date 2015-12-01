// parent : table | thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
Nehan.TableRowGenerator = (function(){
  /**
   @memberof Nehan
   @class TableRowGenerator
   @classdesc generator of table row(TR) content.
   @constructor
   @extends {Nehan.ParallelGenerator}
   @param context {Nehan.RenderingContext}
  */
  function TableRowGenerator(context){
    Nehan.ParallelGenerator.call(this, context);
  }
  Nehan.Class.extend(TableRowGenerator, Nehan.ParallelGenerator);

  TableRowGenerator.prototype._createChildGenerators = function(context){
    var child_styles = this._getChildStyles(context);
    return child_styles.map(function(child_style){
      return context.createChildBlockGenerator(child_style);
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(context){
    var self = this;
    var partition = context.parent.tablePartition;
    var stream = context.stream;
    var child_tags = stream.getTokens();
    var rest_measure = context.style.contentMeasure;
    var part_sizes = partition? partition.getSizes({
      partitionCount:child_tags.length,
      measure:context.style.contentMeasure
    }) : [];
    return child_tags.map(function(cell_tag, i){
      var default_style = context.createChildStyle(cell_tag);
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
    return stream.getTokens().filter(Nehan.Closure.isTagName(["td", "th"]));
  };

  return TableRowGenerator;
})();
