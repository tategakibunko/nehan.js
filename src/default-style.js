/**
 @namespace Nehan.DefaultStyle
 */
Nehan.DefaultStyle = (function(){
  var __table_head_bg_color = "#f9fafb";
  var __table_border_color = "rgba(34,36,38,.15)";
  var __hr_border_color = "rgba(34,36,38,.15)";
  var __header_margin = function(ctx){
    var em = ctx.getParentFont().size;
    var rem = ctx.getRootFont().size;
    var before = (ctx.getCurExtent() === 0)? 0 : Math.floor(2 * rem - 0.14285 * em);
    var after = rem;
    return {
      before:before,
      after:after
    };
  };
  return {
    create : function(){
      return {
	//-------------------------------------------------------
	// tag / a
	//-------------------------------------------------------
	"a":{
	  "display":"inline"
	},
	"abbr":{
	  "display":"inline"
	},
	"address":{
	  "display":"inline",
	  "font-style":"italic"
	},
	"area":{
	},
	"article":{
	  "display":"block"
	},
	"aside":{
	  "display":"block"
	},
	"audio":{
	},
	//-------------------------------------------------------
	// tag / b
	//-------------------------------------------------------
	"b":{
	  "display":"inline",
	  "font-weight":"bold"
	},
	"base":{
	  "display":"none"
	},
	"bdi":{
	  "display":"inline"
	},
	"bdo":{
	  "display":"inline"
	},
	"blockquote":{
	  "color":"#666666",
	  "display":"block",
	  "padding":{
	    "start":"1em",
	    "end":"1em",
	    "before":"0.5em",
	    "after":"0.5em"
	  },
	  "margin":{
	    "after":"1.5em"
	  }
	},
	"body":{
	  "display":"block",
	  "flow":"lr-tb",
	  "box-sizing":"content-box",
	  "hanging-punctuation":"allow-end",
	  "text-align":"justify"
	},
	"br":{
	  "display":"inline"
	},
	"button":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / c
	//-------------------------------------------------------
	"canvas":{
	  "display":"inline"
	},
	"caption":{
	  "display":"table-caption",
	  "text-align":"center",
	  "margin":{
	    "after":"0.5em"
	  }
	},
	"cite":{
	  "display":"inline"
	},
	"code":{
	  "display":"inline"
	},
	"col":{
	  "display":"table-column"
	},
	"colgroup":{
	  "display":"table-column-group"
	},
	"command":{
	},
	//-------------------------------------------------------
	// tag / d
	//-------------------------------------------------------
	"datalist":{
	},
	"dd":{
	  "display":"block",
	  "margin":{
	    "start":"1em",
	    "end":"1em",
	    "after":"1.6em"
	  }
	},
	"del":{
	  "color":"#666666",
	  "display":"inline"
	},
	"details":{
	  "display":"block"
	},
	"dfn":{
	  "display":"inline",
	  "font-style":"italic"
	},
	"div":{
	  "display":"block"
	},
	"dl":{
	  "display":"block"
	},
	"dt":{
	  "display":"block",
	  "font-weight":"bold",
	  "margin":{
	    "after":"1em"
	  }
	},
	//-------------------------------------------------------
	// tag / e
	//-------------------------------------------------------
	"em":{
	  "display":"inline",
	  "font-style":"italic"
	},
	"embed":{
	},
	//-------------------------------------------------------
	// tag / f
	//-------------------------------------------------------
	"fieldset":{
	  "display":"block",
	  "padding":{
	    "start":"1em",
	    "end":"0.2em",
	    "before":"0.2em",
	    "after":"1em"
	  },
	  "margin":{
	    "after":"1.5em"
	  },
	  "border-width":"1px"
	},
	"figure":{
	  "display":"block"
	},
	"figcaption":{
	  "display":"block",
	  "text-align":"center",
	  "font-size": "0.8em"
	},
	"footer":{
	  "display":"block"
	},
	// need to define to keep compatibility.
	"font":{
	  "display":"inline"
	},
	"form":{
	  "display":"block"
	},
	//-------------------------------------------------------
	// tag / h
	//-------------------------------------------------------
	"h1":{
	  "display":"block",
	  "font-size":Nehan.Config.headerFontSizes.h1,
	  "font-weight":"bold",
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"h2":{
	  "display":"block",
	  "font-size":Nehan.Config.headerFontSizes.h2,
	  "font-weight":"bold",
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"h3":{
	  "display":"block",
	  "font-size":Nehan.Config.headerFontSizes.h3,
	  "font-weight":"bold",
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"h4":{
	  "display":"block",
	  "font-size":Nehan.Config.headerFontSizes.h4,
	  "font-weight":"bold",
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"h5":{
	  "display":"block",
	  "font-size":Nehan.Config.headerFontSizes.h5,
	  "font-weight":"bold",
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"h6":{
	  "display":"block",
	  "font-weight":"bold",
	  "font-size":Nehan.Config.headerFontSizes.h6,
	  "line-height":Nehan.Config.headerLineHeight,
	  "margin":__header_margin
	},
	"head":{
	  "display":"none"
	},
	"header":{
	  "display":"block"
	},
	"hr":{
	  "display":"block",
	  "box-sizing":"content-box",
	  "border-color":__hr_border_color,
	  "border-style":"solid",
	  "line-height":"1",
	  "margin":{
	    "after":"1em"
	  },
	  "extent":"1px",
	  "border-width":{
	    "after":"1px"
	  }
	},
	"hr.space":{
	  "border-width":"0px"
	},
	"hr.break-before":{
	  "border-width":"0px"
	},
	"hr.break-after":{
	  "border-width":"0px"
	},
	"html":{
	  "display":"block"
	},
	//-------------------------------------------------------
	// tag / i
	//-------------------------------------------------------
	"i":{
	  "display":"inline"
	},
	"iframe":{
	  "display":"block"
	},
	"ins":{
	},
	"img":{
	  "box-sizing":"content-box",
	  "display":"inline"
	},
	"input":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / k
	//-------------------------------------------------------
	"kbd":{
	  "display":"inline"
	},
	"keygen":{
	  "display":"none"
	},
	//-------------------------------------------------------
	// tag / l
	//-------------------------------------------------------
	"label":{
	  "display":"inline"
	},
	"legend":{
	  "display":"block",
	  "font-weight":"bold",
	  "line-height":"1.5"
	},
	"li":{
	  "display":"list-item",
	  "margin":{
	    "after":"0.6em"
	  }
	},
	"link":{
	},
	//-------------------------------------------------------
	// tag / m
	//-------------------------------------------------------
	"main":{
	  "display":"block"
	},
	"map":{
	},
	"mark":{
	  "display":"inline"
	},
	"menu":{
	  "display":"block"
	},
	"meta":{
	},
	"meter":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / n
	//-------------------------------------------------------
	"nav":{
	  "display":"block"
	},
	"noscript":{
	},
	//-------------------------------------------------------
	// tag / o
	//-------------------------------------------------------
	"object":{
	  "display":"inline"
	},
	"ol":{
	  "display":"block",
	  "list-style-image":"none",
	  "list-style-position": "outside",
	  "list-style-type": "decimal",
	  "margin":{
	    "before":"1em"
	  }
	},
	"optgroup":{
	},
	"option":{
	},
	"output":{
	},
	//-------------------------------------------------------
	// tag / p
	//-------------------------------------------------------
	"p":{
	  "display":"block",
	  "margin":{
	    "after":"1rem"
	  }
	},
	"param":{
	  "display":"none"
	},
	"pre":{
	  "display":"block",
	  "white-space":"pre"
	},
	"progress":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / q
	//-------------------------------------------------------
	"q":{
	  "display":"block"
	},
	//-------------------------------------------------------
	// tag / r
	//-------------------------------------------------------
	"rb":{
	  "display":"inline"
	},
	"rp":{
	  "display":"inline"
	},
	"ruby":{
	  "display":"inline"
	},
	"rt":{
	  "font-size":"0.5em",
	  "line-height":"1.0",
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / s
	//-------------------------------------------------------
	"s":{
	  "display":"inline"
	},
	"samp":{
	  "display":"inline"
	},
	"script":{
	  "display":"inline"
	},
	"section":{
	  "display":"block"
	},
	"select":{
	},
	"small":{
	  "display":"inline",
	  "font-size":"0.8em"
	},
	"source":{
	  "display":"none"
	},
	"span":{
	  "display":"inline"
	},
	"strong":{
	  "display":"inline",
	  "font-weight":"bold"
	},
	"style":{
	  "display":"inline"
	},
	"sub":{
	  "display":"inine"
	},
	"summary":{
	  "display":"inline"
	},
	"sup":{
	  "display":"inine"
	},
	//-------------------------------------------------------
	// tag / t
	//-------------------------------------------------------
	"table":{
	  "display":"table",
	  "table-layout":"fixed",
	  //"table-layout":"auto",
	  "background-color":"white",
	  "border-collapse":"collapse", // 'separate' is not supported yet.
	  "border-color":__table_border_color,
	  "border-style":"solid",
	  //"border-spacing":"5px", // TODO: support batch style like "5px 10px".
	  "border-width":"1px",
	  "margin":{
	    "start":"0.5em",
	    "end":"0.5em",
	    "after":"1.6em"
	  }
	},
	"tbody":{
	  "display":"table-row-group",
	  "border-collapse":"inherit"
	},
	"td":{
	  "display":"table-cell",
	  "border-width":"1px",
	  "border-color":__table_border_color,
	  "border-collapse":"inherit",
	  "border-style":"solid",
	  "padding":{
	    "start":"0.5em",
	    "end":"0.5em",
	    "before":"0.4em",
	    "after":"0.4em"
	  }
	},
	"textarea":{
	  "display":"inline"
	},
	"tfoot":{
	  "display":"table-footer-group",
	  "border-width":"1px",
	  "border-color":__table_border_color,
	  "border-collapse":"inherit",
	  "border-style":"solid",
	  "font-style":"italic"
	},
	"th":{
	  "display":"table-cell",
	  "line-height":Nehan.Config.headerLineHeight,
	  "border-width":"1px",
	  "border-color":__table_border_color,
	  "border-collapse":"inherit",
	  "border-style":"solid",
	  "padding":{
	    "start":"0.5em",
	    "end":"0.5em",
	    "before":"0.4em",
	    "after":"0.4em"
	  }
	},
	"thead":{
	  "display":"table-header-group",
	  "font-weight":"bold",
	  "background-color":__table_head_bg_color,
	  "border-width":"1px",
	  "border-color":__table_border_color,
	  "border-collapse":"inherit",
	  "border-style":"solid"
	},
	"time":{
	  "display":"inline"
	},
	"title":{
	},
	"tr":{
	  "display":"table-row",
	  "border-collapse":"inherit",
	  "border-color":__table_border_color,
	  "border-width":"1px",
	  "border-style":"solid"
	},
	"track":{
	},
	//-------------------------------------------------------
	// tag / u
	//-------------------------------------------------------
	"u":{
	  "display":"inline"
	},
	"ul":{
	  "display":"block",
	  "list-style-image":"none",
	  "list-style-type":"disc",
	  "list-style-position":"outside",
	  "margin":{
	    "before":"1em"
	  }
	},
	//-------------------------------------------------------
	// tag / v
	//-------------------------------------------------------
	"var":{
	  "display":"inline"
	},
	"video":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / w
	//-------------------------------------------------------
	"wbr":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// tag / others
	//-------------------------------------------------------
	"?xml":{
	},
	"!doctype":{
	},
	// <page-break> is nehan.js original tag.
	"page-break":{
	  "display":"inline"
	},
	//-------------------------------------------------------
	// rounded corner
	//-------------------------------------------------------
	".rounded":{
	  "padding":{
	    before:"1.6em",
	    end:"1.0em",
	    after:"1.6em",
	    start:"1.0em"
	  },
	  "border-radius":"10px"
	},
	//-------------------------------------------------------
	// font-size classes
	//-------------------------------------------------------
	".xx-large":{
	  "font-size": Nehan.Config.absFontSizes["xx-large"]
	},
	".x-large":{
	  "font-size": Nehan.Config.absFontSizes["x-large"]
	},
	".large":{
	  "font-size": Nehan.Config.absFontSizes.large
	},
	".medium":{
	  "font-size": Nehan.Config.absFontSizes.medium
	},
	".small":{
	  "font-size": Nehan.Config.absFontSizes.small
	},
	".x-small":{
	  "font-size": Nehan.Config.absFontSizes["x-small"]
	},
	".xx-small":{
	  "font-size": Nehan.Config.absFontSizes["xx-small"]
	},
	".larger":{
	  "font-size": Nehan.Config.absFontSizes.larger
	},
	".smaller":{
	  "font-size": Nehan.Config.absFontSizes.smaller
	},
	//-------------------------------------------------------
	// box-sizing classes
	//-------------------------------------------------------
	".content-box":{
	  "box-sizing":"content-box"
	},
	".border-box":{
	  "box-sizing":"border-box"
	},
	".margin-box":{
	  "box-sizing":"margin-box"
	},
	//-------------------------------------------------------
	// display classes
	//-------------------------------------------------------
	".disp-none":{
	  "display":"none"
	},
	".disp-block":{
	  "display":"block"
	},
	".disp-inline":{
	  "display":"inline"
	},
	".disp-iblock":{
	  "display":"inline-block"
	},
	//-------------------------------------------------------
	// text-align classes
	//-------------------------------------------------------
	".ta-start":{
	  "text-align":"start"
	},
	".ta-center":{
	  "text-align":"center"
	},
	".ta-end":{
	  "text-align":"end"
	},
	".ta-justify":{
	  "text-align":"justify"
	},
	//-------------------------------------------------------
	// float classes
	//-------------------------------------------------------
	".float-start":{
	  "float":"start"
	},
	".float-end":{
	  "float":"end"
	},
	//-------------------------------------------------------
	// float classes
	//-------------------------------------------------------
	".clear-start":{
	  "clear":"start"
	},
	".clear-end":{
	  "clear":"end"
	},
	".clear-both":{
	  "clear":"both"
	},
	//-------------------------------------------------------
	// flow classes
	//-------------------------------------------------------
	".flow-lr-tb":{
	  "flow":"lr-tb"
	},
	".flow-tb-rl":{
	  "flow":"tb-rl"
	},
	".flow-tb-lr":{
	  "flow":"tb-lr"
	},
	".flow-rl-tb":{
	  "flow":"rl-tb"
	},
	".flow-flip":{
	  "flow":"flip"
	},
	//-------------------------------------------------------
	// list-style-position classes
	//-------------------------------------------------------
	".lsp-inside":{
	  "list-style-position":"inside"
	},
	".lsp-outside":{
	  "list-style-position":"outside"
	},
	//-------------------------------------------------------
	// list-style-type classes
	//-------------------------------------------------------
	".lst-none":{
	  "list-style-type":"none"
	},
	".lst-decimal":{
	  "list-style-type":"decimal"
	},
	".lst-disc":{
	  "list-style-type":"disc"
	},
	".lst-circle":{
	  "list-style-type":"circle"
	},
	".lst-square":{
	  "list-style-type":"square"
	},
	".lst-decimal-leading-zero":{
	  "list-style-type":"decimal-leading-zero"
	},
	".lst-lower-alpha":{
	  "list-style-type":"lower-alpha"
	},
	".lst-upper-alpha":{
	  "list-style-type":"upper-alpha"
	},
	".lst-lower-latin":{
	  "list-style-type":"lower-latin"
	},
	".lst-upper-latin":{
	  "list-style-type":"upper-latin"
	},
	".lst-lower-roman":{
	  "list-style-type":"lower-roman"
	},
	".lst-upper-roman":{
	  "list-style-type":"upper-roman"
	},
	".lst-lower-greek":{
	  "list-style-type":"lower-greek"
	},
	".lst-upper-greek":{
	  "list-style-type":"upper-greek"
	},
	".lst-cjk-ideographic":{
	  "list-style-type":"cjk-ideographic"
	},
	".lst-hiragana":{
	  "list-style-type":"hiragana"
	},
	".lst-hiragana-iroha":{
	  "list-style-type":"hiragana-iroha"
	},
	".lst-katakana":{
	  "list-style-type":"katakana"
	},
	".lst-katakana-iroha":{
	  "list-style-type":"katakana-iroha"
	},
	//-------------------------------------------------------
	// text-combine-upright
	//-------------------------------------------------------
	".tcy":{
	  "text-combine-upright":"horizontal"
	},
	//-------------------------------------------------------
	// text emphasis
	//-------------------------------------------------------
	".empha-dot-filled":{
	  "text-emphasis-style":"filled dot"
	},
	".empha-dot-open":{
	  "text-emphasis-style":"open dot"
	},
	".empha-circle-filled":{
	  "text-emphasis-style":"filled circle"
	},
	".empha-circle-open":{
	  "text-emphasis-style":"open circle"
	},
	".empha-double-circle-filled":{
	  "text-emphasis-style":"filled double-circle"
	},
	".empha-double-circle-open":{
	  "text-emphasis-style":"open double-circle"
	},
	".empha-triangle-filled":{
	  "text-emphasis-style":"filled triangle"
	},
	".empha-triangle-open":{
	  "text-emphasis-style":"open triangle"
	},
	".empha-sesame-filled":{
	  "text-emphasis-style":"filled sesame"
	},
	".empha-sesame-open":{
	  "text-emphasis-style":"open sesame"
	},
	//-------------------------------------------------------
	// break
	//-------------------------------------------------------
	".break-before":{
	  "break-before":"always"
	},
	".break-after":{
	  "break-after":"always"
	},
	//-------------------------------------------------------
	// word-break
	//-------------------------------------------------------
	".wb-all":{
	  "word-break":"break-all"
	},
	".wb-normal":{
	  "word-break":"normal"
	},
	".wb-keep":{
	  "word-break":"keep-all"
	},
	//-------------------------------------------------------
	// combination
	//-------------------------------------------------------
	"ul ul":{
	  margin:{before:"0"}
	},
	"ul ol":{
	  margin:{before:"0"}
	},
	"ol ol":{
	  margin:{before:"0"}
	},
	"ol ul":{
	  margin:{before:"0"}
	},
	//-------------------------------------------------------
	// other utility classes
	//-------------------------------------------------------
	".drop-caps::first-letter":{
	  "display":"block",
	  "box-sizing":"content-box",
	  "float":"start",
	  "font-size":"4em",
	  "measure":"1em",
	  "extent":"1em",
	  "padding":{before:"0.1em"},
	  "line-height":"1",
	  "onload":function(ctx){
	    if(ctx.isTextVertical()){
	      return;
	    }
	    var markup = ctx.getMarkup();
	    var font = ctx.getFont();
	    var spacing = Math.floor(font.size * 0.1);
	    var measure = Nehan.TextMetrics.getMeasure(font, markup.getContent());
	    ctx.setCssAttr("measure", (measure + spacing) + "px");
	  }
	},
	".gap-start":{
	  "margin":{
	    "start":"1em"
	  }
	},
	".gap-end":{
	  "margin":{
	    "end":"1em"
	  }
	},
	".gap-after":{
	  "margin":{
	    "after":"1em"
	  }
	},
	".gap-before":{
	  "margin":{
	    "before":"1em"
	  }
	}
      };
    } // function : create(){
  }; // return
})();
