describe("SectionTreeConverter", function(){
  var start_section = function(page_no){
    return {
      name:"start-section",
      type:"body",
      pageNo:page_no
    };
  };

  var end_section = function(){
    return {
      name:"end-section",
      type:"body"
    };
  };

  var start_header = function(rank, id, title){
    return {
      name:"set-header",
      headerId:id,
      type:"h" + rank,
      pageNo:id, // for test
      rank:rank,
      title:title
    };
  };

  var tree = Nehan.OutlineContextParser.parse(
    new Nehan.OutlineContext()
      .add(start_section(0))
      .add(start_header(1, 1, "first h1"))
      .add(start_header(2, 2, "first h2"))
      .add(end_section())
      .add(start_header(1, 3, "second h1"))
      .add(start_header(3, 4, "first h3"))
      .add(start_header(2, 5, "second h2"))
      .add(start_header(1, 6, "third h1"))
  );

  var dom = Nehan.SectionTreeConverter.convert(tree);
  //console.log(dom);

  it("SectionTreeConverter.convert", function(){
    var root = dom.firstChild.firstChild.nextSibling;
    var h1 = root.firstChild;
    expect(h1.firstChild.innerHTML).toBe("first h1");
    var h2 = h1.firstChild.nextSibling;
    expect(h2.firstChild.firstChild.innerHTML).toBe("first h2");
    var h1_2 = h1.nextSibling;
    expect(h1_2.firstChild.innerHTML).toBe("second h1");
    var h3 = h1_2.firstChild.nextSibling.firstChild;
    expect(h3.firstChild.innerHTML).toBe("first h3");
    var h2_2 = h3.nextSibling;
    expect(h2_2.firstChild.innerHTML).toBe("second h2");
    var h1_3 = h1_2.nextSibling;
    expect(h1_3.firstChild.innerHTML).toBe("third h1");
  });
});
