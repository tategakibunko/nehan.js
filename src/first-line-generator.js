// style of first line generator is enabled until first line is yielded.
// after yielding first line, parent style is inherited.
var FirstLineGenerator = (function(){
  function FirstLineGenerator(style, stream, outline_context){
    BlockGenerator.call(this, style, stream, outline_context);
  }
  Class.extend(FirstLineGenerator, BlockGenerator);

  FirstLineGenerator.prototype._onAddElement = function(element){
    if(element.display === "inline" && typeof this._first === "undefined"){
      this._first = true; // flag that first line is already generated.
      this.style = this.style.parent; // first-line yieled, so switch style to parent one.
      if(this._childLayout){
	this._childLayout.style = this.style;
      }
    }
  };

  return FirstLineGenerator;
})();

