/*
var TableRowGenerator = ParallelGenerator.extend({
  init : function(markup, context){
    var partition = parent.partition.getPartition(markup.tableChilds.length);
    var generators = List.map(markup.tableChilds, function(td){
      return new ParaChildGenerator(td, context);
    });
    this._super(generators, markup, context, partition);
  }
});
*/