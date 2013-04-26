var TagStack = (function (){
  function TagStack(opt){
    this.tags = [];
    this.head = null;
  }

  TagStack.prototype = {
    isEmpty : function(){
      return this.tags.length <= 0;
    },
    isTagNameEnable : function(name){
      return this.exists(function(tag){
	return tag.getName() == name;
      });
    },
    getDepth : function(){
      return this.tags.length;
    },
    getDepthByName : function(name){
      return List.count(this.tags, function(tag){
	return tag.getName() == name;
      });
    },
    getHead : function(){
      return this.head;
    },
    pop : function(){
      var ret = this.tags.pop();
      this.head = this._getCurHead();
      return ret;
    },
    push : function(tag){
      this.head = tag;
      this.tags.push(tag);
    },
    exists : function(fn){
      return List.exists(this.tags, fn);
    },
    find : function(fn){
      return List.find(this.tags, fn);
    },
    revfind : function(fn){
      return List.revfind(this.tags, fn);
    },
    iter : function(fn){
      List.iter(this.tags, fn);
    },
    reviter : function(fn){
      List.revIter(this.tags, fn);
    },
    filter : function(fn){
      return List.filter(this.tags, fn);
    },
    getByName : function(name){
      for(var i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == name){
	  return tag;
	}
      }
      return null;
    },
    popByName : function(name){
      for(var i = this.tags.length - 1; i >= 0; i--){
	var tag = this.tags[i];
	if(tag.name == name){
	  var ret = this.tags.splice(i,1)[0];
	  this.head = this._getCurHead();
	  return ret;
	}
      }
      return null;
    },
    _getCurHead : function(){
      if(this.tags.length === 0){
	return null;
      }
      return this.tags[this.tags.length - 1];
    }
  };

  return TagStack;
})();

