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

    "ol":[
      "<ol>",
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
      TestSnipet["ruby"],
      TestText["long"],
      TestSnipet["ruby"],
      TestText["middle"],
      TestSnipet["ruby"],
      TestText["long"],
      TestSnipet["float"],
      TestText["long"],
      TestText["middle"],
      TestText["long"],
      ""
    ].join(""),

    "table-test":[
      "<table>",
      "<tbody>",

      "<tr>",
      "<td>" + TestText["long"] + "</td><td>hige</td><td>hage</td>",
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
    ].join(""),

    "header-test":[
      "<h1>h1h1h1</h1>",
      "<h2>h2h2h2</h2>",
      "<h3>h3h3h3</h3>",
      "<h4>h4h4h4</h4>",
      "<h5>h5h5h5</h5>",
      "<h6>h6h6h6</h6>"
    ].join("")
  };

  return {
    getScript : function(name){
      return TestScript[name] || TestSnipet[name] || TestText[name] || "undefined script";
    },
    getEvaluator : function(){
      return (Layout.direction === "vert")? new VertEvaluator() : new HoriEvaluator();
    },
    _makeTitle : function(name){
      var dom = document.createElement("h2");
      dom.innerHTML = name + " / " + opt.direction;
      return dom;
    },
    _makeDiv : function(html){
      var dom = document.createElement("div");
      dom.innerHTML = html;
      return dom;
    },
    _makeTime : function(t1, t2){
      var sec = t2.getTime() - t1.getTime();
      var dom = document.createElement("p");
      dom.innerHTML = (sec / 1000) + "sec";
      return dom;
    },
    _setupLayout : function(opt){
      Layout.width = opt.width || 800;
      Layout.height = opt.height || 500;
      Layout.direction = opt.direction || "vert";
    },
    start : function(name, opt){
      this._setupLayout(opt || {});
      var self = this;
      var script = this.getScript(name);
      var stream = new PageStream(script);
      var output = document.getElementById(opt.output || "result");
      var debug = document.getElementById(opt.debug || "debug");
      stream.asyncGet({
	// only first page is evaluated immediately.
	onFirstPage : function(caller, page){
	  output.appendChild(self._makeDiv(page.html));
	},
	onProgress : function(caller, tree){
	  var page = stream.getPage(tree.pageNo); // tree -> page
	  output.appendChild(self._makeDiv(page.html));
	},
	onComplete : function(time){
	  output.appendChild(self._makeDiv(time + "msec"));
	}
      });
    },
    // old version
    start1 : function(name, opt){
      this._setupLayout(opt || {});

      var script = this.getScript(name);
      var output = document.getElementById(opt.output || "result");
      var debug = document.getElementById(opt.debug || "debug");
      var generator = new BodyGenerator(script);
      var evaluator = this.getEvaluator();
      
      output.appendChild(this.makeTitle(name));

      var raws = [];
      var t1 = new Date();
      do {
	var page = generator.yield();
	if(page){
	  console.log("body element:%o", page);
	  var html = evaluator.evaluate(page);
	  output.appendChild(this.makeDiv(html));
	  raws.push(html);
	}
      } while(page != null);
      var t2 = new Date();

      output.appendChild(this.makeTime(t1, t2));
      //debug.value = raws.join("\n\n");

      var outline_contexts = DocumentContext.getOutlineContext("body");
      if(outline_contexts.length > 0){
	var cont = outline_contexts[0];
	var toc_node = (new OutlineContextConverter()).convert(cont);
	document.getElementById("toc").appendChild(toc_node);
      }
    }
  };
})();

