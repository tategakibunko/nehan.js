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
    "<p class='nehan-float-start' style='measure:100px; background:gray'>",
    "短い長さの前方コンテンツ",
    "</p>",
    
    "<p class='nehan-float-start' style='measure:80px; background:red'>",
    "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
    "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
    "</p>",

    "<p class='nehan-float-end' style='measure:60px; background:green'>",
    "一つ目の後方に回り込まれるコンテンツ",
    "</p>",

    "<p class='nehan-float-end' style='measure:50px; background:yellow'>",
    "二つ目の後方コンテンツ",
    "</p>"

  ].join(""),

  "ul":[
    "<ul>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + [
      "hoge",
      "<ul class='nehan-lst-circle'>",
      "<li>" + Text["middle"] + "</li>",
      "<li>" + Text["long"] + "</li>",
      "</ul>"
    ].join("") + "</li>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + Text["middle"] + "</li>",
    "<li>" + Text["long"] + "</li>",
    "</ul>"
  ].join("\n"),

  "ol":[
    "<ol>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + [
      "hoge",
      "<ol class='nehan-lst-lower-alpha'>",
      "<li>" + Text["middle"] + "</li>",
      "<li>" + Text["long"] + "</li>",
      "</ol>"
    ].join("") + "</li>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + Text["middle"] + "</li>",
    "<li>" + Text["long"] + "</li>",
    "</ol>",

    "<ol>",
    "<li>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</li>",
    "<li>あいうえおかきくけこ</li>",
    "<li>",
    "<ol class='nehan-lst-lower-greek'>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "</li>",
    "<li>あいうえお</li>",
    "</ol>",
    "<ol class='nehan-lst-none'>",
    "<li>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</li>",
    "<li>あいうえおかきくけこ</li>",
    "</ol>",
    "<ol class='nehan-lst-cjk-ideographic'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='nehan-lst-hiragana'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='nehan-lst-lower-alpha'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='nehan-lst-lower-roman'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>"
  ].join("\n"),

  "dl":[
    "<dl>",
    "<dt>hoge</dt>",
    "<dd>" + Text["long"] + "</dd>",
    "</dl>"
  ].join(""),

  "list_item_12_phrase":[
    "<li>1番目の子</li>",
    "<li>2番目の子</li>",
    "<li>3番目の子</li>",
    "<li>4番目の子</li>",
    "<li>5番目の子</li>",
    "<li>6番目の子</li>",
    "<li>7番目の子</li>",
    "<li>8番目の子</li>",
    "<li>9番目の子</li>",
    "<li>10番目の子</li>",
    "<li>11番目の子</li>",
    "<li>12番目の子</li>",
  ].join(""),

  "list_item_12":[
    "<li>1</li>",
    "<li>2</li>",
    "<li>3</li>",
    "<li>4</li>",
    "<li>5</li>",
    "<li>6</li>",
    "<li>7</li>",
    "<li>8</li>",
    "<li>9</li>",
    "<li>10</li>",
    "<li>11</li>",
    "<li>12</li>",
  ].join(""),

  "dummy":""
};

