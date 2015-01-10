/**
   pre defined break collection.
   @namespace Nehan.Breaks
*/
var Breaks = {
  before:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    left:(new Break("left")),
    right:(new Break("right")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    left:(new Break("left")),
    right:(new Break("right")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  /**
     @memberof Nehan.Breaks
     @param value {String} - "always", "avoid", "left", "right", "first", "second"
  */
  getBefore : function(value){
    return this.before[value] || null;
  },
  /**
     @memberof Nehan.Breaks
     @param value {String} - "always", "avoid", "left", "right", "first", "second"
  */
  getAfter : function(value){
    return this.after[value] || null;
  }
};

