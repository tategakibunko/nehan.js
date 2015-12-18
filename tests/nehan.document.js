describe("Document", function(){
  var top_page_no = -1;
  beforeEach(function(done){
    var doc = new Nehan.Document();
    doc.setContent("<a href='#top'>this is top page</a>");
    doc.render({
      onComplete:function(time, ctx){
	top_page_no = doc.getAnchorPageNo("top");
	done();
      }
    });
  });
  it("Document.getAnchorPageNo", function(){
    expect(top_page_no).toBe(0);
  });
});

	 
