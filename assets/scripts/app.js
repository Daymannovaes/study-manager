var SPapp = angular.module("screenplay", []);

$info = {};
$info.toggle = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).toggle();			
}
$info.show = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).delay(100).show(100);
	
}
$info.hide = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).delay(300).hide(200);
}

var Incer =  (function() {
	Incer = function() {
		this.init = function(init) {
			this.inc = function() {
					return ++init;
			};
			this.get = function() {
					return init;
			};
			this._inc = function(val) {
				return init += val;
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

		if(obj && typeof obj == "object") {
			callback.call(obj, arguments);
		}
	}
}

hasParentInArray = function(array, obj) {
	if(array.indexOf(obj.parent) != -1)
		return true;

	if(obj.parent)
		return hasParentInArray(array, obj.parent);

	return false;
}

function getObjectById(obj, id) {
	if(obj.id == id) 
		return obj;

	for(index in obj) {
		if(obj[index] && typeof obj[index] == "object") {
			var finded = getObjectById(obj[index], id);
			if(finded) return finded;
		}
	}
}

function getParent(obj) {
	var id;
	if(typeof arguments[1] == "string" || typeof arguments[1] == "number")
		id = arguments[1];
	else if(typeof arguments[1] == "object" && arguments[1].id)
		id = arguments[1].id;
	else
		return obj;

	var parentId = getObjectById(obj, id).parentId;
	return getObjectById(obj, parentId);
}