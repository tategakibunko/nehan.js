// parallel generator is proxy of multiple generators.
var ParallelGenerator = ChildBlockTreeGenerator.extend({
  init : function(generators, partition, context){
    this._super(context);
    this.generators = generators;
    this.partition = partition;
  },
  hasNext : function(){
    return List.exists(this.generators, function(generator){
      return generator.hasNext();
    });
  },
  yield : function(parent){
    var wrap_size = parent.getRestSize();
    var wrap_page = this._createBox(wrap_size, parent);
    var wrap_flow = parent.getParallelFlow();
    var child_flow = parent.flow;
    wrap_page.setFlow(wrap_flow);
    return this._yieldChildsTo(wrap_page, child_flow, this.partition);
  },
  _yieldChildsTo : function(wrap_page, child_flow, partition){
    var child_extent = wrap_page.getRestContentExtent();
    var child_pages = List.mapi(this.generators, function(index, generator){
      var child_measure = partition.getSize(index);
      var child_size = child_flow.getBoxSize(child_measure, child_extent);
      var element = generator.yield(wrap_page, child_size);
      if(element.breakBefore){
	wrap_page.breakAfter = true;
	return null;
      }
      if(element.breakAfter){
	wrap_page.breakAfter = true;
      }
      return element;
    });
    var max_child = List.maxobj(child_pages, function(child_page){
      return (child_page instanceof Box)? child_page.getContentExtent() : 0;
    });
    var max_content_extent = max_child? max_child.getContentExtent() : 0;
    var max_box_extent = max_child? max_child.getBoxExtent() : 0;

    wrap_page.setContentExtent(child_flow, max_box_extent);
    
    // resize each child by uniform extent size.
    List.iter(child_pages, function(child_page){
      if(child_page && child_page instanceof Box){
	child_page.setContentExtent(child_flow, max_content_extent);
	wrap_page.addParaChildBlock(child_page);
      }
    });
    return wrap_page;
  }
});
