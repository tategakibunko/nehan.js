$(function(){
  $(".nehan-book").nehan({
    usePager:true,
    direction: "hori",
    fontSize:16,
    width: 450,
    height: 400,
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

  $(".nehan-book-vert").nehan({
    usePager:true,
    direction: "vert",
    fontSize:16,
    width: 450,
    height: 400,
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
