// tag : table
// stream : [thead | tbody | tfoot]
// yield : [thead | tbody | tfoot]
// init : create partition map
var TableLayoutGenerator = (function(){
  function TableLayoutGenerator(style, stream){
    BlockLayoutGenerator.call(this, style, stream);
  }
  Class.extend(TableLayoutGenerator, BlockLayoutGenerator);

  TableLayoutGenerator.prototype.yield = function(context){
  };

  TableLayoutGenerator.prototype._getTableGroupTags = function(context){
  };

  return TableLayoutGenerator;
})();

// parent : table
// tag : thead | tbody | tfoot
// stream : [tr]
// yield : [tr]
var TableGroupLayoutGenerator = (function(){
  function TableGroupLayoutGenerator(style, stream){
    BlockLayoutGenerator.call(this, style, stream);
  }
  Class.extend(TableGroupLayoutGenerator, BlockLayoutGenerator);

  TableGroupLayoutGenerator.prototype.yield = function(context){
  };

  TableGroupLayoutGenerator.prototype._getRowTags = function(context){
    return this.stream.getWhile(function(token){
      return (token instanceof Tag && token.getName() === "tr");
    });
  };

  return TableGroupLayoutGenerator;
})();

