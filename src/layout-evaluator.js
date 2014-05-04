var LayoutEvaluator = (function(){
  function LayoutEvaluator(){}

  var __add_event = (function(){
    if(document.addEventListener){
      return function(node, type, handler){
	node.addEventListener(type, handler, false);
      };
    } else if(document.attachEvent){
      return function(node, type, handler){
	node.attachEvent('on' + type, function(evt){
          handler.call(node, evt);
	});
      };
    }
  })();

  LayoutEvaluator.prototype = {
    _createElement : function(name, opt){
      var opt = opt || {};
      var styles = opt.styles || {};
      var attrs = opt.attrs? opt.attrs.attrs : {};
      var dataset = opt.attrs? opt.attrs.dataset : {};
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

      // font-family -> fontFamily(use camel case by default)
      // float -> cssFloat(special case)
      Obj.iter(styles, function(style_name, value){
	if(style_name === "float"){
	  dom.style.cssFloat = value;
	} else {
	  dom.style[Utils.camelize(style_name)] = value;
	}
      });

      // notice that class(className in style object) is given by variable "Box::classes".
      // why? because
      // 1. markup of anonymous line is shared by parent block, but both are given different class names.
      // 2. sometimes we add some special class name like "nehan-div", "nehan-body", "nehan-p"... etc.
      Obj.iter(attrs, function(attr_name, value){ // pure attributes(without dataset defined in TagAttrs::attrs)
	if(attr_name !== "class"){ // "class" attribute is already set by opt.className
	  dom[attr_name] = value;
	}
      });

      // dataset attributes(defined in TagAttrs::dataset)
      Args.copy(dom.dataset, dataset);

      Obj.iter(events, function(event_name, fn){
	__add_event(dom, event_name, function(e){
	  return fn(e || event);
	});
      });
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
      var elements = List.filter(opt.elements || tree.elements, function(element){ return element !== null; });
      var root = opt.root || this.evalTreeRoot(tree, opt);
      return root.innerHTML? root : List.fold(elements, root, function(ret, child){
	root.appendChild(self.evalTreeChild(tree, child));
	if(child.withBr){ // annotated to add extra br element
	  root.appendChild(document.createElement("br"));
	}
	if(child.withClearFix){ // annotated to add extra clear fix element
	  root.appendChild(self._createClearFix());
	}
	return root;
      });
    },
    evalTreeRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	className:tree.getClassName(),
	attrs:tree.getAttrs(),
	events:tree.getEvents(),
	content:(opt.content || tree.getContent()),
	styles:(opt.css || tree.getCssRoot())
      });
    },
    evalTreeChild : function(parent, child){
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
	return this.evalImage(element);
      case "a":
	return this.evalLink(element);
      default:
	return this.evaluate(element);
      }
    },
    evalInlineChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this.evalInlineImage(parent, element);
      case "a":
	return this.evalLink(element);
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
    evalImage : function(image){
      return this.evalTreeRoot(image, {name:"img"});
    },
    evalInlineImage : function(line, image){
      return this.evalImage(image);
    },
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    evalLink : function(link){
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      if(anchor_name){
	var page_no = DocumentContext.getAnchorPageNo(anchor_name);
	link.classes.push("nehan-anchor-link");
	link.style.markup.setAttr("data-page", page_no);
      }
      return this.evalTree(link, {name:"a"});
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

