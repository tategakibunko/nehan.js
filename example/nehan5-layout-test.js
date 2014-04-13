var LayoutTest = (function(){
  var Text = {
    "long":"日本国民は正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたって自由のもたらす恵沢を確保し、政府の行為によって再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。",
    "middle":"あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん",
    "short":"短めのテキストです。"
  };

  // various text data
  var Snipet = {
    "ruby":[
      "<p>",
      "<ruby>漢字<rt>かんじ</rt></ruby>と<span class='nehan-xx-large'><ruby>日本<rt>にほん</rt></ruby></span>と<span class='nehan-empha-dot-open'>圏点</span>です。",
      "</p>"
    ].join(""),

    "ruby2":[
      "<p>",
      "<ruby>漢字<rt>かんじ</rt></ruby>と<ruby>日本<rt>にほん</rt></ruby>。",
      "</p>"
    ].join(""),

    "float":[
      "<p class='nehan-float-start' style='measure:100px'>",
      "短い長さの前方コンテンツ",
      "</p>",
      
      "<p class='nehan-float-start' style='measure:80px'>",
      "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
      "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
      "</p>",

      "<p class='nehan-float-end' style='measure:60px'>",
      "一つ目の後方に回り込まれるコンテンツ",
      "</p>",

      "<p class='nehan-float-end' style='measure:50px'>",
      "二つ目の後方コンテンツ",
      "</p>"

    ].join(""),

    "ul":[
      "<ul>",
      "<li>" + Text["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + Text["middle"] + "</li>",
	"<li>" + Text["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + Text["short"] + "</li>",
      "<li>" + Text["middle"] + "</li>",
      "<li>" + Text["long"] + "</li>",
      "</ul>"
    ].join(""),

    "ol":[
      "<ol>",
      "<li>" + Text["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + Text["middle"] + "</li>",
	"<li>" + Text["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + Text["short"] + "</li>",
      "<li>" + Text["middle"] + "</li>",
      "<li>" + Text["long"] + "</li>",
      "</ol>"
    ].join(""),

    "dummy":""
  };

  var Script = {
    "callback":[
      "<p>" + Text["middle"] + "</p>",
      "<div class='nehan-my-callback'>" + Text["short"] + "</div>"
    ].join(""),

    "plain":[
      Snipet["ruby"],
      "<p>" + Text["long"] + "</p>",
      "<p>" + Text["middle"] + "</p>",
      "<p>" + Text["short"] + "</p>"
    ].join(""),

    "flip-flow":[
      "<p>" + Text["long"] + "</p>",
      "<div class='nehan-flow-flip'>" + Text["long"] + "</div>",
      "<p>" + Text["middle"] + "</p>",
      "<div class='nehan-flow-flip'>" + Text["long"] + "</div>",
      "<p>" + Text["long"] + "</p>"
    ].join(""),

    "text-align":[
      "<p class='nehan-ta-start'>先頭寄せ</p>",
      "<p class='nehan-ta-center'>中央寄せ</p>",
      "<p class='nehan-ta-end'>後方寄せ</p>"
    ].join(""),

    "iblock":[
      "<div style='background-color:red' width='200' height='200' class='nehan-disp-iblock'>ほげ<br/>はげ</div>",
      Text["middle"]
    ].join(""),

    "pre":[
      "<pre>",
      Text["short"],
      Text["middle"],
      "</pre>"
    ].join("\n"),

    "table":[
      "<table>",
      "<tbody>",

      "<tr>",
      "<td>" + Text["long"] + "</td><td>hige</td><td>hage</td>",
      "</tr>",

      "<tr>",
      "<td>ohoho</td><td>ahaha</td><td>hihihi</td>",
      "</tr>",

      "<tr>",
      "<td>123</td><td>456</td><td>789</td>",
      "</tr>",

      "</tbody>",
      "</table>"
    ].join(""),

    "page-break":[
      Text["middle"],
      "<page-break>",
      Text["middle"],
      "<end-page>",
      Text["middle"],
      "<pbr>",
      Text["middle"]
    ].join(""),

    "hr":[
      Text["short"],
      "<hr />",
      Text["short"],
      "<hr class='nehan-space'>",
      Text["short"]
    ].join(""),

    "orphans":[
      "<p class='nehan-orphans-3'>" + Text["long"] + Text["long"] + Text["middle"] + Text["middle"] + "</p>",
      "<p class='nehan-orphans-3'>" + Text["long"] + "</p>",
      "<p class='nehan-orphans-3'>" + Text["long"] + "</p>",
      "<p class='nehan-orphans-3'>" + Text["long"] + "</p>"
    ].join(""),
    
    "bold":[
      "<b>太字</b>です。",
      "<em>イーエム</em>です。"
    ].join(""),

    "kerning":[
      "「「あああ。」」「ははは」あああ、、",
      "「「あああ。」」「ははは」あああ、、"
    ].join(""),

    "tcy":[
      "平成<span class='nehan-tcy'>25</span>年<span class='nehan-tcy'>1</span>月<span class='nehan-tcy'>10</span>日<span class='nehan-tcy'>!!</span>"
    ].join(""),

    "link":[
      "あああ<a data-id='10' href='/'>いいいい</a>",
      "open <a data-id='0' href='http://google.com/' target='_blank'>new window</a>"
    ].join("<br />"),

    "inline-img":[
      "<img src='nl.gif' width='16' height='16' />",
      Text["long"],
      "<img src='nl.gif' width='16' height='16' />",
      Text["long"]
    ].join(""),

    "color":[
      "<span style='color:orange'>orange</span>",
      "<span style='color:orange'>オレンジ。</span>",
      "<span style='color:red'>red</span>",
      "<span style='color:red'>あか。</span>",
      "<span style='color:black'>black</span>",
      "<span style='color:black'>くろ。</span>",
      "<span style='color:#06c'>skyblue</span>",
      "<span style='color:#06c'>みずいろ。</span>"
    ].join(""),

    "ruby":[
      Snipet["ruby"],
      Snipet["ruby2"]
    ].join(""),

    "empha":[
      "これは<span class='nehan-empha-dot-open'>圏点</span>です。",
      "これは<span class='nehan-empha-dot-filled'>圏点</span>です。",
      "これは<span class='nehan-empha-circle-open'>圏点</span>です。",
      "これは<span class='nehan-empha-circle-filled'>圏点</span>です。",
      "これは<span class='nehan-empha-double-circle-open'>圏点</span>です。",
      "これは<span class='nehan-empha-double-circle-filled'>圏点</span>です。",
      "これは<span class='nehan-empha-triangle-open'>圏点</span>です。",
      "これは<span class='nehan-empha-triangle-filled'>圏点</span>です。",
      "これは<span class='nehan-empha-sesame-open'>圏点</span>です。",
      "これは<span class='nehan-empha-sesame-filled'>圏点</span>です。"
    ].join("<br>"),

    "ul":Snipet["ul"],

    "ol":Snipet["ol"],

    "float":[
      Snipet["float"],
      Snipet["ruby"],
      Text["long"],
      Snipet["ruby"],
      Text["middle"],
      Snipet["ruby"],
      Text["long"],
      Snipet["float"],
      Text["long"],
      Text["middle"],
      Text["long"],
      ""
    ].join(""),

    "dl":[
      "<dl>",
      "<dt>hoge</dt>",
      "<dd>" + Text["long"] + "</dd>",
      "</dl>"
    ].join(""),

    "header":[
      "<h1>h1h1h1</h1>",
      "<h2>h2h2h2</h2>",
      "<h2>h2h2h2.2</h2>",
      "<h3>h3h3h3</h3>",
      "<h2>h2h2h2.3</h2>",
      "<h3>h3h3h3.2</h3>",
      "<h4>h4h4h4</h4>",
      "<h5>h5h5h5</h5>",
      "<h6>h6h6h6</h6>"
    ].join(""),

    "image-float":[
      "<img class='nehan-disp-block nehan-float-start' src='128x128.gif' width='128' height='128' />",
      Text["long"],
      "<img class='nehan-disp-block nehan-float-end' src='128x128.gif' width='128' height='128' />",
      Text["long"]
    ].join(""),

    "image-push":[
      "<img class='nehan-disp-block' src='256x256.gif' width='256' height='256' pushed />",
      Text["long"]
    ].join(""),

    "image-pull":[
      Text["long"],
      "<img class='nehan-disp-block' src='256x256.gif' width='256' height='256' pulled />"
    ].join(""),

    "image":[
      "<img src='128x128.gif' width='128' height='128' />",
      Text["long"],
      "<img class='nehan-disp-block' src='256x256.gif' width='256' height='256'/>",
      Text["long"]
    ].join(""),

    "first-letter":[
      "<div class='nehan-drop-caps'>",
      Text["long"],
      "</div>"
    ].join(""),

    "first-line":[
      "<div class='nehan-first-line-larger'>",
      Text["long"],
      "</div>"
    ].join("")
  };

  var get_script = function(name){
    return Script[name] || Snipet[name] || Text[name] || "undefined script";
  };

  var create_engine = function(opt){
    var engine = Nehan.setup({
      layout:{
	direction:(opt.direction || "vert"),
	fontSize:(opt.fontSize || 16),
	width:(opt.width || 500),
	height:(opt.height || 500)
      }
    });

    engine.setStyles({
      ".nehan-first-line-larger::first-line":{
	"display":"block",
	"font-size":"1.6em"
      },
      ".nehan-orphans-3":{
	"orphans":3
      },
      ".nehan-my-callback":{
	"onload":function(style, context){
	  var rest_extent = context.getBlockRestExtent();
	  style.markup.setContent([
	    style.markup.getContent(),
	    "<p>this is added by onload(rest extent = " + rest_extent + " at this point)</p>"
	  ].join(""));
	},
	"inline":function(style, context){
	  style.markup.setContent([
	    style.markup.getContent(),
	    "<p>this is added by inline</p>"
	  ].join(""));
	}
      }
    });

    return engine;
  };

  var run_test = function($dom, opt){
    var script = opt.script || get_script(opt.name || "plain");
    var engine = create_engine(opt);

    engine.createPageStream(script).asyncGet({
      onProgress : function(stream, tree){
	var page = stream.getPage(tree.pageNo); // tree -> page
	$dom.append($("<div />").html(page.html));
      },
      onComplete : function(stream, time){
	$dom.append($("<p />").html(time + "msec"));
	$dom.append($("<h2 />").html("outline"));
	$dom.append(engine.createBodyOutlineElement());
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

      $test_menu.find("a").first().click();
    } // start
  };
})();

$(function(){
  LayoutTest.start();
});
