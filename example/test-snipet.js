// various text data
var Snipet = {
  "ruby":[
    "<p>",
    "<ruby>漢字<rt>かんじ</rt></ruby>と<span class='xx-large'><ruby>日本<rt>にほん</rt></ruby></span>と<span class='empha-dot-open'>圏点</span>です。",
    "</p>"
  ].join(""),

  "ruby2":[
    "<p>",
    "<ruby>漢字<rt>かんじ</rt></ruby>と<ruby>日本<rt>にほん</rt></ruby>。",
    "</p>"
  ].join(""),

  "float":[
    "<p class='float-start' style='measure:100px; background:gray'>",
    "短い長さの前方コンテンツ",
    "</p>",
    
    "<p class='float-start' style='measure:80px; background:red'>",
    "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
    "先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる先頭に回り込まれる",
    "</p>",

    "<p class='float-end' style='measure:60px; background:green'>",
    "一つ目の後方に回り込まれるコンテンツ",
    "</p>",

    "<p class='float-end' style='measure:50px; background:yellow'>",
    "二つ目の後方コンテンツ",
    "</p>"

  ].join(""),

  "ul":[
    "<ul>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + [
      "hoge",
      "<ul class='lst-circle'>",
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
      "<ol class='lst-lower-alpha'>",
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
    "<ol class='lst-lower-greek'>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "</li>",
    "<li>あいうえお</li>",
    "</ol>",
    "<ol class='lst-none'>",
    "<li>あいうえおかきくけこさしすせそなにぬねのはひふへほまみむめもやゆよわをん</li>",
    "<li>あいうえおかきくけこ</li>",
    "</ol>",
    "<ol class='lst-cjk-ideographic'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='lst-hiragana'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='lst-lower-alpha'>",
    "<li>あいうえお</li>",
    "<li>かきくけこ</li>",
    "<li>さしすせそ</li>",
    "</ol>",
    "<ol class='lst-lower-roman'>",
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

  "dummy":""
};

