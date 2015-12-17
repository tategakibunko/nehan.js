describe("OutlineContextParser", function(){
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

  it("section>h1", function(){
    var root = Nehan.OutlineContextParser.parse(
      new Nehan.OutlineContext()
	.add(start_section(0))
	.add(start_header(1, 1, "foo"))
    );
    var section1 = root.getChild();
    var header1 = section1.getHeader();
    
    // section
    expect(section1.getType()).toBe("body");
    expect(section1.getHeaderId()).toBe(1);
    expect(section1.getTitle()).toBe("foo");
    expect(section1.getRank()).toBe(1);

    // section>h1
    expect(header1.getId()).toBe(1);
    expect(header1.getTitle()).toBe("foo");
    expect(header1.getRank()).toBe(1);
  });

  it("section>h1>h2 + h1>h3>h2", function(){
    var root = Nehan.OutlineContextParser.parse(
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
    //console.log(root);
    /*
     h1(s1)
       h2(s2)
     h1(s3)
       h3(s4)
       h2(s5)
     h1(s6)
     */
    var section1 = root.getChild();
    var section2 = section1.getChild();
    var section3 = section1.getNext();
    var section4 = section3.getChild();
    var section5 = section4.getNext();
    var section6 = section3.getNext();

    expect(section1.getTitle()).toBe("first h1");
    expect(section1.getHeaderId()).toBe(1);
    expect(section2.getTitle()).toBe("first h2");
    expect(section2.getHeaderId()).toBe(2);
    expect(section3.getHeaderId()).toBe(3);
    expect(section3.getTitle()).toBe("second h1");
    expect(section4.getHeaderId()).toBe(4);
    expect(section4.getTitle()).toBe("first h3");
    expect(section5.getHeaderId()).toBe(5);
    expect(section5.getTitle()).toBe("second h2");
    expect(section6.getHeaderId()).toBe(6);
    expect(section6.getTitle()).toBe("third h1");
  });
});
