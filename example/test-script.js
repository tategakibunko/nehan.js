var Script = {
  "selector":[
    // adjacent sibling selector(A+B) test
    "<h2>adj sibling</h2>",
    "<div class='adj-test'>", [
      "<a href='#'>one</a>",
      "<b>two</b>",
      "<b>three</b>"
    ].join("&nbsp;"),
    "</div>",

    // generic sibling selector(A~B) test
    "<h2>gen sibling</h2>",
    "<div class='gen-adj-test'>", [
      "<a href='#'>one</a>",
      "<b>two</b>",
      "<b>three</b>"
    ].join("&nbsp;"),
    "</div>",

    // attribute selector test
    // example from:https://developer.mozilla.org/ja/docs/Web/CSS/Attribute_selectors
    "<h2>attr selector test</h2>",
    "<div>",
    "<a href='http://example.com'>英語</a> ",
    "<span lang='en-us en-gb en-au en-nz'>Hello World!</span>",
    "</div>",

    "<div>",
    "<a href='#portuguese'>ポルトガル語</a> ",
    "<span lang='pt'>Olá Mundo!</span>",
    "</div>",

    "<div>",
    "<a href='http://example.cn'>中国語（簡体）</a> ",
    "<span lang='zh-CN'>世界您好！</span>",
    "</div>",

    "<div>",
    "<a href='http://example.cn'>中国語（繁体）</a> ",
    "<span lang='zh-TW'>世界您好！</span>",
    "</div>"
  ].join("\n"),

  "abs-font-size":[
    "<p style='font-size:larger'>larger</p>",
    "<p style='font-size:smaller'>smaller</p>",
    "<p style='font-size:xx-large'>xxlarge</p>",
    "<p style='font-size:x-large'>xlarge</p>",
    "<p style='font-size:large'>large</p>",
    "<p style='font-size:medium'>medium</p>",
    "<p style='font-size:small'>small</p>",
    "<p style='font-size:x-small'>xsmall</p>",
    "<p style='font-size:xx-small'>xxsmall</p>"
  ].join("\n"),

  "functional":[
    "<ul class='test-stripe'>",
    "<li>even</li>",
    "<li>odd</li>",
    "<li>even</li>",
    "<li>odd</li>",
    "</ul>"
  ].join("\n"),

  "plain":[
    Snipet["ruby"],
    "<p>" + Text["long"] + "</p>",
    "<p>" + Text["middle"] + "</p>",
    "<p>" + Text["short"] + "</p>"
  ].join(""),

  "baseline":[
    "<h3><ruby>日本<rt>にほん</rt></ruby>と<ruby>漢字<rt>かんじ</rt></ruby></h3>",
    Snipet["ruby"],
    "これは<span class='x-large'>大きい</span>文字",
    "<p><a href='#'><ruby>漢字<rt>かんじ</rt></ruby></a>と<a href='#'><span class='xx-large'><ruby>日本<rt>にほん</rt></ruby></span></a>と<a href='#3'><span class='empha-dot-open'>圏点</span></a>です。</p>",
    "<a href='#'><ruby>漢字<rt>かんじ</rt></ruby></a>と<a href='#'><span class='xx-large'><ruby>日本<rt>にほん</rt></ruby></span></a>と<a href='#3'><span class='empha-dot-open'>圏点</span></a>です。",
    "<ruby>漢字<rt>かんじ</rt></ruby>と<span class='xx-large'><ruby>日本<rt>にほん</rt></ruby></span>と<span class='empha-dot-open'>圏点</span>です。",
    "<ruby>漢字<rt>かんじ</rt></ruby>と<ruby>日本<rt>にほん</rt></ruby>と<span class='empha-dot-open'>圏点</span>です。"
  ].join("<br />\n"),

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
    "<img class='disp-block float-start' src='128x128.gif' width='128' height='128' />",
    Text["long"],
    "<img class='disp-block float-end' src='128x128.gif' width='128' height='128' />",
    Text["long"],
    "<img class='disp-block float-start gap-end' width='128' height='128' src='128x128.gif' />",
    "<p>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをんあいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをんあいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</p>",
    "<p>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをんあいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをんあいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</p>"
  ].join(""),

  "float-clear-start":[
    Snipet["float"],
    Text["short"],
    "<div class='clear-start'>" + Text["middle"] + "</div>"
  ].join(""),

  "float-clear-end":[
    Snipet["float"],
    Text["short"],
    "<div class='clear-end'>" + Text["middle"] + "</div>"
  ].join(""),

  "float-clear-both":[
    Snipet["float"],
    Text["short"],
    "<div class='clear-both'>" + Text["middle"] + "</div>"
  ].join(""),

  "table":[
    "<table>",
    "<thead>",
    "<tr>",
    "<th>head1</th><th>head2</th><th>head3</th>",
    "</tr>",
    "</thead>",

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

    "<tfoot>",
    "<tr>",
    "<td>foot1</td>",
    "<td>foot2</td>",
    "</tr>",
    "</tfoot>",
    "</table>"
  ].join("\n"),

  "table-auto":[
    // table1(long, short, middle)
    "<table style='table-layout:auto'>",
    "<thead>",
    "<tr>",
    "<th>head1</th><th>head2</th><th>head3</th>",
    "</tr>",
    "</thead>",

    "<tbody>",
    "<tr>",
    "<td>" + Text["long"] + "</td><td>hige</td><td>hoge</td>",
    "</tr>",
    "<tr>",
    "<td>ohoho</td><td>ahaha</td><td>あいうえおかきく</td>",
    "</tr>",
    "<tr>",
    "<td>123</td><td>456</td><td>789</td>",
    "</tr>",
    "</tbody>",

    "</table>",

    // table2(long, short, short)
    "<table style='table-layout:auto'>",
    "<thead>",
    "<tr>",
    "<th>head4</th><th>head5</th><th>head6</th>",
    "</tr>",
    "</thead>",

    "<tbody>",
    "<tr>",
    "<td>" + Text["long"] + "</td><td>hige</td><td>hoge</td>",
    "</tr>",
    "<tr>",
    "<td>ohoho</td><td>ahaha</td><td>hehehe</td>",
    "</tr>",
    "</tbody>",
    "</table>",
    
    // table3(long, short, long)
    "<table style='table-layout:auto'>",
    "<thead>",
    "<tr>",
    "<th>head7</th><th>head8</th><th>head9</th>",
    "</tr>",
    "</thead>",

    "<tbody>",
    "<tr>",
    "<td>" + Text["long"] + "</td><td>hige</td><td>hoge</td>",
    "</tr>",
    "<tr>",
    "<td>ohoho</td><td>ahaha</td><td>" + Text["long"] + "</td>",
    "</tr>",
    "</tbody>",
    "</table>",

    // table4(long, too short, long, middle)
    "<table style='table-layout:auto'>",
    "<thead>",
    "<tr>",
    "<th>long1</th><th>0</th><th>long2</th><th>middle1</th>",
    "</tr>",
    "</thead>",

    "<tbody>",
    "<tr>",
    "<td>" + Text["long"] + "</td><td>a</td><td>" + Text["long"] + "</td><td>" + Text["middle"] + "</td>",
    "</tr>",
    "</tbody>",
    "</table>"
  ].join("\n"),

  "ouside-list":[
    Snipet["ul"],
    Snipet["ol"],
    Snipet["dl"]
  ].join("\n"),

  "inside-list":[
    "<div class='lst-inside'>",
    Snipet["ul"],
    Snipet["ol"],
    "</div>"
  ].join("\n"),

  "flip-flow":[
    "<p>" + Text["long"] + "</p>",
    "<div class='flow-flip'>" + Text["long"] + Text["long"] + Text["long"] + "</div>",
    "<p>" + Text["middle"] + "</p>",
    "<div class='flow-flip'>" + Text["long"] + "</div>",
    "<p>" + Text["long"] + "</p>",
    "<p class='flow-flip' width='100' height='100'>" + Text["short"] + "</p>",
    Text["long"]
  ].join(""),

  "callback":[
    "<p>" + Text["middle"] + "</p>",
    "<div class='my-callback'>" + Text["short"] + "</div>"
  ].join(""),

  "text-align":[
    "<p class='ta-start'>先頭寄せ</p>",
    "<p class='ta-center'>中央寄せ</p>",
    "<p class='ta-end'>後方寄せ</p>",
    "<h4>with justify</h4>",
    "<p class='ta-justify'>" + Text["middle2"] + "</p>",
    "<h4>without justify</h4>",
    "<p>" + Text["middle2"] + "</p>"
  ].join(""),

  "iblock":[
    "<div style='background-color:red' class='disp-iblock' width='100' height='100'>hello<br/>iblock</div>",
    Text["middle"],
    "<div style='background-color:gold' class='disp-iblock' width='100' height='100'>iblock2</div>",
    Text["middle"]
  ].join(""),

  "pre":[
    "<pre>",
    Text["short"],
    Text["middle"],
    "</pre>"
  ].join("\n"),

  "page-break":[
    "page one",
    "<page-break>",
    "page two",
    "<end-page>",
    "page three",
    "<pbr>",
    "page four",
    "<hr class='break-after'/>",
    "page five",
    "<div style='break-before:always'>page six</div>",
    "<div class='break-before'>page seven</div>",
    "<div class='break-after'>page seven2</div>",
    "page eight"
  ].join("\n"),

  "hr":[
    Text["short"],
    "<hr />",
    Text["short"],
    "<hr class='space'>",
    Text["short"]
  ].join(""),

  "kerning":[
    "「「あああ。」」「ははは」あああ、、",
    "「「あああ。」」「ははは」あああ、、"
  ].join(""),

  "tcy":[
    "平成<span class='tcy'>25</span>年<span class='tcy'>1</span>月<span class='tcy'>10</span>日<span class='tcy'>!!</span>"
  ].join(""),

  "link":[
    "あああ<a data-id='10' href='#' name='anchor1'>いいいい</a>",
    "open <a data-id='0' href='http://google.com/' target='_blank'>new window</a>",
    "<a href='#anchor1'>link to anchor</a>"
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
    "これは<span class='empha-dot-open'>圏点</span>です。",
    "これは<span class='empha-dot-filled'>圏点</span>です。",
    "これは<span class='empha-circle-open'>圏点</span>です。",
    "これは<span class='empha-circle-filled'>圏点</span>です。",
    "これは<span class='empha-double-circle-open'>圏点</span>です。",
    "これは<span class='empha-double-circle-filled'>圏点</span>です。",
    "これは<span class='empha-triangle-open'>圏点</span>です。",
    "これは<span class='empha-triangle-filled'>圏点</span>です。",
    "これは<span class='empha-sesame-open'>圏点</span>です。",
    "これは<span class='empha-sesame-filled'>圏点</span>です。"
  ].join("<br>"),

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

  "section":[
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
  ].join(""),

  "push-pull":[
    "<img class='disp-block' src='256x256.gif' width='256' height='256' pushed />",
    Text["long"],
    "<page-break>",
    Text["long"],
    "<img class='disp-block' src='256x256.gif' width='256' height='256' pulled />"
  ].join(""),

  "pseudo-class":[
    "<h2>first/last</h2>",
    "<div class='test-pseudo'>",
    "<ul>",
    "<li>first</li>",
    "<li>second</li>",
    "<li>last</li>",
    "</ul>",
    "<p>first of type</p>",
    "<p>last of type</p>",
    "</div>",

    "<h2>only child</h2>",
    "<div class='test-pseudo-only'>",
    "<p>only child</p>",
    "</div>",

    "<h2>only of type</h2>",
    "<div class='test-pseudo-only'>",
    "<div>only of type</div>",
    "<p>child</p>",
    "</div>",

    "<h2>only of type func</h2>",
    "<div class='test-pseudo-only2'>",
    "<p></p>", // only of type
    "</div>",

    "<h2>only of type func2</h2>",
    "<div class='test-pseudo-only2'>",
    "<p></p>", // not only of type
    "<p></p>", // not only of type
    "</div>"
  ].join("\n"),

  "pseudo-element":[
    "<h2>first letter</h2>",
    "<div class='drop-caps'>",
    Text["long"],
    "</div>",
    "<page-break />",
    "<h2>first letter2</h2>",
    "<div class='drop-caps'>",
    Text["lorem"],
    "</div>",
    "<page-break />",
    "<h2>first line</h2>",
    "<div class='first-line-larger'>",
    Text["long"],
    "</div>",
    "<page-break />",
    "<h2>before, after</h2>",
    "<div class='test-before'>test for before</div>",
    "<div class='test-after'>test for after</div>"
  ].join(""),

  "pasted-attribute":[
    "<p>this is normal1</p>",
    "<div class='content-box gap-after' style='width:200px; height:200px; background-color:gold' pasted>",
    "this is pasted content",
    "</div>",
    "<p>this is normal2</p>"
  ].join("\n"),

  "tip-test":[
    "<p><tip title='click here'>tip content</tip></p>",
    "<p><tip title='タイトル'>チップの内容</tip></p>"
  ].join("\n"),

  "margin-cancel":[
    "<div style='margin-after:2em'>block1</div>",
    "<div style='margin-before:1em'>block2</div>",
    "<div style='margin-after:1em'>block1</div>",
    "<div style='margin-before:1em'>block2</div>",
    "<div style='margin-after:1em'>block1</div>",
    "<div style='margin-before:2em'>block2</div>"
  ].join("\n"),

  "word-break":[
    "<h2>word break all</h2>",
    "<p style='word-break:break-all'>" + Text["lorem"] + "</p>",
    "<h2>word break normal</h2>",
    "<p style='word-break:normal'>" + Text["lorem"] + "</p>"
  ].join("\n"),

  "speak-test":[
    "<speak name='太郎'>" + Text["middle"] + "</speak>",
    "<speak src='128x128.gif'>" + Text["long"] + "</speak>"
  ].join("\n"),

  "gravatar-test":[
    "<h2>my gravatar</h2>",
    "<gravatar size='64' email='someone@example.com'>",
    "<div>" + Text["middle"] + "</div>",
    "<h2>my gravator floated</h2>",
    "<gravatar class='float-start disp-block' size='64' email='someone@example.com'>",
    "<div>" + Text["middle"] + "</div>"
  ].join("\n"),

  "pasted-test":[
    "<pasted size='150x200' style='background-color:orange'>",
    "<p>this is pasted content!!!</p>",
    "</pasted>"
  ].join("\n"),

  "circular":[
    "<circular active='3'></circular>",
    "after text"
  ].join(""),

  "prettify":[
    "<pre class='prettify'>",
    "var foo = 'hello, prettify!';",
    "var hoo = function(){",
    "  alert('hoo');",
    "};",
    "</pre>"
  ].join("\n"),

  "white-space":[
    "<h3>double space</h3>",
    "<pre>a  b</pre>",
    "<div>a  b</div>",

    "<h3>double thinsp</h3>",
    "<pre>a&thinsp;&thinsp;b</pre>",
    "<div>a&thinsp;&thinsp;b</div>",

    "<h3>double nbsp</h3>",
    "<pre>a&nbsp;&nbsp;b</pre>",
    "<div>a&nbsp;&nbsp;b</div>",

    "<h3>double ensp</h3>",
    "<pre>a&ensp;&ensp;b</pre>",
    "<div>a&ensp;&ensp;b</div>",

    "<h3>double emsp</h3>",
    "<pre>a&emsp;&emsp;b</pre>",
    "<div>a&emsp;&emsp;b</div>",

    "<h3>tab space</h3>",
    "<pre>a&#09;b</pre>",
    "<div>a&#09;b</div>"
  ].join("\n")
};

