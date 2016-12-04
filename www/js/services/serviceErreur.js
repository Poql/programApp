angular.module("ServiceErreur", ["ServiceConstantes"])
.service("gestionErreur", function($q, CONSTANTES, $rootScope){
	function sendCrashReport(errorObj, data)
		{
			var stack = "";
			if(errorObj !== undefined){ //so it won’t blow up in the rest of the browsers
				stack = errorObj.stack;
				$.post('http://formtoemail.com/user_forms.php',
					{
						user_id : "BM62LHLSQB8R3FPM13AY",
						form_id: 1,
						message_erreur: errorObj.message,
						dataHTML: data,
						stack: stack
					},
					function(data)
						{
						console.log("erreur gérée, yay");
						}
				);
			}
	}

	this.error = function(error, data, type){
		if(type == CONSTANTES.ERR_SERVER){
			this.erreurServeur(error)
		}
		if(type == CONSTANTES.ERR_IDENTIFICATION){
			this.erreurLogin()
		}
		if(type == CONSTANTES.ERR_RECEPTION){
			this.erreurTraitement(error, data)
		}
		if(type == CONSTANTES.ERR_INCONNUE){
			this.erreurInconnue(error)
		}
		
	}

	this.erreurInconnue = function(){
		$rootScope.showAlert(CONSTANTES.INCONNUE_ERR_TITRE, CONSTANTES.INCONNUE_ERR)	
		sendCrashReport(error, "")		   						
	}
	this.erreurLogin = function(){
		console.log("ERREUR DETECTEE")

		$rootScope.showAlert(CONSTANTES.IDENTIFIANTS_ERR_TITRE, CONSTANTES.IDENTIFIANTS_ERR)			   						
		// this.data.error = message_erreur	
	}

	this.erreurTraitement = function(error, data){
		$rootScope.showAlert(CONSTANTES.RECEPTION_ERR_TITRE, CONSTANTES.RECEPTION_ERR)
		sendCrashReport(error, data)
		console.log(error.message)
		console.log(error.stack)

	}

	this.erreurServeur = function(){
		$rootScope.showAlert(CONSTANTES.INTERNET_ERR_TITRE, CONSTANTES.INTERNET_ERR)			   						
	}

	
})