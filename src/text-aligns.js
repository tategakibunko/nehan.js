var TextAligns = {
  start:(new TextAlign("start")),
  end:(new TextAlign("end")),
  center:(new TextAlign("center")),
  get : function(value){
    return this[value] || null;
  }
};
