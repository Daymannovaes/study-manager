var SPapp = angular.module("screenplay", []);

$info = {};
$info.toggle = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).toggle();			
}
$info.show = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).delay(300).show(100);
	
}
$info.hide = function(button) {
	$(button).parents(".container-actions").find(".actions").stop(true, true).delay(300).hide(200);
}