var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  LayoutEvaluator.prototype = {
    _createElement : function(name, opt){
      var opt = opt || {};
      var css = opt.css || {};
      var dataset = opt.dataset || {};
      var attr = opt.attr || {};
      var events = opt.events || {};
      var dom = document.createElement(name);
      if(opt.className){
	dom.className = opt.className;
      }
      if(opt.content){
	dom.innerHTML = opt.content;
      }
      for(var css_prop in css){
	if(css_prop === "float"){
	  dom.style.cssFloat = css[css_prop];
	} else {
	  dom.style[Utils.camelize(css_prop)] = css[css_prop];
	}
      }
      for(var data_name in dataset){
	dom.dataset[Utils.camelize(data_name)] = dataset[data_name];
      }
      for(var attr_name in attr){
	dom[attr_name] = attr[attr_name];
      }
      for(var event_name in events){
	if(typeof events[event_name] === "function"){
	  dom[event_name] = events[event_name];
	}
      }
      return dom;
    },
    _createElementRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	events:(opt.events || tree.getEvents()),
	content:(opt.content || tree.pastedContent || null),
	className:(opt.className || tree.classes.join(" ")),
	attr:(opt.attr || {}),
	css:(opt.css || tree.getCssRoot()),
	dataset:(opt.dataset || tree.getDatasetAttr())
      });
    },
    evaluate : function(tree){
      if(this.isFlipTree(tree)){
	return this.evalFlip(tree);
      }
      return this.evalTree(tree);
    },
    evalTree : function(tree, opt){
      opt = opt || {};
      var self = this;
      var elements = opt.elements || tree.elements;
      var root = opt.root || this._createElementRoot(tree, opt);
      return tree.pastedContent? root : List.fold(elements, root, function(ret, child){
	root.appendChild(self.evalChildElement(tree, child));
	self._appendExtraElementFor(root, child);
	return root;
      });
    },
    _appendExtraElementFor : function(element){
      // do nothing except vert-evaluator for normal text element.
    },
    evalChildElement : function(parent, child){
      switch(parent.display){
      case "inline":
	if(child instanceof Box){
	  return this.evalInlineChildElement(parent, child);
	}
	return this.evalInlineChildText(parent, child);
      default:
	return this.evalBlockChildElement(parent, child);
      }
    },
    evalBlockChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this.evalBlockImage(element);
      default:
	return this.evaluate(element);
      }
    },
    evalInlineChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this.evalInlineImage(parent, element);
      case "a":
	return this.evalLink(parent, element);
      default:
	return this.evalInlineChildTree(element);
      }
    },
    evalInlineChildText : function(parent, element){
      if(parent.style.isTextEmphaEnable()){
	return this.evalEmpha(parent, element);
      }
      return this.evalTextElement(parent, element);
    },
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    evalLink : function(parent, link){
      var uri = new Uri(link.style.getMarkupAttr("href"));
      if(uri.hasAnchorName()){
	link.setDataset("page", DocumentContext.getAnchorPageNo(uri.getAnchorName()));
      }
      return this.evalTree(link, {
	name:"a",
	attr:{
	  href:uri.getAddress(),
	  title:link.style.getMarkupAttr("title", "no title")
	}
      });
    },
    evalImageBody : function(image, css){
      return this._createElement("img", {
	css:css,
	className:image.classes.join(" "),
	dataset:image.getDatasetAttr(),
	events:image.getEvents(),
	attr:{
	  src:image.style.getMarkupAttr("src"),
	  title:(image.style.getMarkupAttr("title") || "no title")
	}
      });
    },
    evalTextElement : function(line, text){
      switch(text._type){
      case "word":
	return this.evalWord(line, text);
      case "char":
	return this.evalChar(line, text);
      case "tcy":
	return this.evalTcy(line, text);
      case "ruby":
	return this.evalRuby(line, text);
      default:
	console.error("invalid text element:%o", text);
	throw "invalid text element"; 
      }
    }
  };

  return LayoutEvaluator;
})();

