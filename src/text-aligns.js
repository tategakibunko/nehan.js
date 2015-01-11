/**
   pre defined text align set

   @namespace Nehan.TextAligns
*/
var TextAligns = {
  start:(new TextAlign("start")),
  end:(new TextAlign("end")),
  center:(new TextAlign("center")),
  /**
     @memberof Nehan.TextAligns
     @param value - logical text align direction, "start" or "end" or "center".
     @return {Nehan.TextAlign}
  */
  get : function(value){
    return this[value] || null;
  }
};
