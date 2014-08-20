var screenplay;
var saveInLocalStorage = true;
var showModal = localStorage.getItem("screenplay.showModal") != undefined ? localStorage.getItem("screenplay.showModal") : "true";
var countObjectInit = 0;
var countObject = 0;
var band = 1; //(client = 10) (me = 1)

var toAdd = [];

SPapp.controller("mainController",
	
	["$scope", "$http", "$timeout",
	
	function($scope, $http, $timeout) {

	var enemDate = new Date("11-08-2014");
	var nowDate = new Date();
	$scope.diffDate = Math.floor((enemDate - nowDate) / (1000*60*60*24));

	$scope.loadScreenplay = function() {
		var old_revision,
			new_revision;
		
		$scope.$loading = $("#loading");
		$scope.$loading.text("Carregando conteúdo do servidor");

		if(localStorage.getItem("screenplay2")) {
			$scope.screenplay = JSON.parse(localStorage.getItem("screenplay2"));
			screenplay = $scope.screenplay;

			$scope.loadRevision();
		}
	    else {
	    	$http.get("static/json/screenplay.json").success(function(data) {
		        $scope.screenplay = data;
		        localStorage.setItem("screenplay2", JSON.stringify(data));
		        screenplay = data;
	    	}).then($scope.loadRevision);
	    }
	    
	}
	$scope.loadRevision = function() {
		$scope.$loading.text("Verificando alterações");
		
		$http.get("static/json/revision2.json").success(function(data) {
	        new_revision = data.revision;
	        $scope.revision = new_revision;
    	}).then($scope.handleRevisions);


        countObject = countAllObjects(screenplay);
        Incer.init(countObject * band);
	}

	$scope.handleRevisions = function() {
		old_revision = parseInt(localStorage.getItem("screenplay.revision2")) || 0;
		localStorage.setItem("screenplay.revision2", new_revision);

		var getObjectFromRevision = function(revisions, revisionNumber) {
			for(index in revisions) {
				var revision = revisions[index];

				if(revision.revision == revisionNumber)
					return revision;
			}
		}
			
		if(old_revision)	
			localStorage.setItem("screenplay.showModal", false);

		if(old_revision != new_revision) {
			$http.get("static/json/revisions.json").success(function(revisions) {
				$scope.$loading.text("Carregando alterações na tela");
		        //revisions = array
		        
		        while(old_revision != new_revision) {
			        var objectsToAdd = getObjectFromRevision(revisions, ++old_revision).objects;
			        $scope.handleRevisionEspecific(objectsToAdd);
		        }
	    	});
		}
	};

	$scope.handleRevisionEspecific = function(objectsToAdd) {
		for(index in objectsToAdd) {
			var objectToAdd = objectsToAdd[index];

			var parent = getObjectById($scope.screenplay, objectToAdd.parentId);

			if(parent && parent.sub instanceof Array) {
				parent.sub.push(objectToAdd);
				removeProp(objectToAdd, "parent");

				Incer._inc(countAllObjects({a:objectToAdd}));
			}
		}
	};

    $scope.template = {};

	$scope.template.children = function(sub) {
		return sub.sub ? "static/templates/subs.html" : ""; 
	};
	$scope.template.edit = function(sub) {
		return sub.edit ? "static/templates/edit-sub.html" : "static/templates/sub.html";
	};

	$scope.toggle = function(sub) {
		if(sub.sub && sub.sub[0])
			sub.hideSubs = !sub.hideSubs;
	};
	
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
	};
	$scope.collapseAll = function(subs) {
		for(index in subs) {
			if(subs[index].sub && subs[index].sub[0]) {
				subs[index].hideSubs = true;
				$scope.collapseAll(subs[index].sub);
			}
		}
	};

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
		rate = rate || 0; //NaN

		sub.rate = rate;
		return Math.floor(rate*10);
	};

	$scope.subClass = function(sub) {
		var stringClass = " opened_" + sub.hideSubs;

		stringClass += " sub-li";
		stringClass += " complete-" + $scope.getPercentChildrenComplete(sub);
		stringClass += sub.edited ? " sub-li-edited" : "";
		stringClass += sub.studied ? " sub-li-studied" : "";

		return stringClass;
	};

	$scope.init = function(sub) {
		$scope.$loading.text("Carregando conteúdo na tela");

		if(!sub.sub.studied)
			sub.sub.studied = false;

		if(!sub.sub.sub)
			sub.sub.sub = [];

		countObjectInit++;

		if(countObjectInit+4 >= countObject) {
			$("#loading").css("display", "none");
			if(showModal == "true") {
				$('#tutorial').modal('show');
				showModal = "false";
				localStorage.setItem("screenplay.showModal", false);
			}
		}
	};


	$scope.upItem = function($parent, $index) {
		if($index == 0) {
			if($parent.$parent.sub)
				$scope.upLevelItem($parent.$parent, $parent.sub, $index);
		}
		else
			$scope.changePosition($parent, $index-1, $index);

		$scope.defineToggle($parent.sub);
	};
	$scope.downItem = function($parent, $index) {
		if($index == $parent.sub.sub.length-1) {
			console.log('finish');
			return;
		}

		$scope.changePosition($parent, $index+1, $index)
	};
	$scope.changePosition = function($parent, idFrom, idTo) {
		parent = $parent.sub.sub;

		var cloneTo = angular.copy(parent[idTo]);
		var cloneFrom = angular.copy(parent[idFrom]);

		parent[idTo] = cloneFrom;
		parent[idFrom] = cloneTo;
	};
	$scope.upLevelItem = function($parent, oldParent, $index) {
		var item = angular.copy(oldParent.sub[$index]);
		oldParent.sub.splice($index, 1);

		var newParentArray = $parent.sub.sub;
		var oldParentIndex = newParentArray.indexOf(oldParent);

		newParentArray.splice(oldParentIndex, 0, item)
	};

	$scope.defineToggle = function(sub) {
		if(sub.sub && sub.sub[0]) {
			sub.hideSubs = false;
		}
		else {
			delete sub.hideSubs;
			sub.templateChildren = "";
		}
	};

	$scope.add = function(sub) {
		if(!sub.sub || !sub.sub[0])
			sub.sub = [];

		var newSub = {
			edit:true,
			studied:false,
			id: Incer.inc(),
			parent: sub,
			parentId: sub.id
		}
		sub.sub.unshift(newSub);

		if(!hasParentInArray(toAdd, newSub))
			toAdd.push(newSub);

		sub.hideSubs = true;
		sub.studied = false;
	};

	$scope.remove = function(parent, index) {
		if(parent.sub[index].desc && !confirm("Deseja realmente excluir o tópico \""+parent.sub[index].desc+"\""))
			return;
		parent.sub.splice(index, 1);

		$scope.studied.selfUpdate(parent);

		$scope.defineToggle(parent);

	};

	$scope.teste = function(sub) {
		console.log(1);
	};

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
	};

	$scope.studied.update = function($this, event) {
		var timer;
		sub = $this.sub;

		$scope.studied.updateParents($this.$parent);
		$scope.studied.updateChildren(sub);

	};
	$scope.studied.updateChildren = function(sub) {
		for(index in sub.sub) {
			sub.sub[index].studied = sub.studied;

			$scope.studied.updateChildren(sub.sub[index]);
		}
	};
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
	};


	$scope.validate = function(sub) {
		sub.edit = !sub.desc;
	};
	$scope.initInput = function($this) {
		$timeout(function() {
			$("input."+$this.$id).focus();
			$("input."+$this.$id).click();
		},250);
	};

	$scope.loadScreenplay();
}]);

window.onbeforeunload = function() {
	removeProp(screenplay, "parent");
	removeProp(screenplay, "hideSubs");
	removeProp(screenplay, "search");
	desactivateReferences(screenplay);
	
	if(saveInLocalStorage)
		localStorage.setItem("screenplay2", JSON.stringify(screenplay));	
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
		if(obj[index] && typeof obj[index] == "object")
			removeProp(obj[index], prop, notRecursive);
	}
}