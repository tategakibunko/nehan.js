var LogicalBreaks = {
  before:{
    always:(new LogicalBreak("always")),
    avoid:(new LogicalBreak("avoid")),
    first:(new LogicalBreak("first")), // correspond to break-before:"left"
    second:(new LogicalBreak("second")) // correspond to break-before:"right"
  },
  after:{
    always:(new LogicalBreak("always")),
    avoid:(new LogicalBreak("avoid")),
    first:(new LogicalBreak("first")), // correspond to break-before:"left"
    second:(new LogicalBreak("second")) // correspond to break-before:"right"
  },
  getBefore : function(value){
    return this.before[value] || null;
  },
  getAfter : function(value){
    return this.after[value] || null;
  }
};

