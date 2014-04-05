/*
  outline mapping
  ===============

  <ol>
    <li> root.title
      <ol>
        <li> root.child.title  </li>
	<li> root.child.next.title </li>
      </ol>
    </li>

    <li> root.next.title
      <ol>
        <li> root.next.child.title </li>
	<li> root.next.child.next.title </li>
      </ol>
   </li>
  </ol>
*/

var OutlineConverter = (function(){
  var __opt__ = {};
  var parse = function(parent, tree, ctx){
    if(tree === null){
      return parent;
    }
    var toc = create_toc(tree, ctx);
    var li = create_child(toc);
    var link = create_link(toc);
    if(link){
      link.onclick = function(){
	return on_click_link(toc);
      };
      li.appendChild(link);
    }
    var page_no_item = create_page_no_item(toc);
    if(page_no_item){
      li.appendChild(page_no_item);
    }
    parent.appendChild(li);

    var child = tree.getChild();
    if(child){
      ctx = ctx.startRoot();
      var child_toc = create_toc(child, ctx);
      var ol = create_root(child_toc);
      arguments.callee(ol, child, ctx);
      li.appendChild(ol);
      ctx = ctx.endRoot();
    }
    var next = tree.getNext();
    if(next){
      arguments.callee(parent, next, ctx.stepNext());
    }
    return parent;
  };

  var on_click_link = function(toc){
    return false;
  };

  var create_toc = function(tree, ctx){
    return {
      title:tree.getTitle(),
      pageNo:tree.getPageNo(),
      tocId:ctx.getTocId(),
      headerId:tree.getHeaderId()
    };
  };

  var create_root = function(toc){
    var root = document.createElement("ol");
    root.className = "nehan-toc-root";
    return root;
  };

  var create_child = function(toc){
    var li = document.createElement("li");
    li.className = "nehan-toc-item";
    return li;
  };

  var create_link = function(toc){
    var link = document.createElement("a");
    var title = toc.title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
    link.href = "#" + toc.pageNo;
    link.innerHTML = title;
    link.className = "nehan-toc-link";
    link.id = Css.addNehanTocLinkPrefix(toc.tocId);
    return link;
  };

  var create_page_no_item = function(toc){
    return null;
  };

  return {
    convert : function(tree, opt){
      __opt__ = opt || {};
      var root = create_root();
      var context = new TocContext();
      return parse(root, tree, context);
    }
  };
})();

/*
var OutlineConverter = (function(){
  function OutlineConverter(tree, opt){
    this.tree = tree;
    Args.copy(this, opt || {});
  }

  OutlineConverter.prototype = {
    outputNode : function(){
      var ctx = new TocContext();
      return this._parseTree(this, this.createRoot(), this.tree, ctx);
    },
    _createToc : function(tree, ctx){
      return {
	title:tree.getTitle(),
	pageNo:tree.getPageNo(),
	tocId:ctx.getTocId(),
	headerId:tree.getHeaderId()
      };
    },
    _parseTree : function(self, parent, tree, ctx){
      if(tree === null){
	return parent;
      }
      var toc = self._createToc(tree, ctx);
      var li = self.createChild(toc);
      var link = self.createLink(toc);
      if(link){
	link.onclick = function(){
	  return self.onClickLink(toc);
	};
	li.appendChild(link);
      }
      var page_no_item = self.createPageNoItem(toc);
      if(page_no_item){
	li.appendChild(page_no_item);
      }
      parent.appendChild(li);

      var child = tree.getChild();
      if(child){
	ctx = ctx.startRoot();
	var child_toc = self._createToc(child, ctx);
	var ol = self.createRoot(child_toc);
	arguments.callee(self, ol, child, ctx);
	li.appendChild(ol);
	ctx = ctx.endRoot();
      }
      var next = tree.getNext();
      if(next){
	arguments.callee(self, parent, next, ctx.stepNext());
      }
      return parent;
    },
    onClickLink : function(toc){
      return false;
    },
    createRoot: function(toc){
      var root = document.createElement("ol");
      root.className = "nehan-toc-root";
      return root;
    },
    createChild : function(toc){
      var li = document.createElement("li");
      li.className = "nehan-toc-item";
      return li;
    },
    createLink : function(toc){
      var link = document.createElement("a");
      var title = toc.title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
      link.href = "#" + toc.pageNo;
      link.innerHTML = title;
      link.className = "nehan-toc-link";
      link.id = Css.addNehanTocLinkPrefix(toc.tocId);
      return link;
    },
    createPageNoItem : function(toc){
      return null;
    }
  };

  return OutlineConverter;
})();
*/
