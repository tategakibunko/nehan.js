test("char", function(){
  var c1 = new Char("ァ");
  ok(c1.isSmallKana());

  var c1 = new Char("\n");
  ok(c1.isNewLineChar());

  var c1 = new Char("\r");
  equal(c1.isNewLineChar(), false);

  var c1 = new Char("=");
  ok(c1.isImgChar());
  ok(c1.isHankaku());
  testEngine.Style.fontImgRoot = "http://nehan.googlecode.com/hg/char-img"; 
  equal(c1.getImgSrc("000000"), "http://nehan.googlecode.com/hg/char-img/equal/000000.png");

  var c1 = new Char(String.fromCharCode(8594));
  ok(c1.isCnvChar());

  var c1 = new Char("（");
  ok(c1.isKakko());
  ok(c1.isKakkoStart());
  ok(c1.isZenkaku());
  ok(c1.isTailNg());

  var c1 = new Char("）");
  ok(c1.isKakko());
  ok(c1.isKakkoEnd());
  ok(c1.isZenkaku());
  ok(c1.isHeadNg());

  var c1 = new Char("。");
  ok(c1.isKutenTouten());
  ok(c1.isHeadNg());

  var c1 = new Char(" ");
  ok(c1.isHalfSpaceChar());
});