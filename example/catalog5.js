var LayoutTest = (function(){
  Nehan.Config.maxPageCount = 10;
  
  var get_script = function(name){
    return Script[name] || Snipet[name] || Text[name] || "undefined script";
  };

  var create_page_document = function(opt){
    var doc = new Nehan.Document();
    var dir = opt.direction || "vert";
    doc.setStyle("body", {
      flow:((dir === "vert")? "tb-rl" : "lr-tb"),
      fontSize:(opt.fontSize || 16),
      width:(opt.width || 500),
      height:400
    });
    doc.setStyles(TestStyles);
    return doc;
  };

  var run_test = function($dom, opt){
    var script = opt.script || get_script(opt.name || "plain");
    var page_document = create_page_document(opt);
    page_document.setContent(script).render({
      onPreloadProgress : function(status){
	//console.log("preload res:%o", status.res);
      },
      onProgress : function(tree, ctx){
	var page = ctx.getPage(tree.pageNo); // tree -> page
	$dom.append(page.element);
      },
      onComplete : function(time, ctx){
	$dom.append($("<p />").html(time + "msec"));
	$dom.append($("<h2 />").html("outline"));
	$dom.append(page_document.createOutlineElement());
	//prettyPrint();
	//console.log("finished(%f msec)", time);
      }
    });
  };
  
  var $vert, $hori, $test_menu, $all_links, $source;
  var append_test_item = function(test_name){
    var $link = $("<a />").attr("href", "#" + test_name).html(test_name);
    $link.click(function(){
      var script = get_script(test_name);
      $source.val(script);
      $test_menu.find("a").removeClass("active");
      $(this).addClass("active");
      $vert.empty();
      $hori.empty();
      
      run_test($vert, {
	name:test_name,
	script:script,
	direction:"vert"
      });

      run_test($hori, {
	name:test_name,
	direction:"hori"
      });

      return false;
    });
    
    $test_menu.append($("<li />").append($link));
  };

  return {
    start : function(){
      $vert = $("#result-vert");
      $hori = $("#result-hori");
      $test_menu = $("#test-menu");
      $source = $("#source");

      var test_name;
      for(test_name in Script){
	append_test_item(test_name);
      }

      if(location.href.indexOf("#") < 0){
	$test_menu.find("a").first().click();
      } else {
	test_name = location.href.split("#")[1];
	$test_menu.find("a[href=#" + test_name + "]").click();
      }
    } // start
  };
})();

$(function(){
  LayoutTest.start();
});
