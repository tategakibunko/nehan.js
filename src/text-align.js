Nehan.TextAlign = (function(){
  /**
     @memberof Nehan
     @class TextAlign
     @classdesc abstraction of logical text align(start, end, center)
     @constructor
     @param value {String} - logical align direction, "start" or "end" or "center"
  */
  function TextAlign(value){
    this.value = value || "start";
  }

  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isStart = function(){
    return this.value === "start";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isEnd = function(){
    return this.value === "end";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isCenter = function(){
    return this.value === "center";
  };
  /**
   @memberof Nehan.TextAlign
   @return {boolean}
   */
  TextAlign.prototype.isJustify = function(){
    return this.value === "justify";
  };

  /**
   @memberof Nehan.TextAlign
   @param line {Nehan.Box}
   */
  TextAlign.prototype.setAlign = function(line){
    var style = line.context.style;
    var flow = style.flow;
    var content_measure  = line.getContentMeasure(flow);
    var space_measure = content_measure - line.inlineMeasure;
    if(space_measure <= 0){
      return;
    }
    var padding = new Nehan.Padding();
    if(this.isCenter()){
      var start_offset = Math.floor(space_measure / 2);
      line.size.setMeasure(flow, content_measure - start_offset);
      padding.setStart(flow, start_offset);
      Nehan.Obj.copy(line.css, padding.getCss());
    } else if(this.isEnd()){
      line.size.setMeasure(flow, line.inlineMeasure);
      padding.setStart(flow, space_measure);
      Nehan.Obj.copy(line.css, padding.getCss());
    }
  };

  /**
   @memberof Nehan.TextAlign
   @param line {Nehan.Box}
   */
  TextAlign.prototype.setJustify = function(line){
    var style = line.context.style;
    var flow = style.flow;
    var font_size = style.getFontSize();
    var half_font_size = Math.floor(font_size / 2);
    var quat_font_size = Math.floor(half_font_size / 2);
    var cont_measure = line.getContentMeasure(flow);
    var real_measure = line.inlineMeasure;
    var ideal_measure = font_size * Math.floor(cont_measure / font_size);
    var rest_space = ideal_measure - real_measure;
    var max_thres = style.getFontSize() * 2;
    var extend_parent = function(parent, add_size){
      if(parent){
	var pre_size = parent.size.getMeasure(flow);
	var new_size = pre_size + add_size;
	//console.log("extend parent:%d -> %d", pre_size, new_size);
	parent.size.setMeasure(flow, new_size);
      }
    };
    if(line.hasLineBreak || rest_space >= max_thres || rest_space === 0){
      return;
    }

    var filter_text = function(elements){
      return elements.reduce(function(ret, element){
	if(element instanceof Nehan.Box){
	  // 2015/10/8 update
	  // skip recursive child inline, only select text element of root line.
	  return element.isTextBlock()? ret.concat(filter_text(element.elements || [])) : ret;
	}
	return element? ret.concat(element) : ret;
      }, []);
    };
    var text_elements = filter_text(line.elements);
    if(text_elements.length === 0){
      return;
    }
    var targets = text_elements.filter(function(element){
      return ((element instanceof Nehan.Word) ||
	      (element instanceof Nehan.Char && !element.isKerningChar()));
    });
    if(targets.length === 0){
      return;
    }
    if(rest_space < 0){
      Nehan.List.iter(targets, function(text){
	if(text instanceof Nehan.Word){
	  var del_size;
	  del_size = text.paddingEnd || 0;
	  if(del_size > 0){
	    rest_space += del_size;
	    extend_parent(text.parent, -1 * del_size);
	    text.paddingEnd = 0;
	    //console.log("del space %d from %s", del_size, text.data);
	    if(rest_space >= 0){
	      return false;
	    }
	  }
	  del_size = text.paddingStart || 0;
	  if(del_size > 0){
	    rest_space += del_size;
	    extend_parent(text.parent, -1 * del_size);
	    text.paddingStart = 0;
	    //console.log("del space %d from %s", del_size, text.data);
	    if(rest_space >= 0){
	      return false;
	    }
	  }
	}
	return true;
      });
      return;
    }
    // rest_space > 0
    // so space is not enough, add 'more' space to word.
    //console.info("[%s]some spacing needed! %dpx", line.toString(), rest_space);
    var add_space = Math.max(1, Math.min(quat_font_size, Math.floor(rest_space / targets.length / 2)));
    Nehan.List.iter(targets, function(text){
      text.paddingEnd = (text.paddingEnd || 0) + add_space;
      rest_space -= add_space;
      extend_parent(text.parent, add_space);
      //console.log("add space end %d to [%s]", add_space, text.data);
      if(rest_space <= 0){
	return false;
      }
      if(text instanceof Nehan.Word){
	text.paddingStart = (text.paddingStart || 0) + add_space;
	rest_space -= add_space;
	extend_parent(text.parent, add_space);
	//console.log("add space %d to [%s]", add_space, text.data);
	if(rest_space <= 0){
	  return false;
	}
      }
      return true;
    });
  };

  return TextAlign;
})();

