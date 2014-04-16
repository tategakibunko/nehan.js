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
      "<ul class='nehan-lst-circle'>",
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
      "<ol class='nehan-lst-lower-alpha'>",
      "<li>" + Text["middle"] + "</li>",
      "<li>" + Text["long"] + "</li>",
      "</ol>"
    ].join("") + "</li>",
    "<li>" + Text["short"] + "</li>",
    "<li>" + Text["middle"] + "</li>",
    "<li>" + Text["long"] + "</li>",
    "</ol>"
  ].join(""),

  "dummy":""
};

