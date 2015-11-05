var LayoutTest = (function(){
  var get_script = function(name){
    return Script[name] || Snipet[name] || Text[name] || "undefined script";
  };

  var create_engine = function(opt){
    var document = new Nehan.Document();
    var dir = opt.direction || "vert";
    document.setStyle("body", {
      flow:((dir === "vert")? "tb-rl" : "lr-tb"),
      fontSize:(opt.fontSize || 16),
      width:(opt.width || 500),
      height:400
    });
    document.setStyles(TestStyles);
    return document;
  };

  var run_test = function($dom, opt){
    var script = opt.script || get_script(opt.name || "plain");
    var engine = create_engine(opt);
    engine.setContent(script).render({
      onProgress : function(tree, ctx){
	var page = ctx.getPage(tree.pageNo); // tree -> page
	$dom.append(page.element);
      },
      onComplete : function(time, ctx){
	$dom.append($("<p />").html(time + "msec"));
	$dom.append($("<h2 />").html("outline"));
	$dom.append(engine.createOutlineElement());
	//prettyPrint();
	//console.log("finished(%f msec)", time);
      }
    });
  };
  
  var $vert, $hori, $test_menu, $all_links;
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

      for(var test_name in Script){
	append_test_item(test_name);
      }

      if(location.href.indexOf("#") < 0){
	$test_menu.find("a").first().click();
      } else {
	var test_name = location.href.split("#")[1];
	$test_menu.find("a[href=#" + test_name + "]").click();
      }
    } // start
  };
})();

$(function(){
  LayoutTest.start();
});
