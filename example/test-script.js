var Script = {
  "plain":[
    Snipet["ruby"],
    "<p>" + Text["long"] + "</p>",
    "<p>" + Text["middle"] + "</p>",
    "<p>" + Text["short"] + "</p>"
  ].join(""),

  "A+B":[
    "<div class='nehan-adj-test'>", [
      "<a href='#'>prev</a>",
      "<b>direct sibling</b>",
      "<b>next sibling</b>"
    ].join("&nbsp;"),
    "</div>"
  ].join(""),

  "A~B":[
    "<div class='nehan-gen-adj-test'>", [
      "<a href='#'>prev</a>",
      "<b>direct sibling</b>",
      "<b>next sibling</b>"
    ].join("&nbsp;"),
    "</div>"
  ].join(""),

  "flip-flow":[
    "<p>" + Text["long"] + "</p>",
    "<div class='nehan-flow-flip'>" + Text["long"] + Text["long"] + Text["long"] + "</div>",
    "<p>" + Text["middle"] + "</p>",
    "<div class='nehan-flow-flip'>" + Text["long"] + "</div>",
    "<p>" + Text["long"] + "</p>",
    "<p class='nehan-flow-flip' width='100' height='100'>" + Text["short"] + "</p>",
    Text["long"]
  ].join(""),

  "callback":[
    "<p>" + Text["middle"] + "</p>",
    "<div class='nehan-my-callback'>" + Text["short"] + "</div>"
  ].join(""),

  "text-align":[
    "<p class='nehan-ta-start'>先頭寄せ</p>",
    "<p class='nehan-ta-center'>中央寄せ</p>",
    "<p class='nehan-ta-end'>後方寄せ</p>"
  ].join(""),

  "iblock":[
    "<div style='background-color:red' width='200' height='200' class='nehan-disp-iblock'>hello<br/>iblock</div>",
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

