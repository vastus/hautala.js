var type = require('../lib/index').type;
module.exports = (function(){
	 function inherits(ctor, superCtor) {
	  ctor.super_ = superCtor;
	  ctor.prototype = Object.create(superCtor.prototype, {
		constructor: {
		  value: ctor,
		  enumerable: false,
		  writable: true,
		  configurable: true
		}
	  });
	};

	function extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !type.isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
		origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};
	
	// olisi function implements mutta implements on reserved word
	function performs(o, interf){
	  for(var kentta in interf){
	    if(type.isFunction(kentta)){
	      if(o.kentta == interf.kentta){
	         return false;
          }
		}
	  }
	  return true;
	}
	
})
