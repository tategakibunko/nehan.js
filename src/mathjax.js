/**
 MathJax typesetting

 @namespace Nehan.MathJax
 */
Nehan.MathJax = (function(){
  var __typeset = function(element, opt){
    // hook typeset finish
    MathJax.Hub.Queue(function(){
      var math_element = element.getElementsByTagName("span")[1];
      if(!math_element){
	if(opt.retry >= opt.maxRetry){
	  console.warn("Nehan.MathJax::typeset failed");
	  if(opt.onError){
	    opt.onError(element);
	  }
	  return;
	}
	//console.warn("retry typeset! %d", retry);
	setTimeout(function(){
	  opt.retry++;
	  __typeset(element, opt);
	}, opt.retryWait);
	return;
      }
      //console.log("typeset success!!");
      opt.onComplete(math_element);
    });

    // start typeset
    MathJax.Hub.Typeset(element);
  };

  return {
    /**
     @memberof Nehan.MathJax
     @param element {HTMLDOMElement}
     @param opt {Object}
     @param opt.maxRetry {int}
     @param opt.retryWait {int} milliseconds
     @param opt.onComplete {Function} HHTMLDOMElement -> ()
     @param opt.onError {Function}
     */
    typeset: function(element, opt){
      opt = opt || {};
      opt.retry = 0;
      opt.maxRetry = opt.maxRetry || Nehan.Config.mathjax.maxRetryCount;
      opt.retryWait = opt.retryWait || Nehan.Config.mathjax.retryWait;
      opt.onComplete = opt.onComplete || function(){};
      opt.onError = opt.onError || function(){};

      __typeset(element, opt);
    }
  };
})();
