var Breaks = {
  before:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new Break("always")),
    avoid:(new Break("avoid")),
    first:(new Break("first")), // correspond to break-before:"left"
    second:(new Break("second")) // correspond to break-before:"right"
  },
  getBefore : function(value){
    return this.before[value] || null;
  },
  getAfter : function(value){
    return this.after[value] || null;
  }
};

