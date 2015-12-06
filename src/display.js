/**
 standard page settings.
 @namespace Nehan.Display
 */
Nehan.Display = {
  /**
   @memberof Nehan.Display
   @return {string}
   */
  getVertBlockDir: function(){
    return Nehan.Config.boxFlowSet.vert.split("-")[1];
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdFont : function(){
    var font = new Nehan.Font(Nehan.Config.defaultFontSize);
    font.family = Nehan.Config.defaultFontFamily;
    font.weight = "normal";
    font.style = "normal";
    return font;
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdBoxFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.defaultBoxFlow);
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdVertFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.boxFlowSet.vert);
  },
  /**
   @memberof Nehan.Display
   @return {Nehan.BoxFlow}
   */
  getStdHoriFlow : function(){
    return Nehan.BoxFlows.getByName(Nehan.Config.boxFlowSet.hori);
  },
  /**
   @memberof Nehan.Display
   @return {int}
   */
  getRtFontSize : function(base_font_size){
    return Math.round(Nehan.Config.defaultRtRate * base_font_size);
  }
};
