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

var OutlineContextConverter = (function(){
  function OutlineContextConverter(){}

  // outline_context -> dom node
  OutlineContextConverter.prototype.convert = function(outline_context){
    var root_node = this.createRoot();
    var outline_tree = OutlineContextParser.parse(outline_context);
    return this._parse(root_node, outline_tree);
  };
  
  OutlineContextConverter.prototype._parse = function(parent, tree){
    if(tree === null){
      return parent;
    }
    var toc = this.createToc(tree);
    var li = this.createChild(toc);
    var link = this.createLink(toc);
    if(link){
      link.onclick = this.createOnClickLink(toc);
      li.appendChild(link);
    }
    var page_no_item = this.createPageNoItem(toc);
    if(page_no_item){
      li.appendChild(page_no_item);
    }
    parent.appendChild(li);

    var child = tree.getChild();
    if(child){
      var child_toc = this.createToc(child);
      var ol = this.createRoot(child_toc);
      this._parse(ol, child);
      li.appendChild(ol);
    }
    var next = tree.getNext();
    if(next){
      this._parse(parent, next);
    }
    return parent;
  };

  OutlineContextConverter.prototype.createOnClickLink = function(toc){
    return function(){
      return false;
    }
  };

  OutlineContextConverter.prototype.createToc = function(tree){
    return {
      title:tree.getTitle(),
      pageNo:tree.getPageNo(),
      headerId:tree.getHeaderId()
    };
  };

  OutlineContextConverter.prototype.createRoot = function(toc){
    var root = document.createElement("ol");
    root.className = "nehan-toc-root";
    return root;
  };

  OutlineContextConverter.prototype.createChild = function(toc){
    var li = document.createElement("li");
    li.className = "nehan-toc-item";
    return li;
  };

  OutlineContextConverter.prototype.createLink = function(toc){
    var link = document.createElement("a");
    var title = toc.title.replace(/<a[^>]+>/gi, "").replace(/<\/a>/gi, "");
    link.href = "#" + toc.pageNo;
    link.innerHTML = title;
    link.className = "nehan-toc-link";
    link.id = Css.addNehanTocLinkPrefix(toc.tocId);
    return link;
  };

  OutlineContextConverter.prototype.createPageNoItem = function(toc){
    return null;
  };

  return OutlineContextConverter;
})();
