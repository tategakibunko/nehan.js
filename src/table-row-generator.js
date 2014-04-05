// parent : thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  function TableRowGenerator(style, stream, context){
    var generators = this._getGenerators(style, stream, context);
    ParallelGenerator.call(this, style, generators);
  }
  Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style, stream, context){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(context, style, child_tags);
    return List.map(child_styles, function(style){
      return new BlockGenerator(style, new TokenStream(style.getMarkupContent()));
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(context, parent_style, child_tags){
    var child_count = child_tags.length;
    var rest_extent = context.getBlockRestExtent();
    var rest_measure = context.getInlineMaxMeasure();
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, parent_style);
      var static_measure = default_style.getStaticMeasure();
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_count - i));
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure,
	"extent":rest_extent
      });
    });
  };

  TableRowGenerator.prototype._getChildTags = function(stream){
    return stream.getWhile(function(token){
      return (token instanceof Tag && (token.getName() === "td" || token.getName() === "th"));
    });
  };

  return TableRowGenerator;
})();
