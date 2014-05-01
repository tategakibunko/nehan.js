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
      if(opt.content){
	dom.innerHTML = opt.content;
      }
      for(var prop in css){
	dom.style[Utils.camelize(prop)] = css[prop];
      }
      for(var name in dataset){
	dom.dataset[Utils.camelize(name)] = dataset[name];
      }
      for(var attr_name in attr){
	dom[attr_name] = attr[attr_name];
      }
      return dom;
    },
    _createClearFix : function(){
      return this._createElement("div", {
	css:{clear:"both"}
      });
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
	return this.evalTreeWrap(tree, tree.getCssBlock());
      case "inline": return this.evalTreeWrap(tree, tree.getCssInline());
      case "inline-block": return this.evalTreeWrap(tree, tree.getCssInlineBlock());
      default: return "";
      }
    },
    evalTreeWrap : function(tree, css, tag_name){
      var div = this._createElement(tag_name || "div", {
	content:(tree.pastedContent || null),
	className:tree.classes.join(" "),
	css:css,
	dataset:tree.getDatasetAttr()
      });
      if(tree.pastedContent){
	return div;
      }
      return this.evalTree(div, tree, tree.elements);
    },
    evalTree : function(dom, tree, childs){
      var self = this;
      return List.fold(childs, dom, function(ret, child){
	dom.appendChild(self.evalTreeChild(tree, child));
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
	default: return this.evalChildInlineTreeWrap(element, element.getCssInline());
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
      var page_no = anchor_name? DocumentContext.getAnchorPageNo(anchor_name) : null;
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
      return this.evalTree(dom, link, link.elements);
    },
    evalImageBody : function(image, css){
      return this._createElement("img", {
	css:css,
	className:image.classes.join(" "),
	dataset:image.getDatasetAttr(),
	attr:{
	  src:image.style.getMarkupAttr("src"),
	  title:(image.style.getMarkupAttr("title") || "no title")
	}
      });
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

