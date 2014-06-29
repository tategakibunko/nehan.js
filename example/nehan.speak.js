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
     - size: charactor square image size.

   example:
     <speak size='100' src='/path/to/img'>hello, world!</speak>
     <speak size='100' name='John'>hello, world!</speak>
*/
Nehan.setStyles({
  "speak":{
    "display":"table",
    "border-color":"transparent",
    "onload":function(selector_context){
      var markup = selector_context.getMarkup();
      var text = markup.getContent();
      var src = markup.getAttr("src");
      var size = parseInt(markup.getAttr("size", 100), 10);
      var name = markup.getAttr("name", "no name");

      // image is prefered(name is skipped even if it's enabled).
      if(src){
	// if enough space is not left for icon image, break current page.
	if(selector_context.getRestExtent() < size){
	  selector_context.setCssAttr("break-before", "always");
	}
	var size2 = Math.max(32, size - 2); // subtract max border size(=2)
	var icon = "<img class='nehan-disp-block' src='{{src}}' width='{{size2}}' height='{{size2}}'>".replace(/{{src}}/, src).replace(/{{size2}}/g, size2);
	markup.setContent([
	  "<tr>",
	  "<td style='measure:{{size}}'>{{icon}}</td>",
	  "<td>{{text}}</td>",
	  "</tr>"
	].join("").replace(/{{size}}/, size).replace(/{{icon}}/, icon).replace(/{{text}}/, text));
      } else {
	markup.setContent([
	  "<tr>",
	  "<td style='measure:{{size}}'>{{name}}</td>",
	  "<td>{{text}}</td>",
	  "</tr>"
	].join("").replace(/{{size}}/, size).replace(/{{name}}/, name).replace(/{{text}}/, text));
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
