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
  function OutlineConverter(tree, opt){
    this.tree = tree;
    Args.update(this, opt || {});
  }

  OutlineConverter.prototype = {
    outputNode : function(){
      var ctx = new TocContext();
      return this._parseTree(this, this.createRoot(), this.tree, ctx);
    },
    _createToc : function(tree, ctx){
      return {
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
      var page_no = tree.getPageNo();
      var title = self.createTitle(tree.getTitle(), page_no, toc);
      var link = self.createLink(title, page_no, toc);
      link.onclick = function(){
	return self.onClickLink(page_no, link, toc);
      };
      li.appendChild(link);
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
    onClickLink : function(page_no, link, toc){
      return false;
    },
    createRoot: function(toc){
      return document.createElement("ol");
    },
    createChild : function(toc){
      return document.createElement("li");
    },
    createTitle : function(title, page_no, toc){
      return title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
    },
    createLink : function(title, page_no, toc){
      var link = document.createElement("a");
      link.href = "#" + page_no;
      link.innerHTML = title;
      link.className = "nehan-toc-link";
      link.id = Css.addNehanTocLinkPrefix(toc.tocId);
      return link;
    }
  };

  return OutlineConverter;
})();
