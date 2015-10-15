/*! nehan-doc.js
  All rights reserved by tategakibunko.
  web: https://github.com/tategakibunko
*/
var Ndoc = Ndoc || {};

$(function(){
  // if IE8 under, show alert message.
  var client = Nehan.Env.client;
  if(client.isIE() && client.version <= 8){
    $(".legacy-browser-alert").show();
  }

  /*
  $("#global-menu").find(".dropdown").dropdown({
    onChange:function(value, text, $choice){
      var href = $choice.attr("href") || $choice.find("a").attr("href");
      location.href = href;
    }
  });*/

  $(".nehan-reader").each(function(i, dom){
    var $dom = $(dom);
    var html = $dom.html();
    var flow = $dom.data("flow");
    new Ndoc.Reader({
      el:dom,
      data:{
	text:html, 
	flow:flow
      }
    });
  });
});




Ndoc.Settings = {
}; // TODO



Nehan.setStyles({
  body:{
    textAlign:"justify",
    width:"90%",
    height:function(){
      return Math.floor(screen.height * 55 / 100);
    }
  }
});

Ndoc.Reader = Vue.extend({
  template: "#tmpl-reader",
  data: function(){
    return {
      flow:"lr-tb",
      text:"text is not defined.",
      pageIndex:0,
      pageCount:0,
      width:400,
      height:300,
      fontSize:12
    }
  },
  computed:{
    pageNo: function(){
      return this.pageIndex + 1;
    },
    leftButtonPopup: function(){
      return this.isVert()? "forward page" : "backward page";
    },
    rightButtonPopup: function(){
      return this.isVert()? "backward page" : "forward page";
    },
    leftButtonLabel: function(){
      return this.isVert()?
	"<i class='flipped play icon'></i>":
	"<i class='backward icon'></i>";
    },
    rightButtonLabel: function(){
      return this.isVert()?
	"<i class='flipped backward icon'></i>":
	"<i class='play icon'></i>";
    },
    leftButtonColor:function(){
      return this.isVert()? "blue" : "red";
    },
    rightButtonColor:function(){
      return !this.isVert()? "blue" : "red";
    }
  },
  ready: function(){
    this.mountReader();
    this.$watch("flow", this.mountReader);
    $(this.$el).find(".popup-enabled").popup();
  },
  methods:{
    mountReader: function(){
      this.pageIndex = 0;
      this.pageCount = 0;
      this.pages = Ndoc.Utils.createPagedElement().setStyle("body", {
	"flow":this.flow,
	"width":this.width,
	"height":this.height,
	"font-size":this.fontSize,
	"word-break":((this.flow === "tb-rl")? "break-all" : "normal")
      }).setContent(this.text, {
	onProgress: function(){
	  this.pageCount++;
	}.bind(this),
	onComplete: function(time){
	  //console.log("finish %fmsec", time);
	}
      });
      $(this.$$.screen).empty().css({
	width:(this.width + 20),
	height:(this.height + 25)
      }).append(this.pages.getElement());
    },
    isVert: function(){
      return this.flow === "tb-rl";
    },
    onClickHori: function(){
      this.flow = "lr-tb";
    },
    onClickVert: function(){
      this.flow = "tb-rl";
    },
    onClickLeft: function(){
      if(this.isVert()){
	this.pages.setNextPage();
      } else {
	this.pages.setPrevPage();
      }
      this.pageIndex = this.pages.getPageNo();
    },
    onClickRight: function(){
      if(this.isVert()){
	this.pages.setPrevPage();
      } else {
	this.pages.setNextPage();
      }
      this.pageIndex = this.pages.getPageNo();
    }
  }
});

Ndoc.Utils = {
  createPagedElement: function(){
    return Nehan.createPagedElement({
      display:{
	fontImgRoot:"http://static.antiscroll.com/image/char-img"
      }
    });
  }
};

