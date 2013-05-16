
window.onload = function(){
  var target = document.getElementById("target")
  var html = target.innerHTML;
  var engine = Nehan.setup({
    layout:{
      direction:"hori",
      width:640,
      height:480,
      fontSize:16
    }
  });
  var stream = engine.createPageStream(html);
  target.innerHTML = "";
  target.style.display = "block";
  stream.asyncGet({
    onProgress:function(caller){
      var page_node = document.createElement("div");
      var page_result = caller.getSeekPageResult();
      page_node.innerHTML = page_result.getHtml();
      target.appendChild(page_node);
    },
    onComplete:function(time){
      //console.log(time + "msec");
    }
  });
};