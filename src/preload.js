Nehan.Preload = (function(){
  var __regist_resource = function(resources, tag){
    var resource_id = resources.length;
    resources[resource_id] = tag.setAttr("data-preload-id", resource_id);
    return tag;
  };

  var __search_img = function(target){
    target.html = target.html.replace(/(<img[^>]*>)/g, function(match, p1){
      var tag = new Nehan.Tag(p1);
      if(tag.hasAttr("width") && tag.hasAttr("height")){
	return match;
      }
      if(!tag.hasAttr("src")){
	return match;
      }
      return __regist_resource(target.resources, tag).toString();
    });
  };

  var __search_math = function(target){
    target.html = target.html.replace(/(<math[^>]*>)([\s|\S]*?)<\/math>/g, function(match, p1, p2){
      var tag = new Nehan.Tag(p1, p2);
      return __regist_resource(target.resources, tag).toString() + p2 + "</math>";
    });
  };

  var __create_signal = function(target){
    var cur_count = 0;
    var max_count = target.resources.length;
    return function(){
      cur_count++;
      target.onProgress({max:max_count, cur:cur_count});
      if(cur_count >= max_count){
	target.onComplete(target);
      }
    };
  };

  var __load_img = function(res, signal){
    var img = new Image();
    img.onload = function(){
      res.setAttr("width", img.width);
      res.setAttr("height", img.height);
      signal();
    };
    img.src = res.getAttr("src");
  };

  var __debug_size = function(path, dom){
    console.log("%s height:(offset:%d, client:%d, scroll:%d)", path, dom.offsetHeight, dom.clientHeight, dom.scrollHeight);
  };

  var __load_math = function(res, signal){
    var div = document.createElement("div");
    div.innerHTML = res.getContent();
    div.style.fontSize = Nehan.Config.defaultFontSize + "px";
    div.style.opacity = 0;
    document.body.appendChild(div);
    MathJax.Hub.Queue(function(){
      // __debug_size("math>div", div);
      res.setAttr("extent", div.scrollHeight);
      res.element = document.body.removeChild(div);
      res.element.style.opacity = 1;
      signal();
    });
  };

  var __load_res = function(target){
    var signal = __create_signal(target);
    target.resources.forEach(function(res){
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
    });
  };

  var __setup_html = function(target){
    target.tagNames.forEach(function(tag_name){
      switch(tag_name){
      case "img":
	__search_img(target);
	break;
      case "math":
	if(typeof MathJax !== "undefined"){
	  __search_math(target);
	}
	break;
      default:
	break;
      }
    });
  };

  return {
    start : function(opt){
      opt = opt || {};
      var target = {
	html:opt.html || "",
	tagNames:opt.tagNames || [],
	resources:[],
	onProgress:opt.onProgress || function(){},
	onComplete:opt.onComplete || function(){}
      };
      __setup_html(target);
      if(target.resources.length === 0){
	target.onComplete(target);
	return;
      }
      __load_res(target);
    }
  };
})();

