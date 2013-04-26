var SectionHeader = (function(){
  function SectionHeader(rank, title, id){
    this.rank = rank;
    this.title = title;
    this._id = id || 0;
  }

  SectionHeader.prototype = {
    getId : function(){
      return this._id;
    },
    debug : function(){
      return [
	"title:" + this.title,
	"rank:" + this.rank
      ].join(", ");
    }
  };

  return SectionHeader;
})();
