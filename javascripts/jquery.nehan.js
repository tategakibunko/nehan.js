/*
 jquery.nehan.js
 Copyright (C) 2013 Watanabe Masaki<lambda.watanabe[at]gmail.com>

 licensed under MIT license.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/

;(function(){

var Template = (function(){
  function Template(src, values){
    this.src = src;
    this.values = values || {};
  }

  Template.prototype = {
    clearValues : function(){
      for(var prop in this.values){
	this.values[prop] = "";
      }
    },
    setValue : function(name, value){
      this.values[name] = value;
    },
    render : function(){
      var ret = this.src;
      for(var prop in this.values){
	var val = this.values[prop];
	var regexp = new RegExp("\\{\\{" + prop + "\\}\\}", "g");
	ret = ret.replace(regexp, val);
      }
      return ret;
    }
  };

  return Template;
})();

var Themes = {
  // |-----------|
  // |           |
  // |  screen   |
  // |           |
  // |-----------|
  "1x1":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // screen
    "<div style='margin:{{space}}px'>{{0}}</div>",

    "<div class='nehan-reader-clearfix'></div>"
  ].join(""),

  // |----------------|----------------|
  // |                |                |
  // |  left          | right          |
  // |                |                |
  // |----------------|----------------|
  "1x2":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // left
    "<div class='nehan-reader-left'>",
    "<div style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px;'>",
    "{{0}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",
    "</div>", // left end


    // right
    "<div class='nehan-reader-right'>",
    "<div style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",
    "</div>", // right end

    "<div class='nehan-reader-clearfix'></div>"
  ].join(""),

  // |-----------|
  // |  upside   |
  // |-----------|
  // |  downside |
  // |-----------|
  "2x1":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-bottom:{{space}}px;'>",
    "{{0}}",
    "</div>",

    // downside
    "<div class='nehan-reader-row nehan-reader-row-bottom' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>"
  ].join(""),

  // |----------------|----------------|
  // |  left upside   | right upside   |
  // |----------------|----------------|
  // |  left downside | right downside |
  // |----------------|----------------|
  "2x2":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // left
    "<div class='nehan-reader-left'>",

    // left upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px; padding-bottom:{{space}}px'>",
    "{{2}}",
    "</div>",

    // left downside
    "<div class='nehan-reader-row' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px;'>",
    "{{3}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    "</div>", // left end

    // right
    "<div class='nehan-reader-right'>",

    // right upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px; padding-bottom:{{space}}px'>",
    "{{0}}",
    "</div>",

    // right downside
    "<div class='nehan-reader-row' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    "</div>", // right end

    "<div class='nehan-reader-clearfix'></div>"
  ].join(""),


  // |-----------|
  // |           |
  // |  screen   |
  // |           |
  // |-----------|
  // |  nombre   |
  // |-----------|
  "1x1-nombre":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // screen
    "<div style='margin:{{space}}px'>{{0}}</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{page_no}} -",
    "</div>"
  ].join(""),

  // |----------------|----------------|
  // |                |                |
  // |  left          | right          |
  // |                |                |
  // |----------------|----------------|
  // |  left nombre   | right nombre   |
  // |----------------|----------------|
  "1x2-nombre":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // left
    "<div class='nehan-reader-left'>",
    "<div style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px;'>",
    "{{0}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // left nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{left_page_no}} -",
    "</div>",
    "</div>",

    // right
    "<div class='nehan-reader-right'>",
    "<div style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // right nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{right_page_no}} -",
    "</div>",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>"
  ].join(""),

  // |-----------|
  // |  upside   |
  // |-----------|
  // |  downside |
  // |-----------|
  // |  nombre   |
  // |-----------|
  "2x1-nombre":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-bottom:{{space}}px;'>",
    "{{0}}",
    "</div>",

    // downside
    "<div class='nehan-reader-row nehan-reader-row-bottom' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{page_no}} -",
    "</div>"

  ].join(""),

  // |----------------|----------------|
  // |  left upside   | right upside   |
  // |----------------|----------------|
  // |  left downside | right downside |
  // |----------------|----------------|
  // |  left nombre   | right nombre   |
  // |----------------|----------------|
  "2x2-nombre":[
    // anchor
    "<a href='#' name='{{page_pos}}'></a>",

    // left
    "<div class='nehan-reader-left'>",

    // left upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px; padding-bottom:{{space}}px'>",
    "{{2}}",
    "</div>",

    // left downside
    "<div class='nehan-reader-row' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-left:{{space}}px; padding-right:{{space}}px;'>",
    "{{3}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // left nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{left_page_no}} -",
    "</div>",
    "</div>", // nehan-reader-left

    // right
    "<div class='nehan-reader-right'>",

    // right upside
    "<div class='nehan-reader-row nehan-reader-row-top' style='width:{{cell_width}}px; height:{{cell_height}}px; margin-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px; padding-bottom:{{space}}px'>",
    "{{0}}",
    "</div>",

    // right downside
    "<div class='nehan-reader-row' style='height:{{cell_height}}px; padding-top:{{space}}px; margin-right:{{space}}px; padding-left:{{space}}px;'>",
    "{{1}}",
    "</div>",

    "<div class='nehan-reader-clearfix'></div>",

    // right nombre
    "<div class='nehan-reader-nombre' style='height:{{font_size}}px; line-height:{{font_size}}px; margin-top:{{font_size}}px'>",
    "- {{right_page_no}} -",
    "</div>",
    "</div>", // nehan-reader-right

    "<div class='nehan-reader-clearfix'></div>"
  ].join("")
};

var Wheel = {
  makeHandler : function(dom, onUp, onDown){
    return function(event){
      var delta = 0;
      if (!event){ // IE
	event = window.event;
      }
      if (event.wheelDelta) { // IE/Opera
	delta = event.wheelDelta/120;
      } else if (event.detail) { // Mozilla case.
	delta = -event.detail/3;
      }
      if (delta){
	if(delta < 0 && onDown){
	  onDown(delta);
	} else if(delta > 0 && onUp){
	  onUp(delta);
	}
      }
      if(event.preventDefault){
	event.preventDefault();
      }
      event.returnValue = false;
    };
  },
  init : function(dom, onUp, onDown){
    var handler = this.makeHandler(dom, onUp, onDown);
    if(dom.addEventListener){
      dom.addEventListener("DOMMouseScroll", handler, false);
    }
    dom.onmousewheel = handler;
  }
};

var ReaderStatus = (function(){
  function ReaderStatus(args){
    this.pageNo = 0;
    this.pageCount = 0;
    this.progress = 0;
    this.screenCache = [];
    this.direction = args.direction || "vert";
    this.horiMode = args.hori || "lr-tb";
    this.vertMode = args.vert || "tb-rl";
    this.isVert = args.direction.indexOf("vert") >= 0;
    this.readerElements = args.readerElements || ["screen", "pager"];
    this.pagerElements = args.pagerElements || this.getDefaultPagerElements();
    this.initWidth = args.width || 640;
    this.initHeight = args.height || 480;
    this.fontSize = args.fontSize || 16;
    this.rowCount = Math.max(1, Math.min(2, args.rowCount));
    this.colCount = Math.max(1, Math.min(2, args.colCount));
    this.spacingSize = args.spacingSize || this.fontSize;
    this.useWheel = args.useWheel;
    this.useNombre = args.useNombre;
  }

  ReaderStatus.prototype = {
    isVertical : function(){
      return this.isVert;
    },
    isWheelEnable : function(){
      return this.useWheel;
    },
    isNombreEnable : function(){
      return this.useNombre;
    },
    isSeqAccess : function(){
      for(var i = 0; i < this.pagerElements.length; i++){
	if(this.pagerElements[i] == "progress"){
	  return true;
	}
      }
      return false;
    },
    isLeftProgress : function(){
      for(var i = 0; i < this.pagerElements.length; i++){
	if(this.pagerElements[i] == "left-next"){
	  return true;
	}
      }
      return false;
    },
    addScreenCache : function(cache){
      this.screenCache.push(cache);
    },
    setPageCount : function(page_count){
      this.pageCount = page_count;
    },
    setPageNo : function(page_no){
      this.pageNo = page_no;
    },
    setProgress : function(percent){
      this.progress = percent;
    },
    getDefaultPagerElements : function(){
      if(this.vertMode === "tb-rl"){
	return ["progress", "left-next", "right-prev"];
      }
      return ["progress", "left-prev", "right-next"];
    },
    getPageNo : function(){
      return this.pageNo;
    },
    getProgress : function(){
      return this.progress;
    },
    getReaderElements : function(){
      return this.readerElements;
    },
    getPagerElements : function(){
      return this.pagerElements;
    },
    getNextPageNo : function(){
      return Math.min(this.pageNo + 1, this.pageCount - 1);
    },
    getPrevPageNo : function(){
      return Math.max(0, this.pageNo - 1);
    },
    getPageCount : function(){
      return this.pageCount;
    },
    getScreenCache : function(page_no){
      return this.screenCache[page_no] || "";
    },
    getDirection : function(){
      return this.direction;
    },
    getHoriDocumentMode : function(){
      return this.horiMode;
    },
    getVertDocumentMode : function(){
      return this.vertMode;
    },
    getRowCount : function(){
      return this.rowCount;
    },
    getColCount : function(){
      return this.colCount;
    },
    getCellCount : function(){
      return this.rowCount * this.colCount;
    },
    getTemplateName : function(){
      var ret = [this.rowCount, this.colCount].join("x");
      return this.isNombreEnable()? [ret, "nombre"].join("-") : ret;
    },
    getFontSize : function(){
      return this.fontSize;
    },
    getSpacingSize : function(){
      return this.spacingSize;
    },
    getCellOrder : function(){
      if(this.rowCount == 1 && this.colCount == 1){
	return [0];
      } else if(this.rowCount == 2 && this.colCount == 1){
	return [0, 1];
      } else if(this.rowCount == 1 && this.colCount == 2){
	return this.isVert? [1, 0] : [0, 1];
      }
      return this.isVert? [0, 1, 2, 3] : [2, 3, 0, 1];
    },
    getFacingPageOrder : function(page_no){
      var first = 2 * (page_no + 1) - 1;
      var second = 2 * (page_no + 1);
      return this.isVert? {left:second, right:first} : {left:first, right:second};
    },
    getCellPageWidth : function(){
      return Math.floor(this.initWidth / this.colCount);
    },
    getCellPageHeight : function(){
      return Math.floor(this.initHeight / this.rowCount);
    },
    getHoriSpace : function(){
      return this.spacingSize * (this.colCount + 2);
    },
    getVertSpace : function(){
      return this.spacingSize * (this.rowCount + 2);
    },
    getHoriBorderSize : function(){
      return (this.colCount >= 2)? 1 : 0;
    },
    getVertBorderSize : function(){
      return (this.rowCount >= 2)? 1 : 0;
    },
    getFooterHeight : function(){
      return this.isNombreEnable()? this.fontSize * 2 : 0;
    },
    getScreenWidth : function(){
      return this.initWidth + this.getHoriSpace() + this.getHoriBorderSize();
    },
    getScreenHeight : function(){
      return this.initHeight + this.getVertSpace() + this.getVertBorderSize() + this.getFooterHeight();
    },
    getPagerWidth : function(){
      return this.getScreenWidth();
    },
    getProgressWidth : function(){
      return this.getPagerWidth() - 200;
    }
  };

  return ReaderStatus;
})();

var Pager = (function(){
  function Pager(app_status, callbacks){
    this.status = app_status;

    // create basic nodes
    this.rootNode = this._createRootNode();

    // create dom tree
    var elements = this.status.getPagerElements();
    for(var i = 0; i < elements.length; i++){
      var element_name = elements[i];
      switch(element_name){
      case "left-next": case "right-next":
	this.nextNode = this._createNextNode(this._createNextLabel(element_name));
	this.rootNode.appendChild(this.nextNode);
	break;
      case "left-prev": case "right-prev":
	this.prevNode = this._createPrevNode(this._createPrevLabel(element_name));
	this.rootNode.appendChild(this.prevNode);
	break;
      case "indicator":
	this.pageNoInput = this._createPageNoNode();
	this.slashNode = this._createSlashNode();
	this.pageCountNode = this._createPageCountNode();
	this.rootNode.appendChild(this.pageNoInput);
	this.rootNode.appendChild(this.slashNode);
	this.rootNode.appendChild(this.pageCountNode);
	break;
      case "progress":
	this.progressNode = this._createProgressNode();
	this.rootNode.appendChild(this.progressNode);
	break;
      }
    }

    // setup event handlers
    if(this.nextNode){
      this.nextNode.onclick = callbacks.onNext;
    }
    if(this.prevNode){
      this.prevNode.onclick = callbacks.onPrev;
    }
    if(this.pageNoInput){
      this.pageNoInput.onkeydown = function(evt){
	var page_no = Math.max(0, parseInt(this.value, 10) - 1);
	var keycode;
	if(window.event){ // MSIE
	  keycode = window.event.keyCode;
	} else {
	  keycode = evt.which || evt.keyCode;
	}
	if(keycode == 13){ // ENTER
	  callbacks.onJump(page_no);
	}
      };
    }
  }

  Pager.prototype = {
    getRootNode : function(){
      return this.rootNode;
    },
    hide : function(){
      this.rootNode.style.display = "none";
    },
    show : function(){
      this.rootNode.style.display = "block";
    },
    updatePageNo : function(){
      if(this.pageNoInput){
	var page_no = this.status.getPageNo();
	this.pageNoInput.value = page_no + 1;
      }
    },
    updatePageCount : function(){
      if(this.pageCountNode){
	var page_count = this.status.getPageCount();
	this.pageCountNode.innerHTML = page_count;
      }
    },
    updateProgress : function(){
      if(this.progressNode){
	var progress = this.status.getProgress();
	this.progressNode.firstChild.firstChild.style.width = progress + "%";
      }
    },
    _createRootNode : function(){
      var node = document.createElement("div");
      var klass = ["nehan-reader-pager"];
      if(this.status.isSeqAccess()){
	klass.push("nehan-reader-pager-seq");
      }
      node.className = klass.join(" ");
      node.style.width = this.status.getPagerWidth() + "px";
      return node;
    },
    _createPageNoNode : function(){
      var node = document.createElement("input");
      node.className = "nehan-reader-page-no";
      node.type = "text";
      node.value = "0";
      return node;
    },
    _createSlashNode : function(){
      var node = document.createElement("span");
      node.className = "nehan-reader-slash";
      node.innerHTML = "/";
      return node;
    },
    _createPageCountNode : function(){
      var node = document.createElement("span");
      node.className = "nehan-reader-page-count";
      return node;
    },
    _createNextLabel : function(element_name){
      switch(element_name){
      case "left-next": return "&laquo; NEXT";
      case "right-next": return "NEXT &raquo;";
      default: return "NEXT";
      }
    },
    _createPrevLabel : function(element_name){
      switch(element_name){
      case "left-prev": return "&laquo; PREV";
      case "right-prev": return "PREV &raquo;";
      default: return "PREV";
      }
    },
    _createNextNode : function(text){
      var node = document.createElement("button");
      node.className = "nehan-reader-next nehan-reader-pager-button";
      node.innerHTML = text;
      return node;
    },
    _createPrevNode : function(text){
      var node = document.createElement("button");
      node.className = "nehan-reader-prev nehan-reader-pager-button";
      node.innerHTML = text;
      return node;
    },
    _createProgressNode : function(){
      var node = document.createElement("div");
      node.className = "nehan-reader-progress";
      node.style.width = this.status.getProgressWidth() + "px";
      node.appendChild(this._createProgressBox());
      return node;
    },
    _createProgressBox : function(){
      var node = document.createElement("div");
      node.className = "nehan-reader-progress-box";
      node.appendChild(this._createProgressBar());
      
      return node;
    },
    _createProgressBar : function(){
      var node = document.createElement("div");
      node.style["float"] = this.status.isLeftProgress()? "right" : "left";
      node.className = "nehan-reader-progress-bar";
      return node;
    }
  };

  return Pager;
})();

var Reader = (function(){
  function Reader(src, opt){
    this._initialize(src, opt);
  }

  Reader.prototype = {
    renderTo : function(target){
      this.target = target;
      this._layoutElements();
      this._startStream();
      if(this.status.isWheelEnable()){
	this._setupWheel(this.screenNode);
      }
      this._showReader();
    },
    reset : function(opt){
      this._initialize(this.src, opt);
      this.renderTo(this.target);
    },
    writePage : function(page_no){
      this.status.setPageNo(page_no);
      this._updateScreen();
      this.onPage(this);
    },
    writePrevPage : function(){
      var page_no = this.status.getPageNo();
      if(page_no > 0){
	this.writePage(page_no-1);
      }
    },
    writeNextPage : function(){
      var page_no = this.status.getPageNo();
      if(this.stream.hasPage(page_no+1)){
	this.writePage(page_no+1);
      } else if(this.stream.hasNext()){ // still not calclated and stream has next.
	var page_result = this._getNextPage();
	this._cacheResult(page_result);
	this.writePage(page_no+1);
      }
    },
    writeAnchorPage : function(anchor_name){
      var page_no = this.engine.documentContext.getAnchorPageNo(anchor_name);
      this.writePage(page_no);
    },
    getDirection : function(){
      return this.status.getDirection();
    },
    getPageNo : function(){
      return this.status.getPageNo();
    },
    getPageCount : function(){
      return this.status.getPageCount();
    },
    getRootNode : function(){
      return this.target;
    },
    getScreenNode : function(){
      return this.screenNode;
    },
    getPagerNode : function(){
      return this.pager.getRootNode();
    },
    getOutlineNode : function(list_type, onclick){
      var self = this;
      var _list_type = list_type || "ol";
      return this.engine.documentContext.createBodyOutlineElement({
	createRoot: function(){
	  return document.createElement(_list_type);
	},
	onClickLink : function(toc){
	  var group_page_no = self.stream.getGroupPageNo(toc.pageNo);
	  if(onclick){
	    onclick(group_page_no, toc.headerId);
	  } else {
	    self.writePage(group_page_no);
	    $(".nehan-header").removeClass("nehan-toc-clicked");
	    $("#nehan-header-" + toc.headerId).addClass("nehan-toc-clicked");
	  }
	  return false;
	}
      });
    },
    getEngine : function(){
      return this.engine;
    },
    _initialize : function(src, opt){
      this.src = src;
      this.status = new ReaderStatus(opt);
      this.onLayout = opt.onLayout || function(){};
      this.onCreateEngine = opt.onCreateEngine || function(){};
      this.onReadyPage = opt.onReadyPage || function(){};
      this.onComplete = opt.onComplete || function(){};
      this.onError = opt.onError || function(){};
      this.onPage = opt.onPage || function(){};
      this.engine = this._createEngine(opt.engineConfig);
      this.pager = this._createPager();
      this.stream = this._createStream(src);
      this.template = this._createTemplate();
      this.screenNode = this._createScreenNode();
    },
    _layoutElements : function(){
      var elements = this.status.getReaderElements();
      for(var i = 0; i < elements.length; i++){
	switch(elements[i]){
	case "screen":
	  this.target.appendChild(this.getScreenNode());
	  break;
	case "pager":
	  this.target.appendChild(this.getPagerNode());
	  break;
	}
      }
    },
    _showReader : function(){
      this.target.style.display = "block";
    },
    _startStream : function(){
      if(this.status.isSeqAccess()){
	this._startSeqAccessStream();
      } else {
	this._startRandAccessStream();
      }
    },
    _startSeqAccessStream : function(){
      var first_page = this._getNextPage();
      this._cacheResult(first_page);
      this.writePage(0);
      this.onReadyPage(this);
    },
    _startRandAccessStream : function(){
      var self = this;
      this.stream.asyncGet({
	onComplete : function(stream, time){
	  self._onComplete(time);
	},
	onProgress : function(stream, tree){
	  var page = stream.getPage(tree.pageNo);
	  self._onProgress(page);
	},
	onError : function(stream){
	  self._onError(caller);
	}
      });
    },
    _setupWheel : function(target){
      var self = this;
      Wheel.init(target, function(){
	self.writePrevPage();
      }, function(){
	self.writeNextPage();
      });
    },
    _getNextPage : function(){
      return this.stream.getNext();
    },
    _getResult : function(page_no){
      return this.stream.get(page_no);
    },
    _onComplete : function(time){
      this.onComplete(this);
    },
    _onProgress : function(page){
      this.status.setPageCount(page.pageNo + 1);
      this._cacheResult(page);
      this.pager.updatePageCount();

      if(page.pageNo === 0){
	this.writePage(0);
	this.onReadyPage(this);
      }
    },
    _onError : function(stream){
      this.onError(stream);
    },
    _cacheResult : function(page){
      var html = this._outputScreenHtml(page);
      this.status.addScreenCache({
	html:html,
	result:page
      });
    },
    _updateScreen : function(){
      var self = this;
      var page_no = this.status.getPageNo();
      if(page_no < 0){
	return;
      }
      var cache = this.status.getScreenCache(page_no);
      var percent = cache.result.percent;
      if(!this.stream.hasNext() && !this.stream.hasPage(page_no+1)){
	percent = 100;
      }
      this.status.setProgress(percent);
      this.screenNode.innerHTML = cache.html;
      this.pager.updatePageNo();
      this.pager.updateProgress();
      if(this.status.getPageCount() != this.stream.getPageCount()){
	this.status.setPageCount(this.stream.getPageCount());
	this.pager.updatePageCount();
      }
      $(".nehan-anchor-link").click(function(){
	var anchor_name = $(this).attr("href").substring(1); // cut "#"
	self.writeAnchorPage(anchor_name);
	return false;
      });
    },
    _outputScreenHtml : function(page){
      var page_no = page.pageNo;
      var cell_order = this.status.getCellOrder();
      var facing_page_order = this.status.getFacingPageOrder(page_no);

      this.template.clearValues();
      this.template.setValue("cell_width", this.status.getCellPageWidth());
      this.template.setValue("cell_height", this.status.getCellPageHeight());
      this.template.setValue("space", this.status.getSpacingSize());
      this.template.setValue("font_size", this.status.getFontSize());
      this.template.setValue("page_pos", page_no);
      this.template.setValue("page_no", page_no + 1);
      this.template.setValue("right_page_no", facing_page_order.right);
      this.template.setValue("left_page_no", facing_page_order.left);

      for(var i = 0; i < page.getGroupSize(); i++){
	this.template.setValue(cell_order[i], page.getGroupHtml(i));
      }

      return this.template.render();
    },
    _createEngine : function(config){
      var engine = Nehan.setup({
	config:config,
	layout:{
	  direction:this.status.getDirection(),
	  hori:this.status.getHoriDocumentMode(),
	  vert:this.status.getVertDocumentMode(),
	  fontSize:this.status.getFontSize(),
	  width:this.status.getCellPageWidth(),
	  height:this.status.getCellPageHeight()
	}
      });
      this.onCreateEngine(engine);
      return engine;
    },
    _createStream : function(src){
      var group_count = this.status.getCellCount();
      return this.engine.createPageStream(src, group_count);
    },
    _createTemplate : function(){
      var name = this.status.getTemplateName();
      var source = Themes[name] || "";
      return new Template(source);
    },
    _createScreenNode : function(html){
      var page = document.createElement("div");
      page.className = "nehan-reader-screen";
      page.style.width = this.status.getScreenWidth() + "px";
      page.style.height = this.status.getScreenHeight() + "px";
      if(html){
	page.innerHTML = html;
      }
      return page;
    },
    _createPager : function(){
      var self = this;
      return new Pager(this.status, {
	onNext: function(){
	  self.writeNextPage();
	  return false;
	},
	onPrev : function(){
	  self.writePrevPage();
	  return false;
	},
	onJump : function(page_no){
	  self.writePage(page_no);
	}
      });
    }
  };

  return Reader;
})();

// export
Nehan.Reader = Reader;
Nehan.Reader.version = "1.0.3";

})();

;(function($){
  $.fn.nehan = function(options){
    var elements = this;

    // merge defaults
    var opt = $.extend({}, $.fn.nehan.defaults, options);
    var get_width = function($target, width_value){
      var parent_width = $target.width();
      var int_width = parseInt(width_value || parent_width, 10);
      if(String(width_value).indexOf("%") > 0){
	return Math.floor(parent_width * int_width / 100);
      }
      return int_width;
    };

    // create reader with pager
    var create_reader = function($target, html){
      opt.width = get_width($target, options.width);
      (new Nehan.Reader(html, opt)).renderTo($target[0]);
    };

    // output pages straight forward
    var output_pages = function($target, html){
      var width = get_width($target, options.width);
      var engine = Nehan.setup({
	config:opt.engineConfig,
	layout:{
	  direction:opt.direction,
	  width:width,
	  height:opt.height,
	  fontSize:opt.fontSize,
	  vertFontFamily:opt.vertFontFamily,
	  horiFontFamily:opt.horiFontFamily,
	  markerFontFamily:opt.markerFontFamily
	}
      });

      if(opt.onCreateEngine){
	opt.onCreateEngine(engine);
      }
      
      var stream = engine.createPageStream(html);

      stream.asyncGet({
	onProgress:function(stream, tree){
	  var page_node = document.createElement("div");
	  var page = stream.getPage(tree.pageNo);
	  page_node.innerHTML = page.html;
	  $target.append(page_node);
	}
      });
    };

    var get_source_from_dom = function($dom){
      var tag_name = $dom.get(0).tagName.toLowerCase();
      return (tag_name === "textarea")? $dom.val() : $dom.html();
    };

    var show = function($dom, source){
      $dom.html("").css("display", "none");
      var $dst = $("<div />").attr("class", $dom.attr("class") || "").addClass("jquery-nehan-page").insertAfter($dom);
      if(opt.usePager){
	create_reader($dst, source);
      } else {
	output_pages($dst, source);
      }
    };

    elements.each(function(){
      var $dom = $(this);
      var source;
      var resource = $dom.data("resource");
      if(resource){
	$.get(resource, function(source){
	  source = opt.onCreateSource(source);
	  show($dom, source);
	});
      } else {
	source = opt.text? opt.text : get_source_from_dom($dom);
	source = opt.onCreateSource(source);
	show($dom, source);
      }
    });

    return this;
  };

  // notice : default width is dynamically decided by target width.
  $.fn.nehan.defaults = {
    // direct text property.
    // if direct text is set, this value is directly rendered.
    // default value is empty.
    text:"",

    // whether use pager or not.
    // if true, content is shown by single screen and pager.
    // if false, pager is disabled and content is shown by multiple pages.
    usePager:true,

    // config args for nehan engine.
    // default: empty(use default settings).
    engineConfig:{},
    
    // size of screen height but this size is exceeded by spacingSize
    height: 380,

    // basic font size. if you use 2em, 32px is selected in this case.
    fontSize: 16,

    // set 'hori' if you want horizontal layout.
    direction: "vert",

    // document mode for direction "hori"
    hori:"lr-tb",

    // document mode for direction "vert"
    vert:"tb-rl", // or "tb-lr" is supported

    // font-family used for vertical text line.
    vertFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",

    // font-family used for horizontal text line.
    horiFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",

    // font-family used for marker parts of ul, ol.
    markerFontFamily:"'Meiryo','メイリオ','Hiragino Kaku Gothic Pro','ヒラギノ角ゴ Pro W3','Osaka','ＭＳ Ｐゴシック', monospace",

    // row count of screen division. 1 or 2 available.
    rowCount:1,

    // col count of screen division. 1 or 2 available.
    colCount:1,

    // space size of each divided page in one screen.
    spacingSize:16,

    // whether paging by mouse wheel is enabled. default true.
    useWheel:true,

    // whether add nombre to each page element. default false.
    useNombre:false,

    // ui parts of reader app
    // --------------------------------------------------------
    // screen: main contents
    // pager: pager ui
    // --------------------------------------------------------
    //
    // examples:
    // readerElements:["screen", "pager"], // screen first, pager second(default)
    // readerElements:["pager", "screen"], // pager first, screen second
    readerElements:["screen", "pager"],

    // ui parts of pager
    // --------------------------------------------------------
    // left-next: NEXT button(left arrow)
    // right-next: NEXT button(right arrow)
    // left-prev: PREV button(left arrow)
    // right-prev: PREV button(right arrow)
    // indicator: ui set of page position(page_no / page_count).
    // progress: progress-bar
    // --------------------------------------------------------
    // notice about pagerElements
    // you can not mix "indicator" and "progress" together.
    // if both of them are assigned, "progress" is selected.
    //
    // examples:
    // pagerElements:["left-next", "indicator", "right-prev"], // vertical-rl, random access pager(default)
    // pagerElements:["left-prev", "indicator", "right-next"], // horizontal-lr, random access pager
    // pagerElements:["left-next", "right-prev", "progress"], // vertical-rl, sequencial access pager
    // pagerElements:["left-prev", "right-next", "progress"], // horizontal-lr, sequencial access pager
    // pagerElements:[], // no pager(append mode)
    pagerElements:["left-next", "indicator", "right-prev"],

    // called before processing source text.
    // by default, do nothing.
    // usefull to edit original source text.
    onCreateSource : function(text){
      return text;
    },

    // called when layout engine is created and ready to use.
    // this is called before start parsing.
    // usefull to edit basic style of engine.
    onCreateEngine : function(engine){
      // example: you cant edit style like this.
      /*
      engine.setStyle("h1", {
	"border-width":"0 0 1px 0"
	"font-size":"30px"
      });
      */
    },

    // called when first page is set to screen.
    // usefull to setup keybord shortcut or enable variaous ui effects.
    // this is not called if usePager is false.
    onReadyPage : function(reader){
    },

    // called after screen for 'page_no' is updated.
    // this callback is not called if you disabled pager.
    // this is not called if usePager is false.
    onPage : function(reader){
      // you can do something unique here.
    },
    // called after all pages generated.
    // this callback is called when you select pager of "indicator".
    // by default, we append outline at the bottom of reader.
    // this is not called if usePager is false.
    onComplete : function(reader){
      var outline_dom = reader.getOutlineNode("ol");
      if(outline_dom){
	outline_dom.classList.add("nehan-outlines");
	reader.getRootNode().appendChild(outline_dom);
      }
    },
    onError : function(reader){
      alert("error at " + reader.getSeekPercent() + "%");
    }
  };
})(jQuery);

