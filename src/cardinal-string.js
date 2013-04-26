var CardinalString = (function(){
  // table : character table starts from the character equivalent to 'one'.
  // for example, ['1','2','3','4','5','6','7','8','9','0'] when normal decimal.
  function CardinalString(table, is_zenkaku){
    this.table = table;
    this._isZenkaku = is_zenkaku;
  }

  CardinalString.prototype = {
    isZenkaku : function(){
      return this._isZenkaku;
    },
    getBase : function(){
      return this.table.length;
    },
    getChar : function(index){
      return this.table[index] || "";
    },
    getTable : function(){
      return this.table;
    }
  };

  return CardinalString;
})();
