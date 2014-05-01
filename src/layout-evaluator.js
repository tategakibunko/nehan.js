var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  LayoutEvaluator.prototype = {
    _createElement : function(name, opt){
      var opt = opt || {};
      var dom = document.createElement(name);
      var css = opt.css || {};
      var dataset = opt.dataset || {};
      var attr = opt.attr || {};
      if(opt.className){
	dom.className = opt.className;
      }
      for(var prop in css){
	dom.style[Utils.getCamelName(prop)] = css[prop];
      }
      for(var name in dataset){
	dom.dataset[Utils.getCamelName(name)] = dataset[name];
      }
      for(var attr_name in attr){
	dom[attr_name] = attr[attr_name];
      }
      return dom;
    },
    evaluate : function(tree){
      if(this.isFlipTree(tree)){
	return this.evalFlip(tree);
      }
      // caution: not tree.style.display but tree.display
      switch(tree.display){
      case "block":
	if(tree.style && tree.style.getMarkupName() === "img"){
	  return this.evalBlockImage(tree);
	}
	return this.evalTreeRoot(tree, tree.getCssBlock());
      case "inline": return this.evalTreeRoot(tree, tree.getCssInline());
      case "inline-block": return this.evalTreeRoot(tree, tree.getCssInlineBlock());
      default: return "";
      }
    },
    evalTreeRoot : function(tree, css){
      var div = this._createElement("div", {
	className:tree.classes.join(" "),
	css:css,
	dataset:tree.getDatasetAttr()
      });
      if(tree.pastedContent){
	div.innerHTML = tree.pastedContent;
	return div;
      }
      return this.evalTreeChildren(div, tree);
    },
    evalTreeChildren : function(dom, tree){
      var self = this;
      return List.fold(tree.elements, dom, function(_dom, element){
	dom.appendChild(self.evalTreeChild(tree, element));
	return dom;
      });
    },
    evalTreeChild : function(parent, child){
      if(parent.display === "inline"){
	return this.evalInlineElement(parent, child);
      }
      return this.evaluate(child);
    },
    evalInlineElement : function(line, element){
      if(element instanceof Box){
	switch(element.style.getMarkupName()){
	case "img": return this.evalInlineImage(line, element);
	case "a": return this.evalLink(line, element);
	default: return this.evalTreeRoot(element, element.getCssInline());
	}
      }
      var text = this.evalTextElement(line, element);
      if(line.style.isTextEmphaEnable()){
	return this.evalEmpha(line, element, text);
      }
      return text;
    },
    // if link title is not defined, summary of link content is used.
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    evalLink : function(line, link){
      var self = this;
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      console.log("anchor_name:%s", anchor_name);
      var page_no = anchor_name? DocumentContext.getAnchorPageNo(anchor_name) : null;
      console.log("ancho page no:%o", page_no);
      if(page_no !== null){
	link.setDataset("page", page_no);
      }
      var dom = this._createElement("a", {
	className:link.classes.join(" "),
	dataset:link.getDatasetAttr(),
	attr:{
	  href:uri.getAddress(),
	  title:link.style.getMarkupAttr("title", "no title")
	}
      });
      return this.evalTreeChildren(dom, link);
    },
    evalTextElement : function(line, text){
      switch(text._type){
      case "word": return this.evalWord(line, text);
      case "char": return this.evalChar(line, text);
      case "tcy": return this.evalTcy(line, text);
      case "ruby": return this.evalRuby(line, text);
      default: return "";
      }
    }
  };

  return LayoutEvaluator;
})();

