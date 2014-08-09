SPapp.directive("swipeRight", [function() {
	var makeStudied = function(checkbox) {
		if(!checkbox.is(":checked")) {
			checkbox.click();
		}
	}

	return {
		link: function($scope, linkElement, linkAttributes) {
			Zepto(linkElement[0]).swipeRight(function() {
				makeStudied($(linkElement).find("input"));
			});
		}
	}
}]);