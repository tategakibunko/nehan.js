/**
 * kerning utility module<br>
 * Note that charactors that can be kerned are already kerned in nehan.js.<br>
 * So purpose of this module is only 'adding' the space to char at start/end direction.

 @namespace Nehan.Kerning
*/
Nehan.Kerning = {
  /**
     @memberof Nehan.Kerning
     @param cur_char(zenkaku) {Nehan.Char}
     @param prev_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
     @param next_text {Nehan.Char | Nehan.Word | Nehan.Tcy}
  */
  set : function(cur_char, prev_text, next_text){
    if(cur_char.isKakkoStart()){
      this._setKerningStart(cur_char, prev_text);
    } else if(cur_char.isKakkoEnd() || cur_char.isKutenTouten()){
      this._setKerningEnd(cur_char, next_text);
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
  // if previous text is not exists or previous text is not left brace(or paren etc),
  // add space to start direction.
  //
  // [example:add space]
  //   (  => [SPACE](
  //   a( => a[SPACE](
  //
  // [example:do nothing]
  //   (( => ((
  //   {( => {(
  _getTextSpaceStart : function(cur_char, prev_text){
    if(prev_text === null){
      return 0.5;
    }
    if(prev_text instanceof Nehan.Char && prev_text.isKakkoStart()){
      return 0;
    }
    return 0.5;
  },
  // if next text is not exists or next text is not right brace(or paren etc),
  // add space to end direction.
  //
  // [example:add space]
  //   )  => )[SPACE]
  //   )a => )[SPACE]a
  //
  // [example:do nothing]
  //   )) => ))
  //   )} => )}
  //   ,( => ,(
  _getTextSpaceEnd : function(cur_char, next_text){
    if(next_text === null){
      return 0.5;
    }
    if(next_text instanceof Nehan.Char && (cur_char.isKutenTouten() && next_text.isKakkoStart())){
      return 0;
    }
    if(next_text instanceof Nehan.Char && (next_text.isKakkoEnd() || next_text.isKutenTouten())){
      return 0;
    }
    return 0.5;
  }
};
