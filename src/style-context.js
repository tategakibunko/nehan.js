var StyleContext = (function(){
  function StyleContext(){
    this.localStyles = {};
    this.globalStyles = [];
  }

  StyleContext.prototype = {
    addLocalStyle : function(markup, page_no){
      var styles = this.localStyles[page_no] || [];
      var css_content = markup.getContent();
      styles.push(css_content);
      this.localStyles[page_no] = styles;
    },
    addGlobalStyle : function(markup){
      var css_content = markup.getContent();
      this.globalStyles.push(css_content);
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
