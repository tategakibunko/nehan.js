/**
   @namespace Nehan.WordBreaks
*/
Nehan.WordBreaks = {
  "keep-all":(new Nehan.WordBreak("keep-all")),
  "normal":(new Nehan.WordBreak("normal")),
  "break-all":(new Nehan.WordBreak("break-all")),
  "loose":(new Nehan.WordBreak("loose")),
  "break-strict":(new Nehan.WordBreak("break-strict")),
  getInitialValue : function(){
    return this["normal"];
  },
  getByName : function(name){
    return this[name] || null;
  }
};
