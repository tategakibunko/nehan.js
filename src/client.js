Nehan.Client = (function(){
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
	this.name = "msie";
	this.version = this._parseVersionPureTrident(user_agent);
	return;
      }
      // normal desktop agent styles
      if(user_agent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(?:\.\d+)*)/)){
	this.name = RegExp.$1.toLowerCase();
	this.version = this._parseVersionNormalClient(user_agent, parseInt(RegExp.$2, 10));
	return;
      }
      // if iphone/ipad/ipod, and user agent is not normal desktop style
      if(this.isAppleMobileFamily()){
	this.name = "safari";
	this.version = this._parseVersionAppleMobileFamily(user_agent);
	return;
      }
    },
    _parseVersionPureTrident : function(user_agent){
      if(user_agent.match(/rv:([\.\d]+)/)){
	return parseInt(RegExp.$1, 10);
      }
      return this.version;
    },
    _parseVersionNormalClient : function(user_agent, tmp_version){
      if(user_agent.match(/version\/([\.\d]+)/)){
	return parseInt(RegExp.$1, 10);
      }
      return tmp_version;
    },
    _parseVersionAppleMobileFamily : function(user_agent){
      if(user_agent.match(/os ([\d_]+) like/)){
	return parseInt(RegExp.$1, 10); // [iOS major version] = [safari major version]
      }
      return this.version;
    }
  };

  return Client;
})();
