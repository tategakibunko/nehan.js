test("table-token-stream", function(){
  var token_stream = new TokenStream([
    "<table>",
    "<tfoot>",
    "<tr><td>foot</td><td>foot2</td></tr>",
    "</tfoot>",

    "<tbody>",
    "<tr><td>body</td><td>body2</td></tr>",
    "</tbody>",
    "<tr><td>foot</td><td>foot2</td></tr>",

    "<thead>",
    "<tr><td>head</td><td>head2</td></tr>",
    "</thead>",
    "</table>"
  ].join(""));
  var table_tag = token_stream.get();
  var stream = new TableTagStream(table_tag);

  // thead
  var token = stream.get();
  equal(token._type, "tag");
  equal(token.name, "thead");

  // tbody
  var token = stream.get();
  equal(token._type, "tag");
  equal(token.name, "tbody");
  equal(token.childs.length, 2); // th * 2

  // tfoot
  var token = stream.get();
  equal(token._type, "tag");
  equal(token.name, "tfoot");
});

test("table-static", function(){
  // table as static block
  var stream = new TokenStream([
    "<table width='100' height='200'>",
    "<tr><td>foot</td><td>foot2</td></tr>",
    "</table>"
  ].join(""));

  var token = stream.get();
  equal(token._type, "tag");
  equal(token.name, "table");

  equal(stream.hasNext(), false);
});