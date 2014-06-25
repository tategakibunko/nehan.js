// nehan.speak.js
// Copyright(c) 2014-, Watanabe Masaki
// license: MIT

/**
   plugin name: nehan-speak
   description: display charactor and speech set like scenario script.
   tag_name: speak
   close_tag: required

   attributes:
     - name: charactor name, ignored if 'src' is set.
     - src: charactor image source path, use 'name' if not defined.

   example:
     <speak size='100' src='/path/to/img'>hello, world!</speak>
     <speak size='100' name='John'>hello, world!</speak>
*/
Nehan.setStyles({
  "speak":{
    "display":"table",
    "border-color":"transparent",
    "onload":function(scontext){
      var markup = scontext.getMarkup();
      var text = markup.getContent();
      var img = markup.getAttr("src");
      var size = markup.getAttr("size", 100);
      var name = markup.getAttr("name", "no name");

      // if image is enabled but enough space is not left, break current page.
      if(img && scontext.getRestExtent() < size){
	scontext.setCssAttr("break-before", "always");
      }
      // image is prefered(name is skipped even if it's enabled).
      if(img){
	markup.setContent([
	  "<tr>",
	  "<td style='measure:" + size + "'>",
	  "<img class='nehan-disp-block' src='" + img + "' width='" + (size - 2) + "' height='" + (size - 2) + "'>",
	  "</td>",
	  "<td>" + text + "</td>",
	  "</tr>"
	].join(""));
      } else {
	markup.setContent([
	  "<tr>",
	  "<td style='measure:" + size + "'>" + name + "</td>",
	  "<td>" + text + "</td>",
	  "</tr>"
	].join(""));
      }
    }
  },
  "speak td":{
    "border-color":"transparent"
  },
  "speak tr":{
    "border-color":"transparent"
  }
});
