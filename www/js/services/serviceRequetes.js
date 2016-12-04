
//Fichier qui contient le service requete
//Il gere tout ce qui demande d'utiliser le module $http
//Il ne depend donc que de lui, du module $q et des constantes

angular.module('ServiceRequetes', ['ServiceAnnexes', 'ServiceConstantes'])
.service('requete', function($http, CONSTANTES, $q){

	//SORTE D'ANNEXES 
	this.requetePOST = function(url, option){
		return $http.post(url, option)
	}

	this.requete = function(url){
		return $http.get(url)
	}

	this.requeteFrame = function(url, urlFrame){
        //permet d'envoyer une requete pour la page d'url url contenant une frame d'url urlFrame
        //puis d'envoyer une requte pour la page d'url urlFrame
        //en effet, on ne peut pas demander directement la page urlFrame, le serveur retournerait une page d'identifiaction
        //ca doit etre une sorte de securité

		var objet = this
		var callback = function(response){
			return objet.requete(urlFrame)
		}

		var callbackError = this.callbackError

		return this.requete(url).then(callback, callbackError)
	}

    this.callbackError = function(response){
        
    	return $q.reject(response.data.error)
    }
	
	//METHODES
	this.connexion = function(user){
		console.log("requete connexion done")
        
		return this.requetePOST(CONSTANTES.URL_CONNEXION, {login: user.login, password: user.password})
	}

    this.getNotes = function(){
    	console.log("requete notes done")
    	return this.requeteFrame(CONSTANTES.URL_NOTES, CONSTANTES.URL_NOTES_FRAME)
    }

    this.getEdt = function(classe){
    	console.log("requete edt done")
    	var objet = this
    	var callback = function(){
    		return objet.requetePOST(CONSTANTES.URL_EDT_FRAME, {classe: classe})
    	}
    	var callbackError = this.callbackError

    	return this.requete(CONSTANTES.URL_EDT).then(callback, callbackError)
    }

    this.getAbsences = function(){
    	return this.requeteFrame(CONSTANTES.URL_ABSENCES, CONSTANTES.URL_ABSENCES_FRAME)
    }
})