var CardinalCounter = (function(){
  function CardinalCounter(cardinal_string){
    this.cardinalString = cardinal_string;
  }

  var conv_base = function(dec_num, base){
    var dec_str = dec_num.toString(10);
    var ret = [];
    var work = dec_num;
    while(work > 0){
      ret.push(work % base);
      work = Math.floor(work / base);
    }
    return (ret.length > 0)? ret : [0];
  };

  CardinalCounter.prototype = {
    isZenkaku : function(){
      return this.cardinalString.isZenkaku();
    },
    getBase : function(){
      return this.cardinalString.getBase();
    },
    getChar : function(index){
      return this.cardinalString.getChar(index);
    },
    getString : function(dec_num){
      var base_list = conv_base(dec_num, this.getBase());
      var ret = "";
      for(var i = base_list.length - 1; i >= 0; i--){
	var digit = base_list[i];
	// when it is most significant digit,
	// num 1 refers to index 0, num 2 refers to index 1, ... and so on.
	// for example, if base 26(alphabetical order) is used, '10' is decoded to 'aa'.
	// MSD '1' not means 'b' but 'a'.
	var index = (i == base_list.length - 1 && i > 0)? digit - 1 : digit;
	ret += this.getChar(index);
      }
      return ret;
    }
  };

  return CardinalCounter;
})();

