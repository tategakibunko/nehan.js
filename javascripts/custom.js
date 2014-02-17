$(function(){
  $(".nehan-book").nehan({
    usePager:true,
    direction: "hori",
    fontSize:16,
    width: 640,
    height: 480,
    readerElements:["pager", "screen"],
    pagerElements:["left-prev", "indicator", "right-next"],
    useWheel:false,
    onComplete: function(reader){
      var outline = reader.getOutlineNode("ul");
      if(outline){
	outline.classList.add("book-outline");
	reader.getRootNode().appendChild(outline);
      }
    }
  });
});
