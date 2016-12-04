
//Fichier qui contient le coeur de l'appli : un service (Data) qui fait le lien entre les 3 autres (requete, traitement et localData)
//Il contient 2 attributs : data et profil qui sont liés aux controllers et donc permet donc l'acces aux donnes aux pages

angular.module('ServiceData', ['ServiceRequetes', 'ServiceAnnexes', 'ServiceStorage', 'ServiceTraitement', 'ServiceErreur'])
.service('Data', function(annexes, localData, traitement, $rootScope, requete, CONSTANTES, $q ,gestionErreur){
	var local = localData.get('objet')
	console.log("USER USER USER")
			
	this.data = local.data
	this.profil = local.profil
	this.connexion = local.connexion
	this.numChargement = 0
	this.classeProvisoire = ""
	this.saveUser = false

	this.chargement = function(){
		if(this.numChargement < 4){
			this.numChargement++
		}
		
	}

	//GETTERS ET SETTERS
	this.setConnexion = function(connexion){
		this.connexion = connexion
	}
	this.getData = function(){
		return this.data;
	}

	this.getProfil = function(){
		return this.profil;
	}

	this.setData= function(cle, valeur){
		this.data[cle] = valeur
	}

	this.setProfil = function(cle, valeur){
		this.profil[cle] = valeur
	}

	//CONNEXION 
	this.login = function(user, saveUser){
		//fonction qui permet de ce connecter au BVE 
		//elle prend un argument user qui contient le login et le password
		//et un argument boolean saveUser qui permet de savoir si oui ou non on enregistre l'user donné en premier argument
		try{
			var objet = this
			this.numChargement = 0

			requete
			.connexion(user)
			.then(
				function(response){
					console.log("😚 : " + response)
					//post connexion
					//verification identifiants à l'aide de la fonction traitement.error
					if(!traitement.error(response.data)){

						//reception et traitement des messages
						objet.receptionMessages(response.data)

						//requete pour les absences
						requete.getAbsences()
						.then(

							function(response){
								//post get absences
								//reception et traitement des absences
								objet.receptionAbsences(response.data)
							}
							,
							function(){objet.error(new Error("erreur absence"), CONSTANTES.ERR_SERVER)}
						)

						//requete notes
						requete.getNotes()
						.then(
							function(response){
								//post get notes
								//reception et traitement des notes et de la classe
								objet.receptionNotes(response.data, user)
								
								//puis requete emploi du temps qui nécessite de connaitre la classe obtenue par la requete notes
								console.log("CLASSE CLASSE CLASSE")
								console.log(objet.classeProvisoire)
								console.log(annexes.getPremiereLettre(objet.classeProvisoire)) 
								
								if(annexes.getPremiereLettre(objet.classeProvisoire) == "B"){
									console.log("USER USER USER")
									console.log(user)

									if( user.bia == undefined ){
										var bia = function(indexButton){
											if(indexButton == 1){
												objet.classeProvisoire += "BIA"
												user.bia = true
											}
											else{
												user.bia = false
											}

											objet.suiteFin(user, saveUser)
										}

										navigator.notification.confirm(
										    CONSTANTES.MESSAGE_BIA,  // message
										    bia,                  // callback to invoke
										    CONSTANTES.TITRE_BIA,            // title
										    ['oui','non']              // defaultText
										)

										
									}
									else if (user.bia){
										objet.classeProvisoire += "BIA"
										objet.suiteFin(user, saveUser)
									}
									else{
										objet.suiteFin(user, saveUser)
									}
								}
								else{
									objet.suiteFin(user, saveUser)
								}
								
							},

							function(){objet.error(new Error("erreur notes"), CONSTANTES.ERR_SERVER)}
							
						)

					}

					else{
						//erreur d identification
						objet.error(new Error("erreur identification"), CONSTANTES.ERR_IDENTIFICATION)
						
					}
				},

				function(){objet.error(new Error("erreur connexion"), CONSTANTES.ERR_SERVER)}
				
			)
		}
		catch(error){
			this.error(error, CONSTANTES.ERR_INCONNUE)
		}
	}

	//GESTION RECEPTION

	this.receptionMessages = function(data){
		try{
			var messages = traitement.selectMessages(data)
			
			//transformation de data contenant du HTML en un objet javascript
			var nom = annexes.profil.getNom(data)

			//mofication des attributs messages et nom du profil
			this.setData("messages", messages)

			
			this.setProfil("nom", nom)
			this.chargement()
		}
		catch(error){
			this.error(error, CONSTANTES.ERR_RECEPTION, data)
		}

	}

	this.receptionAbsences = function(data){
		try{
			console.log("REPONSE ABSENCE")
		
			var absences = traitement.selectAbsences(data)

			//mofication des absences

			this.setProfil("absences", absences)
			this.chargement()
		}
		catch(error){
			this.error(error, CONSTANTES.ERR_RECEPTION, data)
		}
	}

	this.receptionEdt = function(data){
		try{
			var edt = traitement.selectEdt(data)

			//mofication de l'emploi du temps
			
			this.setData("edt", annexes.edt_min(edt))
			this.chargement()
		}
		catch(error){
			this.error(error, CONSTANTES.ERR_RECEPTION, data)
		}
		
	}

	this.receptionNotes = function(data, user){
		try{
			var resultat = traitement.selectNotes(data)
			var notes = resultat.notes
			var classe = resultat.classe
			var error_semestre = resultat.error_semestre
			
			if(error_semestre && user.error_semestre == undefined){
				$rootScope.$broadcast('error_semestre')
				user.error_semestre = false
			}
			else{
				user.error_semestre = false
			}
			//modification des notes et la classe
			this.setData("notes", notes)

			// this.setProfil("classe", classe)
			this.classeProvisoire = classe
			// this.classeProvisoire = "B1"
			// this.classeProvisoire = ""

			var resultatProfil = annexes.profil.getModulesEtPdv(notes)

			this.setProfil("pdv", resultatProfil.pdv)
			this.setProfil("semestres", resultatProfil.semestres)
			this.setProfil("meteo", annexes.profil.getMeteo(notes))
			console.log("METEO____")
			console.log(this.profil.meteo)
			this.chargement()
		}
		catch(error){
			this.error(error, CONSTANTES.ERR_RECEPTION, data)
		}
	}

	//GESTION ERREUR INDENTIFIATION, SERVEUR ET SUCCES
	this.error = function(error, type, dataHTML){
		console.log("ERReur")
		console.log(type)
		this.fin()
		gestionErreur.error(error, dataHTML, type)
	}

	// this.identifiantsError = function(){
	// 	console.log("Identifiants incorrects")
	// 	this.fin()

	// 	$rootScope.showAlert(CONSTANTES.IDENTIFIANTS_ERR_TITRE, CONSTANTES.IDENTIFIANTS_ERR)			   						
	// }

	this.succes = function(user){
		//enregistre le profil et les data dans le dur à l'aide du service localData
		//si l'attribut user est donné, il est ajouté à l'attribut profil avant que celui ci soit enregistré
		if(user){
			var date = new Date()
			user.dateConnexion =  annexes.dateToString(date)
			this.setProfil("user", user)
		}
		this.setConnexion(true)
		var objet = {data: this.data, profil: this.profil, connexion: true}
		localData.save("objet", objet)

		//c'est fini 
		this.fin()
		this.close_login()

		console.log("connexion réussie")
	}

	this.suiteFin = function(user, saveUser){
		this.setProfil("classe", this.classeProvisoire)
		var objet = this
		requete.getEdt(objet.profil.classe)

				.then(
					
					function(response){
						
						//post get edt
						//reception et traitement de l'emplois du temps
						objet.receptionEdt(response.data)


						//succes 
						if(saveUser){
							objet.succes(user)
						}
						else{
							objet.succes()
						}
						
					}
					,
					function(){objet.error(new Error("erreur edt"), CONSTANTES.ERR_SERVER)}
				)
	}

	

	

	this.fin = function(){
		//c'est la fin, on coupe l'icone de rafraichiment et de chargement si ils étaient activés
		$rootScope.$broadcast('scroll.refreshComplete')
		$rootScope.hide()

	}

	this.close_login = function(){
		//envoie l'evenemetn de fermeture de la page login
		console.log("Fin chargement")
		$rootScope.$broadcast('close_login')
	}

	this.refresh = function(){
		
		this.login(this.profil.user, true)
	}

})