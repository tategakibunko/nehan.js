test("partition", function(){
  var part = new Partition([10,20]);
  equal(part.getLength(), 2);
  equal(part.getSize(0), 10);
  equal(part.getSize(1), 20);

  var part2 = new Partition([40, 0, 0], 100);
  equal(part2.getLength(), 3);
  equal(part2.getSize(0), 40);
  equal(part2.getSize(1), 30);
  equal(part2.getSize(2), 30);
});
