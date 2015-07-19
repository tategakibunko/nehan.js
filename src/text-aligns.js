/**
   pre defined text align set

   @namespace Nehan.TextAligns
*/
Nehan.TextAligns = {
  start:(new Nehan.TextAlign("start")),
  end:(new Nehan.TextAlign("end")),
  center:(new Nehan.TextAlign("center")),
  justify:(new Nehan.TextAlign("justify")),
  /**
     @memberof Nehan.TextAligns
     @param value - logical text align direction, "start" or "end" or "center".
     @return {Nehan.TextAlign}
  */
  get : function(value){
    return this[value] || null;
  }
};
