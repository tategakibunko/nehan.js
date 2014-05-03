var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  LayoutEvaluator.prototype = {
    _createElement : function(name, opt){
      var opt = opt || {};
      var styles = opt.styles || {};
      var attrs = opt.attrs || {};
      var events = opt.events || {};
      var dom = document.createElement(name);
      if(opt.id){
	dom.id = opt.id;
      }
      if(opt.className){
	dom.className = opt.className;
      }
      if(opt.content){
	dom.innerHTML = opt.content;
      }
      for(var style_name in styles){
	if(style_name === "float"){
	  dom.style.cssFloat = styles[style_name];
	} else {
	  dom.style[Utils.camelize(style_name)] = styles[style_name];
	}
      }
      for(var attr_name in attrs){
	if(attr_name.indexOf("data-") >= 0){
	  var camel_name = Utils.camelize(attr_name.slice(5));
	  dom.dataset[camel_name] = attrs[attr_name];
	} else {
	  dom[attr_name] = attrs[attr_name];
	}
      }
      for(var event_name in events){
	if(typeof events[event_name] === "function"){
	  dom[event_name] = events[event_name];
	}
      }
      return dom;
    },
    _createClearFix : function(clear){
      var div = document.createElement("div");
      div.style.clear = clear || "both";
      return div;
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
      var root = opt.root || this.evalTreeRoot(tree, opt);
      return root.innerHTML? root : List.fold(elements, root, function(ret, child){
	root.appendChild(self.evalChildElement(tree, child));
	var extra = self.evalExtraElement(child);
	if(extra){
	  root.appendChild(extra);
	}
	return root;
      });
    },
    evalTreeRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	id:tree.getId(),
	className:tree.getClassName(),
	attrs:tree.getAttrs(),
	events:tree.getEvents(),
	content:(opt.content || tree.getContent()),
	styles:(opt.css || tree.getCssRoot())
      });
    },
    // eval extra element if exists,
    // mainly used to add <br> element after single character in vertical-mode,
    // or append clear-fix in other case.
    evalExtraElement : function(element){
      if(element.withBr){
	return document.createElement("br");
      }
      if(element.withClearFix){
	return this._createClearFix();
      }
      return null;
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
	link.setAttr("data-page", DocumentContext.getAnchorPageNo(uri.getAnchorName()));
      }
      return this.evalTree(link, {name:"a"});
    },
    evalImageBody : function(image, styles){
      return this.evalTreeRoot(image, {name:"img", styles:styles});
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

