// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
var TableGenerator = (function(){
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGenerator, BlockGenerator);

/*
  TableGenerator.prototype.yield = function(context){
  };

  TableGenerator.prototype._getTableGroupTags = function(context){
    return this.stream.getWhile(function(token){
      if(token instanceof Tag){
	var name = token.getName();
	return (name === "thead" || name === "tbody" || name === "tfoot" || name === "caption" || name === "tr");
      }
      return false;
    });
  };
*/

  return TableGenerator;
})();

