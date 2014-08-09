SPapp.directive("swipeLeft", [function() {
	var makeNotStudied = function(checkbox) {
		if(checkbox.is(":checked")) {
			checkbox.click();
		}
	}

	return {
		link: function($scope, linkElement, linkAttributes) {
			Zepto(linkElement[0]).swipeLeft(function() {
				makeNotStudied($(linkElement).find("input"));
			});
		}
	}
}]);