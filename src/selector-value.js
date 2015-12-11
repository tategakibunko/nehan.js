Nehan.SelectorValue = (function(){
  function SelectorValue(entries){
    this.entries = this._initialize(entries);
  }

  SelectorValue.prototype._initialize = function(entries){
    var fmt_entries = {};
    for(var prop in entries){
      var fmt_prop = Nehan.CssParser.formatProp(prop);
      var fmt_value = Nehan.CssParser.formatValue(prop, entries[prop]);
      fmt_entries[fmt_prop] = fmt_value;
    }
    return fmt_entries;
  };

  SelectorValue.prototype.getEntry = function(key){
    return this.entries[key] || null;
  };

  SelectorValue.prototype.getEntries = function(key){
    return this.entries;
  };

  return SelectorValue;
})();
