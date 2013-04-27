var Catalog = (function(){
  function Catalog(direction, width, height){
    this.engine = Nehan.setup({
      layout:{
	direction:direction,
	hori:"lr-tb",
	vert:"tb-rl",
	//vert:"tb-lr",
	width:width,
	height:height
      }
    });
    var style = this.engine.Style;

    // style to test pseudo class
    style["dl.test-pc dt:first-child"] = {
      "font-size":"2.0em"
    };
    // style to test pseudo element before
    style[".test-pe-before:before"] = {
      "content":"this is content before",
      "font-size":"2em",
      "margin":{end:"1.0em"}
    };
    // style to test pseudo element after
    style[".test-pe-after:after"] = {
      "content":"this is content after",
      "font-size":"2em",
      "margin":{start:"1.0em"}
    };
    // style to test pseudo element first-letter
    style[".test-pe-first-letter:first-letter"] = {
      "font-size":"2em",
      "margin":{end:"0.1em"},
      "line-rate":1.0
    };
    // style to test pseudo element first-line
    style[".test-pe-first-line:first-line"] = {
      "font-size":"1.6em"
    };
    // style to test letter-spacing
    style[".test-wide-letter-spacing"] = {
      "letter-spacing":"0.5em"
    };
  }

  Catalog.prototype = {
    eval : function(text){
      this.stream = this.engine.createPageStream(text);

      // 'syncGet' is blocking method, so you must use this for only short text like this sample.
      // in case of long text, you must use 'asyncGet' instead of 'syncGet'.
      var time = this.stream.syncGet();
      return [
	this.getPages(),
	"<h3>ellapsed time</h3>",
	"<p>" + time + " msec</p>",
	"<h3 class='anchors'>anchors</h3>",
	this.getAnchors()
      ].join("");
    },
    getPages : function(){
      var html = "", page_count = this.stream.getPageCount();
      for(var i = 0; i < page_count; i++){
	html += (this.stream.get(i)).html;
      }
      return html;
    },
    getOutline : function(){
      return this.stream.getOutlineNode("body");
    },
    getAnchors : function(){
      var html = "", anchors = this.stream.getAnchors();
      html += "<ul>";
      for(prop in anchors){
	html += "<li>" + prop + " .. " + (anchors[prop] + 1) + "p</li>";
      }
      html += "</ul>";
      return html;
    }
  };

  return Catalog;
})();

var CatalogUtil = {
  imgSrc : function(w, h){
    return [w,h].join("x") + ".gif";
  },
  placeHolder : function(w, h, push_or_pull){
    return "<img width='" + w + "' height='" + h + "' src='" + this.imgSrc(w,h) + "'" + (push_or_pull? " " + push_or_pull : "") + "/>";
  }
};

