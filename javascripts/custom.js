$(function(){
  $(".nehan-book").nehan({
    usePager:true,
    direction: "hori",
    fontSize:16,
    height: 500,
    readerElements:["pager", "screen"],
    pagerElements:["left-prev", "indicator", "right-next"],
    horiFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
    useWheel:false,
    onCreateEngine : function(engine){
      engine.setStyles({
	"h3":{
	  color:"green"
	}
      });
    },
    onComplete: function(reader){
      console.log("reader:%o", reader);
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
    height: 500,
    readerElements:["pager", "screen"],
    pagerElements:["left-prev", "indicator", "right-next"],
    horiFontFamily:"'ヒラギノ明朝 Pro W3','Hiragino Mincho Pro','HiraMinProN-W3','IPA明朝','IPA Mincho', 'Meiryo','メイリオ','ＭＳ 明朝','MS Mincho', monospace",
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
