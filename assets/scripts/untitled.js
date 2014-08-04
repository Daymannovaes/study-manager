getObjectById = function(obj, id) {
	if(obj.id == id)
		return obj;

	validateObject(obj, id);
}

validateObject = function(obj, id) {
	if(typeof obj == "object")
		traverseObject(obj, id);
}

traverseObject = function(obj, id) {
	for(var index in obj) {
		var temporary = getObjectById(obj[index], id);

		if(temporary)
			return temporary;
	}
}

var Incer =  {
	init: function(init) {
		Incer = {
			inc: function() {
				return ++init;
			},
			get: function() {
				return init;
			}
		}
		return Incer;
	}	
}

var count = function(obj) {
	var value = {value: 0};

	var callback = function() {
		if(!(this instanceof Array))
			value.value++;

		traverseAndApplyCallback(this, callback);
	}

	traverseAndApplyCallback(obj, callback);

	return value.value;
}

traverseAndApplyCallback = function(object, callback, arguments) {
	for(index in object) {
		obj = object[index];

		if(typeof obj == "object") {
			callback.call(obj, arguments);
		}
	}
}

createId = function(obj) {
	Incer.init(count(obj));

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