var ParallelGenerator = ChildBlockTreeGenerator.extend({
  init : function(generators, markup, context, partition){
    this.generators = generators;
    this.markup = markup;
    this.context = context;
    this.partition = partition;
    this.context.pushBlockTag(this.markup);
    this._inheritParent();
  },
  _inheritParent : function(){
    var parent_markup = this.markup;
    List.iter(this.generators, function(gen){
      if(gen.markup){
	gen.markup.inherit(parent_markup);
      }
    });
  },
  hasNext : function(){
    return List.exists(this.generators, function(generator){
      return generator.hasNext();
    });
  },
  backup : function(){
    List.iter(this.generators, function(generator){
      generator.backup();
    });
  },
  rollback : function(){
    List.iter(this.generators, function(generator){
      generator.rollback();
    });
  },
  yield : function(parent){
    this.backup();
    var wrap_size = parent.getRestSize();
    var wrap_page = this._createBox(wrap_size, parent);
    var wrap_flow = parent.getParallelFlow();
    wrap_page.setFlow(wrap_flow);
    return this._yieldChilds(wrap_page, parent);
  },
  _setBoxEdge : function(box, edge){
    // ignore edge
    // because each edge of child layout are set by child-generators.
  },
  _getChildMeasure : function(index){
    return this.partition.getSize(index);
  },
  _getChildExtent : function(parent){
    return parent.getRestContentExtent();
  },
  _yieldChilds : function(wrap_page, parent){
    var self = this, valid = false;
    var child_flow = parent.flow;
    var is_valid = function(page){
      return page && page.getContentExtent;
    };
    var child_pages = List.mapi(this.generators, function(index, generator){
      var child_measure = self._getChildMeasure(index);
      var child_extent = self._getChildExtent(parent);
      var child_size = child_flow.getBoxSize(child_measure, child_extent);
      return generator.yield(wrap_page, child_size);
    });

    if(!List.exists(child_pages, is_valid)){
      return Exceptions.RETRY;
    }
      
    var max_child = List.maxobj(child_pages, function(child_page){
      if(child_page && child_page.getContentExtent){
	return child_page.getContentExtent();
      }
      return 0;
    });
    var max_content_extent = max_child.getContentExtent();
    var max_box_extent = max_child.getBoxExtent();

    wrap_page.setContentExtent(parent.flow, max_box_extent);
    
    // resize each child by uniform extent size.
    List.iter(child_pages, function(child_page){
      if(child_page){
	child_page.setContentExtent(child_flow, max_content_extent);
	wrap_page.addChildBlock(child_page);
      }
    });
    return wrap_page;
  }
});
