var LayoutEvaluator = (function(){
  /**
     @memberof Nehan
     @class LayoutEvaluator
     @classdesc evaluate {@link Nehan.Box}, and output DOMElement.
     @constructor
     @param direction {String} - "hori" or "vert"
  */
  function LayoutEvaluator(direction){
    this.direction = direction;
  }

  LayoutEvaluator.prototype = {
    /**
       @memberof Nehan.LayoutEvaluator
       @param tree {Nehan.Box}
       @return {DOMElement}
    */
    evaluate : function(tree){
      return this._getEvaluator(tree)._evaluate(tree);
    },
    _getEvaluator : function(tree){
      var is_vert = tree.style.isTextVertical();
      if(this.direction === "vert" && !is_vert){
	return new HoriEvaluator();
      }
      if(this.direction === "hori" && is_vert){
	return new VertEvaluator();
      }
      return this;
    },
    _createElement : function(name, opt){
      opt = opt || {};
      var css = opt.css || {};
      var attrs = opt.attrs? ((opt.attrs instanceof TagAttrs)? opt.attrs.attrs : opt.attrs) : {};
      var dataset = opt.attrs? opt.attrs.dataset : {};
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
      if(typeof opt.rootBlockId !== "undefined"){
	dataset["rootBlockId"] = opt.rootBlockId;
      }
      if(typeof opt.blockId !== "undefined"){
	dataset["blockId"] = opt.blockId;
      }

      // store css value to dom.style[<camelized-css-property>]
      Obj.iter(css, function(style_name, value){
	dom.style[Utils.camelize(style_name)] = value;
      });

      // notice that class(className in style object) is given by variable "Box::classes".
      // why? because
      // 1. markup of anonymous line is shared by parent block, but both are given different class names.
      // 2. sometimes we add some special class name like "nehan-div", "nehan-body", "nehan-p"... etc.
      Obj.iter(attrs, function(attr_name, value){ // pure attributes(without dataset defined in TagAttrs::attrs)
	// "style" is readonly and "class" is already set by opt.className.
	if(attr_name !== "style" && attr_name !== "class"){
	  try {
	    dom[attr_name] = value;
	  } catch(e){
	    console.error("try to set %o to %s but failed.", value, attr_name);
	  }
	}
      });

      // dataset attributes(defined in TagAttrs::dataset)
      Args.copy(dom.dataset, dataset);

      // call oncreate callback if exists.
      if(opt.oncreate){
	opt.oncreate(dom, opt.styleContext || null);
      }
      return dom;
    },
    _createClearFix : function(clear){
      var div = document.createElement("div");
      div.style.clear = clear || "both";
      return div;
    },
    _appendChild : function(root, child){
      if(child instanceof Array){
	List.iter(child, function(child){
	  this._appendChild(root, child);
	}.bind(this));
      } else {
	root.appendChild(child);
      }
    },
    _evaluate : function(tree, opt){
      opt = opt || {};
      var elements = List.filter(tree.elements, function(element){ return element !== null; });
      var root = this._evalTreeRoot(tree, opt);
      return root.innerHTML? root : List.fold(elements, root, function(ret, child){
	this._appendChild(root, this._evalTreeChild(tree, child));
	if(child.withBr){ // annotated to add extra br element
	  this._appendChild(root, document.createElement("br"));
	}
	if(child.withClearFix){ // annotated to add extra clear fix element
	  this._appendChild(root, this._createClearFix());
	}
	return root;
      }.bind(this));
    },
    _evalTreeRoot : function(tree, opt){
      opt = opt || {};
      return this._createElement(opt.name || "div", {
	id:tree.getId(),
	className:tree.getClassName(),
	attrs:tree.getAttrs(),
	oncreate:tree.getOnCreate(),
	content:(opt.content || tree.getContent()),
	rootBlockId:tree.rootBlockId,
	blockId:tree.blockId,
	css:(opt.css || tree.getCssRoot()),
	styleContext:tree.style
      });
    },
    _evalTreeChild : function(parent, child){
      switch(parent.display){
      case "inline":
	if(child instanceof Box){
	  return this._evalInlineChildElement(parent, child);
	}
	return this._evalInlineChildText(parent, child);
      default:
	return this._evalBlockChildElement(parent, child);
      }
    },
    _evalBlockChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this._evalImage(element);
      case "a":
	return this._evalLink(element);
      default:
	return this.evaluate(element);
      }
    },
    _evalInlineChildElement : function(parent, element){
      switch(element.style.getMarkupName()){
      case "img":
	return this._evalInlineImage(parent, element);
      case "a":
	return this._evalLink(element);
      default:
	return this._evalInlineChildTree(element);
      }
    },
    _evalInlineChildText : function(parent, element){
      if(parent.style.isTextEmphaEnable() && Token.isEmphaTargetable(element)){
	return this._evalEmpha(parent, element);
      }
      return this._evalTextElement(parent, element);
    },
    _evalImage : function(image){
      return this._evalTreeRoot(image, {name:"img"});
    },
    _evalInlineImage : function(line, image){
      return this._evalImage(image);
    },
    // if link uri has anchor address, add page-no to dataset where the anchor is defined.
    _evalLink : function(link){
      var uri = new Uri(link.style.getMarkupAttr("href"));
      var anchor_name = uri.getAnchorName();
      if(anchor_name){
	var page_no = DocumentContext.getAnchorPageNo(anchor_name);
	link.classes.push("nehan-anchor-link");
	link.style.markup.setAttr("data-page", page_no);
      }
      return this._evaluate(link, {name:"a"});
    },
    _evalTextElement : function(line, text){
      switch(text._type){
      case "word":
	return this._evalWord(line, text);
      case "char":
	return this._evalChar(line, text);
      case "tcy":
	return this._evalTcy(line, text);
      case "ruby":
	return this._evalRuby(line, text);
      default:
	console.error("invalid text element:%o", text);
	throw "invalid text element"; 
      }
    }
  };

  return LayoutEvaluator;
})();

