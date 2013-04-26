
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
    onProgress:function(page_no, percent, seek_pos){
      var page_node = document.createElement("div");
      var result = stream.get(page_no);
      page_node.innerHTML = result.html;
      target.appendChild(page_node);
    },
    onComplete:function(time){
      //console.log(time + "msec");
    }
  });
};