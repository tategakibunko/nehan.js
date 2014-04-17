// parent : thead | tbody | tfoot
// tag : tr | th
// stream : [td | th]
// yield : parallel([td | th])
var TableRowGenerator = (function(){
  function TableRowGenerator(style, stream, outline_context){
    var generators = this._getGenerators(style, stream, outline_context);
    ParallelGenerator.call(this, style, generators);
  }
  Class.extend(TableRowGenerator, ParallelGenerator);

  TableRowGenerator.prototype._getGenerators = function(style, stream, outline_context){
    var child_tags = this._getChildTags(stream);
    var child_styles = this._getChildStyles(style, child_tags);
    return List.map(child_styles, function(child_style){
      return new TableCellGenerator(child_style, new TokenStream(child_style.getMarkupContent()), outline_context);
    });
  };

  TableRowGenerator.prototype._getChildStyles = function(style, child_tags){
    var self = this;
    var child_count = child_tags.length;
    var rest_measure = style.contentMeasure;
    return List.mapi(child_tags, function(i, tag){
      var default_style = new StyleContext(tag, style);
      var static_measure = default_style.staticMeasure;
      var measure = (static_measure && rest_measure >= static_measure)? static_measure : Math.floor(rest_measure / (child_count - i));
      rest_measure -= measure;
      return default_style.clone({
	"float":"start",
	"measure":measure
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
