Nehan.Client = (function(){
  /**
     @memberof Nehan
     @class Client
     @classdesc wrapper class for user browser agent
     @constructor
  */
  function Client(){
    this.platform = navigator.platform.toLowerCase();
    this.userAgent = navigator.userAgent.toLowerCase();
    this.appName = navigator.appName.toLowerCase();
    this.appVersion = parseInt(navigator.appVersion, 10);
    this.name = this._parseBrowserName(this.userAgent, this.appName);
    this.version = this._parseBrowserVersion(this.userAgent, this.appVersion);
    //console.info("client platform:%s, name:%s, version:%s", this.platform, this.name, this.version);
  }

  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isWindows = function(){
    return this.userAgent.indexOf("windows") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isMacintosh = function(){
    return this.userAgent.indexOf("macintosh") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isChromeOS = function(){
    return this.userAgent.indexOf("cros") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIphone = function(){
    return this.userAgent.indexOf("iphone") >= 0 && this.platform.indexOf("nintendo") < 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIpod = function(){
    return this.userAgent.indexOf("ipod") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIpad = function(){
    return this.userAgent.indexOf("ipad") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isNintendoBrowser = function(){
    return this.platform.indexOf("nintendo") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isAppleMobileFamily = function(){
    return this.isIphone() || this.isIpod() || this.isIpad();
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isAndroid = function(){
    return this.userAgent.indexOf("android") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isSmartPhone = function(){
    return this.isAppleMobileFamily() || this.isAndroid();
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isWebkit = function(){
    return this.userAgent.indexOf("webkit") >= 0;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isIE = function(){
    return this.name === "msie";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isTrident = function(){
    return this.isIE() && this.version >= 11;
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isChrome = function(){
    return this.name === "chrome";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isSafari = function(){
    return this.name === "safari";
  };
  /**
   @memberof Nehan.Client
   @return {boolean}
   */
  Client.prototype.isFirefox = function(){
    return this.name === "firefox";
  };

  Client.prototype.isTrident = function(){
    return (this.userAgent.indexOf("trident") >= 0 && this.userAgent.indexOf("msie") < 0);
  };

  Client.prototype.isEdge = function(){
    return (this.userAgent.indexOf("edge") >= 0);
  };

  Client.prototype._parseBrowserName = function(user_agent, app_name){
    if(this.isTrident() || this.isEdge()){
      return "msie";
    }
    if(user_agent.indexOf("crios") >= 0){
      return "chrome"; // chrome on ios
    }
    if(this.isAppleMobileFamily() && user_agent.indexOf("safari") >= 0){
      return "safari";
    }
    if(user_agent.match(/(opera|chrome|safari|firefox|msie)/)){
      return RegExp.$1.toLowerCase();
    }
    return app_name;
  };

  Client.prototype._parseBrowserVersion = function(user_agent, app_version){
    // in latest agent style of MSIE, 'Trident' is specified but 'MSIE' is not.
    if(this.isTrident()){
      return this._parseVersionTrident(user_agent);
    }
    // if iphone/ipad/ipod, and user agent is not normal desktop style.
    // but skip if chrome on ios(CriOS), because version is provided by 'CriOS/[version]').
    if(this.isAppleMobileFamily() && this.name !== "chrome"){
      return this._parseVersionAppleMobileFamily(user_agent);
    }
    // normal desktop agent styles
    if(user_agent.match(/(opera|chrome|safari|firefox|msie|crios)\/?\s*(\.?\d+(?:\.\d+)*)/)){
      return this._parseVersionNormalClient(user_agent, parseInt(RegExp.$2, 10));
    }
    return app_version;
  };

  Client.prototype._parseVersionTrident = function(user_agent){
    if(user_agent.match(/rv:([\.\d]+)/)){
      return parseInt(RegExp.$1, 10);
    }
    return this.version;
  };

  Client.prototype._parseVersionNormalClient = function(user_agent, tmp_version){
    // Android has 'Version/xx' string for OS!!
    // [example] Mozilla/5.0 (Linux; Android 4.4.2; ???) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36
    if(this.isAndroid()){
      return tmp_version;
    }
    if(user_agent.match(/version\/([\.\d]+)/)){
      return parseInt(RegExp.$1, 10);
    }
    return tmp_version;
  };

  Client.prototype._parseVersionAppleMobileFamily = function(user_agent){
    if(user_agent.match(/os ([\d_]+) like/)){
      return parseInt(RegExp.$1, 10); // [iOS major version] = [safari major version]
    }
    return this.version;
  };

  return Client;
})();
