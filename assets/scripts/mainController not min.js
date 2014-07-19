var screenplay;
var saveInLocalStorage = true;
var items = -4;
var loaded = 0;
var showModal = true;

SPapp.controller("mainController",
	
	["$scope", "$http", "$timeout",
	
	function($scope, $http, $timeout) {

	function load() {
		var old_revision,
			new_revision;

		$http.get("json/revision.json").success(function(data) {
	        new_revision = data.revision;
    	}).then(function() {
			old_revision = localStorage.getItem("screenplay.revision");
				
			if(old_revision) {
				showModal = false;

				if(old_revision != new_revision) {
					if(confirm("Há novo conteúdo disponível, deseja sobreescrever seus dados? \nSua revisão: " + old_revision + "\nNova revisão: " + new_revision)) {
						saveInLocalStorage = false;
						location.reload();
		    			localStorage.setItem("screenplay.revision", new_revision);
					}
				}
			}
			else 
    			localStorage.setItem("screenplay.revision", new_revision);
				
		});

		if(localStorage.getItem("screenplay")) {
			$scope.screenplay = JSON.parse(localStorage.getItem("screenplay"));
			screenplay = $scope.screenplay;
			$scope.countItens($scope.screenplay.references);
		}
	    else {
	    	$http.get("json/screenplay.json").success(function(data) {
		        $scope.screenplay = data;
		        localStorage.setItem("screenplay", JSON.stringify(data));
		        screenplay = data;
				$scope.countItens($scope.screenplay.references);
	    	});
	    }
	    
	}

    $scope.template = {};

    $scope.countItens = function(sub) {
    	for(index in sub) {
    		items++;

    		if(sub[index].sub)
    			$scope.countItens(sub[index].sub);
    	}
    }

	$scope.template.children = function(sub) {
		return sub.sub ? "templates/subs.html" : ""; 
	}
	$scope.template.edit = function(sub) {
		return sub.edit ? "templates/edit-sub.html" : "templates/sub.html";
	}

	$scope.toggle = function(sub) {
		if(sub.sub && sub.sub[0])
			sub.hideSubs = !sub.hideSubs;
	}
	
	$scope.toggleref = function($this) {
		var activeReference = $this.$parent.activeReference;
		if(activeReference)
			activeReference.show = "reference-content-container-false";

		$this.$parent.opened = false;
		$this.reference.search = false; 
		$this.reference.referenceClass = "reference-title";

		if(activeReference == $this.reference) {
			delete $this.$parent.activeReference;
			return;
		}

		$this.$parent.activeReference = $this.reference;


		$this.reference.referenceClass = "reference-title-true";		
		$this.$parent.opened = true;
		$this.reference.search = true;

		$scope.collapseAll($this.reference.sub);
		$this.reference.show = "reference-content-container-true";
	}
	$scope.collapseAll = function(subs) {
		for(index in subs) {
			if(subs[index].sub && subs[index].sub[0]) {
				subs[index].hideSubs = true;
				$scope.collapseAll(subs[index].sub);
			}
		}
	}

	$scope.getPercentChildrenComplete = function(sub) {
		var checked = 0;
		var length = sub.sub.length;
		var rate;

		for(index in sub.sub) {
			if(sub.sub[index].rate)
				checked += sub.sub[index].rate;

			else if(sub.sub[index].studied)
				checked++;
		}

		rate = checked/length;
		sub.rate = rate;
		return Math.floor(rate*10);


	}

	$scope.subClass = function(sub) {
		var stringClass = " opened_" + sub.hideSubs;

		stringClass += " sub-li";
		stringClass += " complete-" + $scope.getPercentChildrenComplete(sub);
		stringClass += sub.edited ? " sub-li-edited" : "";
		stringClass += sub.studied ? " sub-li-studied" : "";

		return stringClass;
	}

	$scope.init = function(sub) {
		$scope.toggle(sub.sub);

		if(!sub.sub.studied)
			sub.sub.studied = false;

		if(!sub.sub.sub)
			sub.sub.sub = [];

		$timeout(function() {
			$scope.bindEventToPolymer(sub);
		},50);
	}

	$scope.bindEventToPolymer = function(sub) {
		var element = $("." + sub.$id);

		element[0].bind('checked', new PathObserver(sub.sub, 'studied'));

		sub.sub.element = element;

		loaded++;
		$scope.percentLoaded = "Carregando " + Math.round(loaded/items*100) + "%";

		$("#loading-progress").width(loaded/items*100 + "%");
	
		if(loaded == items) {
			setTimeout(function() {
				$("#loading").animate({opacity: 0}, 300);
				$("#loading-progress").animate({left:2000}, 500);
				setTimeout(function() {
					$("#loading").css("display", "none");
					$("#loading-progress").css("display", "none");

					if(showModal)
						$('#tutorial').modal('show');
				}, 600);
			},100);
		
		}
	}

	$scope.defineToggle = function(sub) {
		if(sub.sub && sub.sub[0])
			sub.hideSubs = false;
		else
			delete sub.hideSubs;
	}

	$scope.add = function(sub) {
		if(!sub.sub || !sub.sub[0]) 
			sub.sub = [];

		var newSub = {
			edit:true,
			studied:false
		}
		sub.sub.unshift(newSub);

		sub.hideSubs = true;
		sub.studied = false;
	}

	$scope.remove = function(parent, index) {
		if(parent.sub[index].desc && !confirm("Deseja realmente excluir o tópico \""+parent.sub[index].desc+"\""))
			return;
		parent.sub.splice(index, 1);

		$scope.studied.selfUpdate(parent);

		$scope.defineToggle(parent);

	}

	$scope.teste = function(sub) {
		console.log(1);
	}

	$scope.studied = {};

	$scope.studied.selfUpdate = function(sub) {
		var studied = sub.sub.length > 0;

		for(index in sub.sub) {
			if(!sub.sub[index].studied) {
				studied = false;
				break;
			}
		}

		sub.studied = studied;
	}

	$scope.studied.update = function($this, event) {
		var timer;
		sub = $this.sub;

		sub.studied = !sub.studied;

		$scope.studied.updateParents($this.$parent);
		$scope.studied.updateChildren(sub);

		sub.studied = !sub.studied;
		
		timer = $timeout(function() {
			sub.studied = sub.element.prop("checked");
		}, 200);
	}
	$scope.studied.updateChildren = function(sub) {
		for(index in sub.sub) {
			sub.sub[index].studied = sub.studied;

			$scope.studied.updateChildren(sub.sub[index]);
		}
	}
	$scope.studied.updateParents = function($this) {
		var studied = true;

		if(!$this || !$this.sub)
			return;

		for(index in $this.sub.sub) {
			if(!$this.sub.sub[index].studied) {
				studied = false;
				break;
			}
		}
		$this.sub.studied = studied;

		$scope.studied.updateParents($this.$parent.$parent);
	}


	$scope.validate = function(sub) {
		sub.edit = !sub.desc;

		sub.edited = sub.edited == undefined ? false : sub.edited || sub.desc != sub.old_desc;
	}
	$scope.initInput = function($this) {
		console.log();
		$this.sub.old_desc = $this.sub.desc;
		$timeout(function() {
			$("input."+$this.$id).focus();
		},250);
	}

	load();
}]);

window.onbeforeunload = function() {
	removeProp(screenplay, "element");
	removeProp(screenplay, "hideSubs");
	removeProp(screenplay, "search");
	desactivateReferences(screenplay);

	if(saveInLocalStorage)
		localStorage.setItem("screenplay", JSON.stringify(screenplay));	
}

desactivateReferences = function() {
	for(index in screenplay.references) {
		delete screenplay.references[index].referenceClass;
		delete screenplay.references[index].opened;
		delete screenplay.references[index].show;
	}
}

removeProp = function(obj, prop, notRecursive) {
	delete obj[prop];

	if(notRecursive)
		return;

	for(index in obj) {
		if(typeof obj[index] == "object")
			removeProp(obj[index], prop, notRecursive);
	}
}