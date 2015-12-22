Nehan.globalStyles = Nehan.globalStyles || {};
Nehan.globalSingleTagNames = new Nehan.LowerNameSet();

/**
 set global style.

 @memberof Nehan
 @param selector_key {String}
 @param value {selector_value}
 @return {Nehan}
 */
Nehan.setStyle = function(selector_key, value){
  var entry = Nehan.globalStyles[selector_key] || {};
  for(var prop in value){
    entry[prop] = value[prop];
  }
  Nehan.globalStyles[selector_key] = entry;
  return this;
};

/**
 set global styles.

 @memberof Nehan
 @param values {Object}
 @return {Nehan}
 */
Nehan.setStyles = function(values){
  for(var selector_key in values){
    Nehan.setStyle(selector_key, values[selector_key]);
  }
  return this;
};

/**
 set global single tag name

 @memberof Nehan
 @param name {String} - single tag name
 @return {Nehan}
*/
Nehan.addSingleTagName = function(name){
  Nehan.globalSingleTagNames.add(name);
  return this;
};

/**
 set global single tag names

 @memberof Nehan
 @param names {Array} - single tag name list
 @return {Nehan}
*/
Nehan.addSingleTagNames = function(names){
  Nehan.globalSingleTagNames.addValues(names);
  return this;
};

/**
 @param opt {Object}
 @param opt.root {String} - context root
 @param opt.text {String} - html string
 @param opt.styles {Object} - context local styles
 @return {Nehan.DocumentGenerator | Nehan.HtmlGenerator | Nehan.BodyGenerator}
 */
Nehan.createRootGenerator = function(opt){
  opt = opt || {};
  var context = new Nehan.RenderingContext({
    text:Nehan.Html.normalize(opt.text || "no text"),
    singleTagNames:(
      new Nehan.LowerNameSet()
	.addValues(Nehan.Config.defaultSingleTagNames)
	.addValues(Nehan.globalSingleTagNames.getValues())
    )
  });
  return context
    .setStyles(Nehan.globalStyles)
    .setStyles(opt.styles || {})
    .createRootGenerator();
};

/**
 @param opt {Object}
 @param opt.root {String} - context root
 @param opt.text {String} - html string
 @param opt.styles {Object} - context local styles
 @return {Nehan.RenderingContext}
 */
Nehan.createRootContext = function(opt){
  return Nehan.createRootGenerator(opt || {}).context;
};

