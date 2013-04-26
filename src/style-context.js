var StyleContext = (function(){
  function StyleContext(){
    this.localStyles = {};
    this.globalStyles = [];
  }

  StyleContext.prototype = {
    addLocalStyle : function(markup, page_no){
      var styles = this.localStyles[page_no] || [];
      styles.push(markup);
      this.localStyles[page_no] = styles;
    },
    addGlobalStyle : function(markup){
      this.globalStyles.push(markup);
    },
    getLocalStyles : function(page_no){
      return this.localStyles[page_no] || [];
    },
    getGlobalStyles : function(){
      return this.globalStyles;
    }
  };

  return StyleContext;
})();
