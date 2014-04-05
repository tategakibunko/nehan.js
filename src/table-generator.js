// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
// init : create partition map
var TableGenerator = (function(){
  function TableGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGenerator, BlockGenerator);

  TableGenerator.prototype.yield = function(context){
  };

  TableGenerator.prototype._getTableGroupTags = function(context){
  };

  return TableGenerator;
})();

// parent : table
// tag : thead | tbody | tfoot
// stream : [tr]
// yield : [tr]
var TableGroupLayoutGenerator = (function(){
  function TableGroupLayoutGenerator(style, stream){
    BlockGenerator.call(this, style, stream);
  }
  Class.extend(TableGroupLayoutGenerator, BlockGenerator);

  TableGroupLayoutGenerator.prototype.yield = function(context){
  };

  TableGroupLayoutGenerator.prototype._getRowTags = function(context){
    return this.stream.getWhile(function(token){
      return (token instanceof Tag && token.getName() === "tr");
    });
  };

  return TableGroupLayoutGenerator;
})();

