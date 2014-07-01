var Client = (function(){
  function Client(){
    this.userAgent = navigator.userAgent.toLowerCase();
    this.name = navigator.appName.toLowerCase();
    this.version = parseInt(navigator.appVersion, 10);
    this._parseUserAgent(this.userAgent);
  }

  Client.prototype = {
    isWindows : function(){
      return this.userAgent.indexOf("windows") >= 0;
    },
    isMacintosh : function(){
      return this.userAgent.indexOf("macintosh") >= 0;
    },
    isIphone : function(){
      return this.userAgent.indexOf("iphone") >= 0;
    },
    isIpod : function(){
      return this.userAgent.indexOf("ipod") >= 0;
    },
    isIpad : function(){
      return this.userAgent.indexOf("ipad") >= 0;
    },
    isAppleMobileFamily : function(){
      return this.isIphone() || this.isIpod() || this.isIpad();
    },
    isAndroid : function(){
      return this.userAgent.indexOf("android") >= 0;
    },
    isSmartPhone : function(){
      return this.isAppleMobileFamily() || this.isAndroid();
    },
    isWebkit : function(){
      return this.userAgent.indexOf("webkit") >= 0;
    },
    isIE : function(){
      return this.name === "msie";
    },
    isTrident : function(){
      return this.isIE() && this.version >= 11;
    },
    isChrome : function(){
      return this.name === "chrome";
    },
    isSafari : function(){
      return this.name === "safari";
    },
    _parseUserAgent : function(user_agent){
      // in latest agent style of MSIE, 'Trident' is specified but 'MSIE' is not.
      if(user_agent.indexOf("trident") >= 0 && user_agent.indexOf("msie") < 0){
	this._parsePureTrident(user_agent);
	return;
      }
      // normal desktop agent styles
      if(user_agent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(?:\.\d+)*)/)){
	this._parseNormalClient(user_agent, RegExp.$1.toLowerCase(), parseInt(RegExp.$2, 10));
	return;
      }
      // if iphone/ipad/ipod, and user agent is not normal desktop style
      if(this.isAppleMobileFamily()){
	this._parseAppleMobileFamily(user_agent);
	return;
      }
    },
    _parsePureTrident : function(user_agent){
      var rv_matched = user_agent.match(/rv:([\.\d]+)/i);
      this.name = "msie";
      this.version = rv_matched? parseInt(rv_matched[1], 10) : "";
    },
    _parseNormalClient : function(user_agent, tmp_name, tmp_version){
      this.name = tmp_name;
      this.version = tmp_version;
      if(user_agent.match(/version\/([\.\d]+)/i)){
	this.version = parseInt(RegExp.$1, 10);
      }
    },
    _parseAppleMobileFamily : function(user_agent){
      if(user_agent.match(/os ([\d_]+) like/)){
	this.name = "safari"; // safari(maybe!)
	this.version = parseInt(RegExp.$1, 10); // [iOS major version] = [safari major version]
      }
    }
  };

  return Client;
})();
