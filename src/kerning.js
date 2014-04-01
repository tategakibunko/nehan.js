var Kerning = {
  set : function(token, opt){
    if(token.isKakkoStart()){
      this._setKerningStart(token, opt.prev || null);
    } else if(token.isKakkoEnd() || token.isKutenTouten()){
      this._setKerningEnd(token, opt.next || null);
    }
  },
  _setKerningStart : function(cur_char, prev_text){
    var space_rate = this._getTextSpaceStart(cur_char, prev_text);
    if(space_rate > 0){
      cur_char.spaceRateStart = space_rate;
    }
  },
  _setKerningEnd : function(cur_char, next_text){
    var space_rate = this._getTextSpaceEnd(cur_char, next_text);
    if(space_rate > 0){
      cur_char.spaceRateEnd = space_rate;
    }
  },
  _getTextSpaceStart : function(cur_char, prev_text){
    if(prev_text === null){
      return 0.5;
    }
    if(Token.isChar(prev_text) && prev_text.isKakkoStart()){
      return 0;
    }
    return 0.5;
  },
  _getTextSpaceEnd : function(cur_char, next_text){
    if(next_text === null){
      return 0.5;
    }
    if(Token.isChar(next_text) && (next_text.isKakkoEnd() || next_text.isKutenTouten())){
      return 0;
    }
    return 0.5;
  }
};
