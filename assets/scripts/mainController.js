/*
 * @author Dayman Novaes. 2014. All rights reserved.
 */
var screenplay;var saveInLocalStorage=true;var showModal=localStorage.getItem("screenplay.showModal")!=undefined?localStorage.getItem("screenplay.showModal"):"true";var countObjectInit=0;var countObject=0;var band=1;var toAdd=[];SPapp.controller("mainController",["$scope","$http","$timeout",function(e,t,n){var r=new Date("11-08-2014");var i=new Date;e.diffDate=Math.floor((r-i)/(1e3*60*60*24));e.loadScreenplay=function(){var n,r;e.$loading=$("#loading");e.$loading.text("Carregando conteúdo do servidor");if(localStorage.getItem("screenplay2")){e.screenplay=JSON.parse(localStorage.getItem("screenplay2"));screenplay=e.screenplay;e.loadRevision()}else{t.get("static/json/screenplay.json").success(function(t){e.screenplay=t;localStorage.setItem("screenplay2",JSON.stringify(t));screenplay=t}).then(e.loadRevision)}};e.loadRevision=function(){e.$loading.text("Verificando alterações");t.get("static/json/revision2.json").success(function(t){new_revision=t.revision;e.revision=new_revision}).then(e.handleRevisions);countObject=countAllObjects(screenplay);Incer.init(countObject*band)};e.handleRevisions=function(){old_revision=parseInt(localStorage.getItem("screenplay.revision2"))||0;localStorage.setItem("screenplay.revision2",new_revision);var n=function(e,t){for(index in e){var n=e[index];if(n.revision==t)return n}};if(old_revision)localStorage.setItem("screenplay.showModal",false);if(old_revision!=new_revision){t.get("static/json/revisions.json").success(function(t){e.$loading.text("Carregando alterações na tela");while(old_revision!=new_revision){var r=n(t,++old_revision).objects;e.handleRevisionEspecific(r)}})}};e.handleRevisionEspecific=function(t){for(index in t){var n=t[index];var r=getObjectById(e.screenplay,n.parentId);if(r&&r.sub instanceof Array){r.sub.push(n);removeProp(n,"parent");Incer._inc(countAllObjects({a:n}))}}};e.template={};e.template.children=function(e){return e.sub?"static/templates/subs.html":""};e.template.edit=function(e){return e.edit?"static/templates/edit-sub.html":"static/templates/sub.html"};e.toggle=function(e){if(e.sub&&e.sub[0])e.hideSubs=!e.hideSubs};e.toggleref=function(t){var n=t.$parent.activeReference;if(n)n.show="reference-content-container-false";t.$parent.opened=false;t.reference.search=false;t.reference.referenceClass="reference-title";if(n==t.reference){delete t.$parent.activeReference;return}t.$parent.activeReference=t.reference;t.reference.referenceClass="reference-title-true";t.$parent.opened=true;t.reference.search=true;e.collapseAll(t.reference.sub);t.reference.show="reference-content-container-true"};e.collapseAll=function(t){for(index in t){if(t[index].sub&&t[index].sub[0]){t[index].hideSubs=true;e.collapseAll(t[index].sub)}}};e.getPercentChildrenComplete=function(e){var t=0;var n=e.sub.length;var r;for(index in e.sub){if(e.sub[index].rate)t+=e.sub[index].rate;else if(e.sub[index].studied)t++}r=t/n;r=r||0;e.rate=r;return Math.floor(r*10)};e.subClass=function(t){var n=" opened_"+t.hideSubs;n+=" sub-li";n+=" complete-"+e.getPercentChildrenComplete(t);n+=t.edited?" sub-li-edited":"";n+=t.studied?" sub-li-studied":"";return n};e.init=function(t){e.$loading.text("Carregando conteúdo na tela");if(!t.sub.studied)t.sub.studied=false;if(!t.sub.sub)t.sub.sub=[];countObjectInit++;if(countObjectInit+4>=countObject){$("#loading").css("display","none");if(showModal=="true"){$("#tutorial").modal("show");showModal="false";localStorage.setItem("screenplay.showModal",false)}}};e.upItem=function(t,n){if(n==0){if(t.$parent.sub)e.upLevelItem(t.$parent,t.sub,n)}else e.changePosition(t,n-1,n);e.defineToggle(t.sub)};e.downItem=function(t,n){if(n==t.sub.sub.length-1){console.log("finish");return}e.changePosition(t,n+1,n)};e.changePosition=function(e,t,n){parent=e.sub.sub;var r=angular.copy(parent[n]);var i=angular.copy(parent[t]);parent[n]=i;parent[t]=r};e.upLevelItem=function(e,t,n){var r=angular.copy(t.sub[n]);t.sub.splice(n,1);var i=e.sub.sub;var s=i.indexOf(t);i.splice(s,0,r)};e.defineToggle=function(e){if(e.sub&&e.sub[0]){e.hideSubs=false}else{delete e.hideSubs;e.templateChildren=""}};e.add=function(e){if(!e.sub||!e.sub[0])e.sub=[];var t={edit:true,studied:false,id:Incer.inc(),parent:e,parentId:e.id};e.sub.unshift(t);if(!hasParentInArray(toAdd,t))toAdd.push(t);e.hideSubs=true;e.studied=false};e.remove=function(t,n){if(t.sub[n].desc&&!confirm('Deseja realmente excluir o tópico "'+t.sub[n].desc+'"'))return;t.sub.splice(n,1);e.studied.selfUpdate(t);e.defineToggle(t)};e.teste=function(e){console.log(1)};e.studied={};e.studied.selfUpdate=function(e){var t=e.sub.length>0;for(index in e.sub){if(!e.sub[index].studied){t=false;break}}e.studied=t};e.studied.update=function(t,n){var r;sub=t.sub;e.studied.updateParents(t.$parent);e.studied.updateChildren(sub)};e.studied.updateChildren=function(t){for(index in t.sub){t.sub[index].studied=t.studied;e.studied.updateChildren(t.sub[index])}};e.studied.updateParents=function(t){var n=true;if(!t||!t.sub)return;for(index in t.sub.sub){if(!t.sub.sub[index].studied){n=false;break}}t.sub.studied=n;e.studied.updateParents(t.$parent.$parent)};e.validate=function(e){e.edit=!e.desc};e.initInput=function(e){n(function(){$("input."+e.$id).focus();$("input."+e.$id).click()},250)};e.loadScreenplay()}]);window.onbeforeunload=function(){removeProp(screenplay,"parent");removeProp(screenplay,"hideSubs");removeProp(screenplay,"search");desactivateReferences(screenplay);if(saveInLocalStorage)localStorage.setItem("screenplay2",JSON.stringify(screenplay))};desactivateReferences=function(){for(index in screenplay.references){delete screenplay.references[index].referenceClass;delete screenplay.references[index].opened;delete screenplay.references[index].show}};removeProp=function(e,t,n){delete e[t];if(n)return;for(index in e){if(e[index]&&typeof e[index]=="object")removeProp(e[index],t,n)}}