var screenplay;var saveInLocalStorage=true;var items=-4;var loaded=0;var showModal=true;SPapp.controller("mainController",["$scope","$http","$timeout",function(e,t,n){function r(){var n,r;t.get("json/revision.json").success(function(e){r=e.revision}).then(function(){n=localStorage.getItem("screenplay.revision");if(n){showModal=false;if(n!=r){if(confirm("Há novo conteúdo disponível, deseja sobreescrever seus dados? \nSua revisão: "+n+"\nNova revisão: "+r)){saveInLocalStorage=false;location.reload();localStorage.setItem("screenplay.revision",r)}}}else localStorage.setItem("screenplay.revision",r)});if(localStorage.getItem("screenplay")){e.screenplay=JSON.parse(localStorage.getItem("screenplay"));screenplay=e.screenplay;e.countItens(e.screenplay.references)}else{t.get("json/screenplay.json").success(function(t){e.screenplay=t;localStorage.setItem("screenplay",JSON.stringify(t));screenplay=t;e.countItens(e.screenplay.references)})}}e.template={};e.countItens=function(t){for(index in t){items++;if(t[index].sub)e.countItens(t[index].sub)}};e.template.children=function(e){return e.sub?"templates/subs.html":""};e.template.edit=function(e){return e.edit?"templates/edit-sub.html":"templates/sub.html"};e.toggle=function(e){if(e.sub&&e.sub[0])e.hideSubs=!e.hideSubs};e.toggleref=function(t){var n=t.$parent.activeReference;if(n)n.show="reference-content-container-false";t.$parent.opened=false;t.reference.search=false;t.reference.referenceClass="reference-title";if(n==t.reference){delete t.$parent.activeReference;return}t.$parent.activeReference=t.reference;t.reference.referenceClass="reference-title-true";t.$parent.opened=true;t.reference.search=true;e.collapseAll(t.reference.sub);t.reference.show="reference-content-container-true"};e.collapseAll=function(t){for(index in t){if(t[index].sub&&t[index].sub[0]){t[index].hideSubs=true;e.collapseAll(t[index].sub)}}};e.getPercentChildrenComplete=function(e){var t=0;var n=e.sub.length;var r;for(index in e.sub){if(e.sub[index].rate)t+=e.sub[index].rate;else if(e.sub[index].studied)t++}r=t/n;e.rate=r;return Math.floor(r*10)};e.subClass=function(t){var n=" opened_"+t.hideSubs;n+=" sub-li";n+=" complete-"+e.getPercentChildrenComplete(t);n+=t.edited?" sub-li-edited":"";n+=t.studied?" sub-li-studied":"";return n};e.init=function(t){e.toggle(t.sub);if(!t.sub.studied)t.sub.studied=false;if(!t.sub.sub)t.sub.sub=[];n(function(){e.bindEventToPolymer(t)},50)};e.bindEventToPolymer=function(t){var n=$("."+t.$id);n[0].bind("checked",new PathObserver(t.sub,"studied"));t.sub.element=n;loaded++;e.percentLoaded="Carregando "+Math.round(loaded/items*100)+"%";$("#loading-progress").width(loaded/items*100+"%");if(loaded==items){setTimeout(function(){$("#loading").animate({opacity:0},300);$("#loading-progress").animate({left:2e3},500);setTimeout(function(){$("#loading").css("display","none");$("#loading-progress").css("display","none");if(showModal)$("#tutorial").modal("show")},600)},100)}};e.defineToggle=function(e){if(e.sub&&e.sub[0])e.hideSubs=false;else delete e.hideSubs};e.add=function(e){if(!e.sub||!e.sub[0])e.sub=[];var t={edit:true,studied:false};e.sub.unshift(t);e.hideSubs=true;e.studied=false};e.remove=function(t,n){if(t.sub[n].desc&&!confirm('Deseja realmente excluir o tópico "'+t.sub[n].desc+'"'))return;t.sub.splice(n,1);e.studied.selfUpdate(t);e.defineToggle(t)};e.teste=function(e){console.log(1)};e.studied={};e.studied.selfUpdate=function(e){var t=e.sub.length>0;for(index in e.sub){if(!e.sub[index].studied){t=false;break}}e.studied=t};e.studied.update=function(t,r){var i;sub=t.sub;sub.studied=!sub.studied;e.studied.updateParents(t.$parent);e.studied.updateChildren(sub);sub.studied=!sub.studied;i=n(function(){sub.studied=sub.element.prop("checked")},200)};e.studied.updateChildren=function(t){for(index in t.sub){t.sub[index].studied=t.studied;e.studied.updateChildren(t.sub[index])}};e.studied.updateParents=function(t){var n=true;if(!t||!t.sub)return;for(index in t.sub.sub){if(!t.sub.sub[index].studied){n=false;break}}t.sub.studied=n;e.studied.updateParents(t.$parent.$parent)};e.validate=function(e){e.edit=!e.desc;e.edited=e.edited==undefined?false:e.edited||e.desc!=e.old_desc};e.initInput=function(e){console.log();e.sub.old_desc=e.sub.desc;n(function(){$("input."+e.$id).focus()},250)};r()}]);window.onbeforeunload=function(){removeProp(screenplay,"element");removeProp(screenplay,"hideSubs");removeProp(screenplay,"search");desactivateReferences(screenplay);if(saveInLocalStorage)localStorage.setItem("screenplay",JSON.stringify(screenplay))};desactivateReferences=function(){for(index in screenplay.references){delete screenplay.references[index].referenceClass;delete screenplay.references[index].opened;delete screenplay.references[index].show}};removeProp=function(e,t,n){delete e[t];if(n)return;for(index in e){if(typeof e[index]=="object")removeProp(e[index],t,n)}}