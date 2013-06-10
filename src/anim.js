var reqAnimationFrame = (function(){
  return window.requestAnimationFrame  ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function(callback, wait){
      var _wait = (typeof wait === "undefined")? (1000 / 60) : wait;
      window.setTimeout(callback, _wait);
    };
})();

