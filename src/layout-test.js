var LayoutTest = (function(){

  var TestText = {
    "long":"日本国民は正当に選挙された国会における代表者を通じて行動し、われらとわれらの子孫のために、諸国民との協和による成果と、わが国全土にわたって自由のもたらす恵沢を確保し、政府の行為によって再び戦争の惨禍が起ることのないやうにすることを決意し、ここに主権が国民に存することを宣言し、この憲法を確定する。",
    "middle":"<p>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</p>",
    "short":"<p>余白のテキストです。</p>"
  };

  // various text data
  var TestSnipet = {
    "ruby":[
      "<p>",
      "<ruby>漢字<rt>かんじ</rt></ruby>と<span class='nehan-xx-large'><ruby>日本<rt>にほん</rt></ruby></span>と<span class='nehan-empha-dot-open'>圏点</span>です。",
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
      "<li>" + TestText["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + TestText["middle"] + "</li>",
	"<li>" + TestText["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["middle"] + "</li>",
      "<li>" + TestText["long"] + "</li>",
      "</ul>"
    ].join(""),

/*
    "ul":[
      "<ol>",
      "<li>" +
	TestText["long"] +
	TestText["long"] +
	TestText["long"] +
	"</li>",
      "</ol>"
    ].join(""),
*/

/*
    "ul":[
      "<ol>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + TestText["short"] + "</li>",
      "</ol>"
    ].join(""),
*/

    /*
    "ul":[
      "<ol>",
      "<li>あ</li>",
      "<li>か</li>",
      "</ol>"
    ].join(""),
    */

    "ol":[
      "<ol>",
      "<li>" + TestText["short"] + "</li>",
      "<li>" + [
	"<ul>",
	"<li>" + TestText["middle"] + "</li>",
	"<li>" + TestText["short"] + "</li>",
	"<li>" + TestText["long"] + "</li>",
	"</ul>"
      ].join("") + "</li>",
      "<li>" + TestText["middle"] + "</li>",
      "<li>" + TestText["long"] + "</li>",
      "</ol>"
    ].join(""),

    "dummy":""
  };

  var TestScript = {
    "ruby-test":TestSnipet["ruby"],

    "ul-test":TestSnipet["ul"],

    "ol-test":TestSnipet["ol"],

    "plain-test":[
      TestSnipet["ruby"],
      TestText["long"],
      TestText["middle"],
      TestText["short"]
    ].join(""),

    "float-test":[
      TestSnipet["float"],
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      TestSnipet["float"],
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      ""
    ].join(""),

    "table-test":[
      "<table>",
      //"<tbody>",

      "<tr>",
      "<td>hoge</td><td>hige</td><td>hage</td>",
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

    "dl-test":[
      "<dl>",
      "<dt>hoge</dt>",
      "<dd>" + TestText["long"] + "</dd>",
      "</dl>"
    ].join("")
  };

  return {
    getGenerator : function(name){
      var script = TestScript[name] || TestSnipet[name] || TestText[name] || "undefined script";
      var tag = new Tag("<body>", script);
      var style = new StyleContext(tag, null);
      var stream = new TokenStream(tag.getContent());
      return new BlockLayoutGenerator(style, stream);
    },
    getEvaluator : function(){
      return (Layout.direction === "vert")? new VertLayoutEvaluator() : new HoriLayoutEvaluator();
    },
    start : function(name, opt){
      opt = opt || {};
      Layout.width = opt.width || 800;
      Layout.height = opt.height || 500;
      Layout.direction = opt.direction || "vert";

      var output = document.getElementById(opt.output || "result");
      var debug = document.getElementById(opt.debug || "debug");
      var generator = this.getGenerator(name);
      var evaluator = this.getEvaluator();
      var make_title = function(name){
	var dom = document.createElement("h2");
	dom.innerHTML = name + " / " + opt.direction;
	return dom;
      };
      var make_div = function(html){
	var dom = document.createElement("div");
	dom.innerHTML = html;
	return dom;
      };
      var make_time = function(t1, t2){
	var sec = t2.getTime() - t1.getTime();
	var dom = document.createElement("p");
	dom.innerHTML = (sec / 1000) + "sec";
	return dom;
      };

      output.appendChild(make_title(name));

      var raws = [];
      var t1 = new Date();
      do {
	var page = generator.yield();
	if(page){
	  var html = evaluator.evaluate(page);
	  output.appendChild(make_div(html));
	  raws.push(html);
	}
      } while(page != null);
      var t2 = new Date();

      output.appendChild(make_time(t1, t2));
      //debug.value = raws.join("\n\n");
    }
  };
})();

