/**
   pre defined break collection.
   @namespace Nehan.Breaks
*/
Nehan.Breaks = {
  before:{
    always:(new Nehan.Break("always")),
    avoid:(new Nehan.Break("avoid")),
    left:(new Nehan.Break("left")),
    right:(new Nehan.Break("right")),
    first:(new Nehan.Break("first")), // correspond to break-before:"left"
    second:(new Nehan.Break("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new Nehan.Break("always")),
    avoid:(new Nehan.Break("avoid")),
    left:(new Nehan.Break("left")),
    right:(new Nehan.Break("right")),
    first:(new Nehan.Break("first")), // correspond to break-before:"left"
    second:(new Nehan.Break("second")) // correspond to break-before:"right"
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

