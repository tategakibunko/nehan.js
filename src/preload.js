/**
 Preload un-sized element before parsing.

 @namespace Nehan.Preload
 */
Nehan.Preload = (function(){
  var __regist_resource = function(resources, tag){
    var resource_id = resources.length;
    resources[resource_id] = tag.setAttr("data-preload-id", resource_id);
    return tag;
  };

  var __search_img = function(context){
    context.html = context.html.replace(/(<img[^>]*>)/g, function(match, p1){
      var tag = new Nehan.Tag(p1);
      if(tag.hasAttr("width") && tag.hasAttr("height")){
	return match;
      }
      if(!tag.hasAttr("src")){
	return match;
      }
      return __regist_resource(context.resources, tag).toString();
    });
  };

  var __search_math = function(context){
    context.html = context.html.replace(/(<math[^>]*>)([\s|\S]*?)<\/math>/g, function(match, p1, p2){
      var tag = new Nehan.Tag(p1, p2);
      return __regist_resource(context.resources, tag).toString() + p2 + "</math>";
    });
  };

  var __create_signal = function(context){
    var cur_count = 0;
    var max_count = context.resources.length;
    return function(res){
      cur_count++;
      context.onProgress({max:max_count, cur:cur_count, res:res});
      if(cur_count >= max_count){
	context.onComplete(context);
      }
    };
  };

  var __load_img = function(res, signal){
    var img = new Image();
    img.onload = function(){
      res.setAttr("width", img.width);
      res.setAttr("height", img.height);
      signal(res);
    };
    img.onerror = function(){
      signal(res);
    };
    img.src = res.getAttr("src");
  };

  var __load_math = function(res, signal){
    var element = document.createElement("div");
    element.innerHTML = res.getContent();
    element.style.display = "inline-block";
    element.style.opacity = 0;
    element.style.fontSize = Nehan.Config.defaultFontSize + "px";
    document.body.appendChild(element);

    Nehan.MathJax.typeset(element, {
      onComplete:function(math_element){
	res.element = math_element;
	res.setAttr("measure", math_element.scrollWidth);
	res.setAttr("extent", math_element.scrollHeight);
	signal(res);
	document.body.removeChild(element);
      },
      onError:function(reason){
	console.warn("Nehan.MathJax.typeset failed for %o(%s)", res, reason);
	res.element = element;
	res.setAttr("measure", 0);
	res.setAttr("extent", 0);
	signal(res);
	try {
	  document.body.removeChild(element);
	} catch(err){
	  // ignore
	}
      }
    });
  };

  var __req_animation_frame = Nehan.Closure.animationFrame();

  var __load_res = function(context, signal){
    if(context.loadingIndex >= context.resources.length){
      return;
    }
    var res = context.resources[context.loadingIndex];
    switch(res.getName()){
    case "img":
      __load_img(res, signal);
      break;
    case "math":
      __load_math(res, signal);
      break;
    default:
      break;
    }
    context.loadingIndex++;
    __req_animation_frame(function(){
      __load_res(context, signal);
    });
  };

  var __setup_html = function(context){
    context.tagNames.forEach(function(tag_name){
      switch(tag_name){
      case "img":
	__search_img(context);
	break;
      case "math":
	if(typeof MathJax !== "undefined"){
	  __search_math(context);
	}
	break;
      default:
	break;
      }
    });
  };

  return {
    // parse html and add 'preload-id' to markups with no size attribute,
    // resource data is given by onComplete callback.
    //
    // [example]
    // <img> => <img data-preload-id='0'>
    // <math> => <img data-preload-id='1'>
    // <!-- if size is defined, nothing changes. -->
    // <img width='100' height='100'> => <img width='100' height='100'>
    /**
     @memberof Nehan.Preload
     @param html {String}
     @param opt {Object}
     @param opt.tagNames {Array.<String>}
     @param opt.onProgress {Function} status -> ()
     @param opt.onComplete {Function} result -> ()
     */
    start : function(html, opt){
      opt = opt || {};
      var context = {
	html:Nehan.Html.normalize(html),
	tagNames:opt.tagNames || [],
	resources:[],
	loadingIndex:0,
	onProgress:opt.onProgress || function(status){
	  // console.log("%d/%d", status.cur, status.max);
	},
	onComplete:opt.onComplete || function(result){
	  // console.log("html:%s", result.html);
	  // console.log("resources:%o", result.resources);
	}
      };
      __setup_html(context);
      if(context.resources.length === 0){
	context.onComplete(context);
	return;
      }
      var signal = __create_signal(context);
      __load_res(context, signal);
    }
  };
})();