var TestCode = {
  create : function(models){
    var text_short = models.text_short;
    var text_middle = models.text_middle;
    var text_large = models.text_large;
    var text_huge = models.text_huge;

    var thead = [
      "<thead>",
      "<tr><th>head1</th><th>head2</th></tr>",
      "</thead>"
    ].join("\n");

    var tfoot = [
      "<tfoot>",
      "<tr><td>foot1</td><td>foot2</td></tr>",
      "</tfoot>"
    ].join("\n");

    var tbody = [
      "<tbody>",
      "<tr><td>" + text_huge + "</td><td>body2</td></tr>",
      "</tbody>",
      "<tr><td>body3</td><td>body4</td></tr>",
      "<tr><td>body5</td><td>body6</td></tr>",
      "<tr><td>body7</td><td>body8</td></tr>"
    ].join("\n");

    var dyn_table = [
      "<table>",
      thead,
      tbody,
      tfoot,
      "</table>"
    ].join("\n");

    var static_table = [
      "<table width='180' height='100'>",
      "<thead>",
      "<tr><th>name</th><th>age</th></tr>",
      "</thead>",
      "<tbody>",
      "<tr><td>taro</td><td>20</td></tr>",
      "<tr><td>jiro</td><td>18</td></tr>",
      "</tbody>",
      "</table>"
    ].join("\n");

    var list_items = [
      "<li>" + text_large + "</li>",
      "<li>" + text_middle + "</li>",
      "<li>" + text_short + "</li>"
    ].join("\n");

    var headers1 = [
      "<h1>header1</h1>",
      "<h2>header2</h2>",
      "<h3>header3</h3>",
      "<h4>header4</h4>",
      "<h5>header5</h5>",
      "<h6>header6</h6>"
    ].join("\n");

    var headers2 = [
      "<h1>hhhhhh1</h1>",
      "<h2>hhhhhh2</h2>",
      "<h3>hhhhhh3</h3>",
      "<h4>hhhhhh4</h4>",
      "<h5>hhhhhh5</h5>",
      "<h6>hhhhhh6</h6>"
    ].join("\n");

    return {
      "header":[
	headers1,
	"<hr />",
	headers2
      ].join("\n"),

      "dynamic-table":dyn_table,

      "img-align":[
	"<img src='128x128.gif' width='128' height='128' class='nehan-ba-start'/>",
	text_huge,
	"<img src='256x256.gif' width='256' height='256' class='nehan-ba-end'/>",
	text_huge
      ].join("\n"),

      "vert-and-hori":[
	"<div width='100' height='150' class='nehan-ba-start nehan-flow-lr-tb'>" + text_large + "</div>",
	text_huge,
	"<div width='100' height='150' class='nehan-ba-end nehan-flow-tb-rl'>" + text_large + "</div>",
	text_huge
      ].join("\n"),

      "vert-and-hori2":[
	"<p>" + text_large + "</p>",
	"<div class='nehan-flow-flip'>" + text_huge + "</div>",
	"<p>" + text_large + "</p>"
      ].join("\n"),

      "figure":[
	"<figure width='148' height='150' class='nehan-ba-start nehan-flow-lr-tb'>",
	"<figcaption class='nehan-line-no-ruby'>this is caption</figcaption>",
	"<div class='nehan-ta-center nehan-line-no-ruby'>" + CatalogUtil.placeHolder(128,128) + "</div>",
	//CatalogUtil.placeHolder(128,128),
	"</figure>",
	text_huge
      ].join("\n"),

      "text-align":[
	"<p class='nehan-ta-start'>ta start</p>",
	"<p class='nehan-ta-center'>ta center</p>",
	"<p class='nehan-ta-end'>ta end</p>"
      ].join("\n"),

      "paragraph":[
	"<p>",
	text_large,
	"</p>",
	"<p class='nehan-jisage'>",
	text_large,
	"</p>"
      ].join("\n"),

      "blockquote":[
	"<blockquote>",
	text_large,
	"</blockquote>"
      ].join("\n"),

      "fieldset":[
	"<fieldset>",
	"<legend>legend</legend>",
	text_large,
	"</fieldset>"
      ].join("\n"),

      "ul":[
	"<ul>",
	list_items,
	"</ul>",
	"<ul class='nehan-ls-none'>",
	list_items,
	"</ul>"
      ].join("\n"),

      "ul2":[
	"<ul>",
	"<li>first</li>",
	"<li>",
	"<ul class='nehan-lst-circle'>",
	list_items,
	"</ul>",
	"</li>",
	"<li>last</li>",
	"</ul>",
	"<ul class='nehan-lst-square'>",
	list_items,
	"</ul>",
	"<ul class='nehan-lsp-inside'>",
	list_items,
	"</ul>"
      ].join("\n"),

      "ol":[
	"<ol>",
	list_items,
	list_items,
	list_items,
	list_items,
	"</ol>"
      ].join("\n"),

      "ol2":[
	"<ol>",
	"<li>first</li>",
	"<li>",
	"<ol class='nehan-lst-lower-alpha'>",
	list_items,
	"</ol>",
	"</li>",
	"<li>last</li>",
	"</ol>",
	"<ol class='nehan-lst-lower-roman'>",
	list_items,
	"</ol>"
      ].join("\n"),

      "dl":[
	"<dl>",
	"<dt>term1</dt>",
	"<dd>" + text_large + "</dd>",
	"<dt>term2</dt>",
	"<dd>" + text_middle + "</dd>",
	"<dt>term3</dt>",
	"<dd>" + text_short + "</dd>",
	"<dt>term4</dt>",
	"<dd>" + text_large + "</dd>",
	"<dt>term5</dt>",
	"<dd>" + text_middle + "</dd>",
	"<dt>term6</dt>",
	"<dd>" + text_short + "</dd>",
	"</dl>"
      ].join("\n"),
      
      "text-combine":[
	"平成<span class='nehan-tcy'>25</span>年<span class='nehan-tcy'>1</span>月<span class='nehan-tcy'>10</span>日<span class='nehan-tcy'>!!</span>"
      ].join("\n"),

      "hr":[
	text_short,
	"<hr />",
	text_short,
	"<hr class='space'>",
	text_short
      ].join("\n"),

      "static-block-push":[
	CatalogUtil.placeHolder(64, 64, "push"),
	"<p>" + text_huge + "</p>"
      ].join("\n"),

      "static-block-pull":[
	"<p>" + text_large + "</p>",
	CatalogUtil.placeHolder(64, 64, "pull")
      ].join("\n"),

      "multi-color":[
	"<span style='color:orange'>orange</span>",
	"<span style='color:orange'>オレンジ。</span>",
	"<span style='color:red'>red</span>",
	"<span style='color:red'>あか。</span>",
	"<span style='color:black'>black</span>",
	"<span style='color:black'>くろ。</span>",
	"<span style='color:#06c'>skyblue</span>",
	"<span style='color:#06c'>みずいろ。</span>"
      ].join("\n<br />"),

      "rounded-corner":[
	"<blockquote class='nehan-rounded'>",
	text_huge,
	"</blockquote>"
      ].join("\n"),

      "inline-img":[
	"<img src='nl.gif' width='16' height='16' />",
	text_large,
	"<img src='nl.gif' width='16' height='16' />",
	text_middle
      ].join(" "),

      "page-break":[
	text_large,
	"<page-break>",
	text_middle,
	"<end-page>",
	text_large
      ].join("\n"),

      "page-break2":[
	"<div class='nehan-pb-after'>page break after</div>",
	"page is breaked.",
	"<h1 class='nehan-pb-before'>page break before</h1>",
	"some text after break",
	"<hr class='nehan-pb-after' />",
	text_middle
      ].join("\n"),

      "explicit-outline":[
	"<h1>AAAA</h1>",
	"<section>",
	"<h1>BBBB</h1>",
	"<section>",
	"<h1>CCCC</h1>",
	"</section>",
	"</section>",
	"<section>",
	"<h1>DDDD</h1>",
	"<h1>EEEE</h1>",
	"</section>"
      ].join("\n"),

      "implicit-outline":[
	"<h1>AAAA</h1>",
	"<h2>BBBB</h2>",
	"<h3>CCCC</h3>",
	"<h2>DDDD</h2>",
	"<h2>EEEE</h2>"
      ].join("\n"),

      "yakumono-kerning":[
	"「「あああ。」」「ははは」あああ、、",
	"「「あああ。」」「ははは」あああ、、"
      ].join("\n"),

      "embed-html":[
	"<div width='100' height='100' class='nehan-ba-end'>" + text_huge + "</div>",
	text_large
      ].join("\n"),

      "text-emphasis":[
	"<span class='nehan-empha-dot-filled'>ほげ</span>",
	"<span class='nehan-empha-dot-open'>ひげ</span>",

	"<span class='nehan-empha-circle-open'>はげ</span>",
	"<span class='nehan-empha-circle-filled'>まげ</span>",

	"<span class='nehan-empha-double-circle-open'>ほげ</span>",
	"<span class='nehan-empha-double-circle-filled'>ひげ</span>",

	"<span class='nehan-empha-triangle-open'>はげ</span>",
	"<span class='nehan-empha-triangle-filled'>まげ</span>",

	"<span class='nehan-empha-sesame-filled'>ほげ</span>",
	"<span class='nehan-empha-sesame-open'>ひげ</span>"
      ].join("\n"),

      "anchors":[
	"<a name='hoge'>hoge anchor</a>",
	text_huge,
	"<a name='higehige'>hige anchor</a>"
      ].join("<br />"),

      "info-utils":[
	"<div class='nehan-tip nehan-notice'>" + text_large + "</div>",
	"<div class='nehan-tip nehan-error'>" + text_large + "</div>",
	"<div class='nehan-tip nehan-success'>" + text_large + "</div>",
	"<div class='nehan-tip nehan-info'>" + text_large + "</div>",
	"<div class='nehan-tip nehan-alert'>" + text_large + "</div>"
      ].join("\n"),

      "link":[
	"<a href='/'>" + text_large + "</a>",
	"<a href='http://google.com/' target='_blank'>new window</a>"
      ].join("<br />"),

      "bold":[
	"<b>bold</b>" + text_short,
	"<strong>strong</strong>" + text_short
      ].join("<br />"),

      "inline-style":[
	"<style type='text/css' data-scope='global'>",
	"a.test{color:red}",
	"</style>",
	"<a href='#' class='test'>hoge</a>",
	"<page-break>",
	"<style type='text/css' data-scope='local'>",
	"a.test2{color:blue}",
	"</style>",
	"<a href='#' class='test2'>hige</a>",
	"<page-break>",
	"<a href='#' class='test'>hoge</a><br />",
	"<a href='#' class='test2'>hige</a>"
      ].join("\n"),

      "text-indent":[
	"<p class='nehan-ti-1em'>",
	text_large + text_large,
	"</p>"
      ].join("\n"),

      "pseudo-class-test":[
	"<dl class='test-pc'>",
	"<dt>first term</dt>",
	"<dd>desc1</dd>",
	"<dt>second term</dt>",
	"<dd>desc2</dd>",
	"</dl>"
      ].join("\n"),

      "pseudo-before":[
	"<p class='test-pe-before'>hoge</p>"
      ].join("\n"),

      "pseudo-after":[
	"<p class='test-pe-after'>hoge</p>"
      ].join("\n"),

      "pseudo-first-letter1":[
	"<p class='test-pe-first-letter'>",
	text_short,
	"</p>"
      ].join("\n"),

      "pseudo-first-letter2":[
	"<p class='nehan-drop-caps'>",
	"縦書き文庫は縦書きで作品を投稿できるサービスです。",
	"</p>"
      ].join("\n"),

      "pseudo-first-line":[
	"<p class='test-pe-first-line'>",
	//"not implemented yet",
	text_large,
	"</p>"
      ].join("\n"),

      "wide-letter-spacing":[
	"<p class='test-wide-letter-spacing'>",
	text_large + " abcd",
	"</p>"
      ].join("\n")
    };
  }
};

var CatalogApp = {
  start : function(test_codes){
    var result = $("#result");
    var menu = $("#menu");
    var source = $("#source");
    var outline = $("#outline");
    var hori_result = $("#hori-result");
    var vert_result = $("#vert-result");
    var cata_hori = new Catalog("hori", 340, 350);
    var cata_vert = new Catalog("vert", 340, 350);
    var create_menu_item = function(prop){
      var link = create_menu_link(prop);
      return $("<li />").append(link);
    };
    var create_menu_link = function(prop){
      return $("<a />", {"class":"eval-link", "href":"#" + prop})
	.html(prop)
	.click(function(){
	  result.html(""); // clear previous result
	  outline.html(""); // clear previous outline
	  menu.find(".eval-link").removeClass("clicked");
	  $(this).addClass("clicked");

	  var src = test_codes[prop];
	  source.val(src);
	  hori_result.html(cata_hori.eval(src));
	  vert_result.html(cata_vert.eval(src));
	  outline.append($(cata_hori.getOutline("body")));
	  return false;
	})
    };

    for(prop in test_codes){
      menu.append(create_menu_item(prop));
    }
    $(".eval-link").first().click();
  }
};
