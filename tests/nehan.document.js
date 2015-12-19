describe("Document", function(){
  var doc = new Nehan.Document();
  doc.setContent([
    "<a href='#top'>this is top page</a>",
    "<h1>top title</h1>",
     "<p>some content</p>",
     "<h2>second title</h2>",
     "<p>some content</p>"
  ].join(""));

  beforeAll(function(done){
    doc.render({
      onComplete:function(time, ctx){
	done();
      }
    });
  });

  it("shold page no of top anchor link is zero.", function(){
    expect(doc.getAnchorPageNo("top")).toBe(0);
  });

  it("shold exists outline.", function(){
    var outline = doc.createOutlineElement();
    var links = outline.getElementsByClassName("nehan-toc-link");
    //console.log(outline);
    expect(outline !== null).toBe(true);
    expect(links.length).toBe(2);
    expect(links[0].innerHTML).toBe("top title");
    expect(links[1].innerHTML).toBe("second title");
  });
});
	 
