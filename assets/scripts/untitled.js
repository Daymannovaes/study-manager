var Incer =  (function() {
	Incer = function() {
		this.init = function(init) {
			this.inc = function() {
					return ++init;
				}
			this.get = function() {
					return init;
				}

			this.init = function(){};
			
			return this;
		}	
	}
	return new Incer();
})();

var countAllObjects = function(obj) {
	var value = {value: 0};

	var callback = function() {
		if(!(this instanceof Array))
			value.value++;

		traverseAndApplyCallback(this, callback);
	}

	traverseAndApplyCallback(obj, callback);

	return value.value;
}

createId = function(obj) {
	Incer.init(0);

	var callback = function(parentId) {

		if(!(this instanceof Array)) {
			this.parentId = parentId;
			this.id = Incer.inc();

			parentId = this.id;
		}

		traverseAndApplyCallback(this, callback, parentId);
	}

	traverseAndApplyCallback(obj, callback);
}

traverseAndApplyCallback = function(object, callback, arguments) {
	for(index in object) {
		obj = object[index];

		if(typeof obj == "object") {
			callback.call(obj, arguments);
		}
	}
}