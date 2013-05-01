Nehan.version = "4.0.1";

Args.copy(Env, __engine_args.env || {});
Args.copy(Layout, __engine_args.layout || {});
Args.copy(Config, __engine_args.config || {});

var __exports = {};

// export only for test
if(__engine_args.test){

  // basics
  __exports.Class = Class;
  __exports.Utils = Utils;
  __exports.Obj = Obj;
  __exports.Css = Css;
  __exports.Html = Html;
  __exports.Closure = Closure;
  __exports.Args = Args;
  __exports.List = List;
  __exports.Color = Color;
  __exports.Flow = Flow;
  __exports.InlineFlow = InlineFlow;
  __exports.BlockFlow = BlockFlow;
  __exports.BoxFlow = BoxFlow;
  __exports.Edge = Edge;
  __exports.Padding = Padding;
  __exports.Margin = Margin;
  __exports.Border = Border;
  __exports.BorderRadius = BorderRadius;
  __exports.Radius2d = Radius2d;
  __exports.BoxEdge = BoxEdge;
  __exports.BoxSize = BoxSize;
  __exports.LogicalSize = LogicalSize;
  __exports.UnitSize = UnitSize;
  __exports.BoxChild = BoxChild;
  __exports.Box = Box;
  __exports.Selector = Selector;
  __exports.Tag = Tag;
  __exports.Char = Char;
  __exports.Word = Word;
  __exports.Tcy = Tcy;
  __exports.Ruby = Ruby;
  __exports.Lexer = Lexer;
  __exports.Token = Token;
  __exports.TagStack = TagStack;
  __exports.InlineContext = InlineContext;
  __exports.BlockContext = BlockContext;
  __exports.DocumentContext = DocumentContext;
  __exports.TocContext = TocContext;
  __exports.EvalResult = EvalResult;
  __exports.PageGroup = PageGroup;
  __exports.Partition = Partition;
  __exports.CardinalString = CardinalString;
  __exports.CardinalStrings = CardinalStrings;
  __exports.CardinalCounter = CardinalCounter;
  __exports.ListStyle = ListStyle;

  // outline
  __exports.OutlineLog = OutlineLog;
  __exports.OutlineContext = OutlineContext;
  __exports.OutlineGenerator = OutlineGenerator;
  __exports.OutlineConverter = OutlineConverter;

  // stream
  __exports.TokenStream = TokenStream;
  __exports.DocumentTagStream = DocumentTagStream;
  __exports.HtmlTagStream = HtmlTagStream;
  __exports.HeadTagStream = HeadTagStream;
  __exports.ListTagStream = ListTagStream;
  __exports.DefListTagStream = DefListTagStream;
  __exports.TableTagStream = TableTagStream;
  __exports.RubyStream = RubyStream;

  // generator
  __exports.BlockGenerator = BlockGenerator;
  __exports.InlineGenerator = InlineGenerator;
  __exports.PageGenerator = PageGenerator;
  __exports.BodyPageGenerator = BodyPageGenerator;
  __exports.ParallelPageGenerator = ParallelPageGenerator;
  __exports.ParaChildPageGenerator = ParaChildPageGenerator;
  __exports.HtmlGenerator = HtmlGenerator;
  __exports.DocumentGenerator = DocumentGenerator;

  // evaluator
  __exports.PageEvaluator = PageEvaluator;
  __exports.BlockEvaluator = BlockEvaluator;
  __exports.InlineEvaluator = InlineEvaluator;
  __exports.PageGroupEvaluator = PageGroupEvaluator;

  // page stream
  __exports.PageStream = PageStream;
  __exports.PageGroupStream = PageGroupStream;
  __exports.DocumentPageStream = DocumentPageStream;

  // core layouting components
  __exports.Env = Env;
  __exports.Config = Config;
  __exports.Layout = Layout;
  __exports.Style = Style;
  __exports.Styles = Styles;
  __exports.Selectors = Selectors;
}

__exports.createPageStream = function(text){
  return new PageStream(text);
};
__exports.createDocumentPageStream = function(text){
  return new DocumentPageStream(text);
};
__exports.createPageGroupStream = function(text, group_size){
  return new PageGroupStream(text, group_size);
};
__exports.getRule = function(selector){
  return Style[selector];
};
__exports.addRule = function(selector, prop, value) {
  Styles.addRule(selector, prop, value);
};
__exports.addRules = function(selector, obj) {
  Styles.addRules(selector, obj);
};

return __exports;
