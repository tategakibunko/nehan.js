var ReferenceTokenStream = TokenStream.extend({
  init : function(stream, start, end){
    this.tokens = stream.tokens;
    this.lexer = stream.lexer;
    this.stream = stream;
    this.pos = start;
    this.end = end;
    this.eof = true;
  },
  setRefSrcPos : function(pos){
    this.stream.setPos(pos);
  },
  doBuffer : function(){
    // do nothing
  },
  hasNext : function(){
    return this.pos < this.end;
  },
  isEnd : function(){
    return this.pos >= this.end;
  }
});