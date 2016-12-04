
//Fichier des annexes : fonctions disponibles un peu partout 
//elles permettent par exemple de transformer un nombre 7 en une chaine 07 et inversement

angular.module('ServiceAnnexes', ['ServiceConstantes'])
.service('annexes', function(CONSTANTES){
	var objet = this
	this.capitalise =  function(string){
		return string.trim().charAt(0).toUpperCase() + string.slice(1);
				
	}

	this.getPremiereLettre = function(string){
		var tab = string.split("")
		return tab[0]
	}

	this.retirer0_av = function(texte){
		try{
			var l = texte.length
			var mot = "" + texte

			if(texte.charAt(0) == '0'){
				mot = texte.slice(1)
			}
			
			return mot
		}
		catch(error){
			console.log("error retirer0_av")
			return texte
		}
	}

	this.retirer0_av_ap = function(texte){
		try{
			var mot = "" + texte
			
			if(texte.charAt(0) == '0'){
				mot = texte.slice(1)
			}

			var l = mot.length

			if(mot.charAt(l - 1) == '0' && mot.charAt(l - 2) == '0'){
				mot = mot.slice(0, l - 2)
			}
						
			return mot
		}
		catch(error){
			console.log("error retirer0_av_ap")
			console.log(error.message)
			return texte
		}
	}

	this.retirer0_notes = function(texte){
		try{
			// var mot = this.retirer0_av(texte)
			// var l = mot.length

			// if(mot.charAt(l - 1) == '0'){
			// 	return mot.slice(0, l - 1)
			// }
			var mot = texte
			var l = mot.length
			if(mot.charAt(l - 1) == "0") {
				mot = mot.slice(0, l - 1)
			}

			return mot
		}
		catch(error){
			console.log("ERROROROROROROORROOROR")
			console.log(error.message)
			return texte
		}
	}

	

	this.edt_min = function(edt){
		var i = 0
		var edt_min = []

		while(i < CONSTANTES.NOMBRE_JOURS && edt[i]){
			edt_min.push(edt[i])
			i++
		}
		return edt_min
	}

	this.ajouter0_av = function(numero){
		if(numero < 10){
			return "0" + numero
		}
		else{
			return "" + numero
		}
	}

	this.dateToString = function(date){
		return this.ajouter0_av(date.getDate()) + "/" + this.ajouter0_av(date.getMonth() + 1) + " à " + this.ajouter0_av(date.getHours()) + ":" + this.ajouter0_av(date.getMinutes())
	}

	this.fusionObjets = function(obj1, obj2){
		function clone(obj) {
		    if (null == obj || "object" != typeof obj) return obj;
		    var copy = obj.constructor();
		    for (var attr in obj) {
		        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		    }
		    return copy;
		}

		for(var attr in obj1){
			if(obj2[attr]){
				for(var a in obj1[attr]){
					obj2[attr][a] = obj1[attr][a] 
				}
			}
		}
	}

	this.profil = {

		getNom: function(data){
			var nom = $(data).find('#top_container strong')
			var tab = nom.text().trim().split(' ')
			console.log(nom)
			var mot = ''
			var nom_final = ''

			for(var i = 0; i < tab.length; i++){
				mot = tab[i].toLowerCase()
				
				nom_final += objet.capitalise(mot) + ' '

			}
			return nom_final.trim()
		},

		getModulesEtPdv: function(liste){
			var getAbsences = function(liste){
				var absences = 0

				for(var i = 0; i < liste.length; i++){
					var semestre = liste[i]
					for(nom_module in semestre){
						var absences_str = semestre[nom_module].absences
						if(absences_str != "" && absences_str){
							absences += parseInt(absences_str)
						}
					}
				}

				return absences

			}
			var semestres = [{}, {}, {}]

			for(var i = 0; i < liste.length; i++){
				var semestre = liste[i]

				for(nom_module in semestre){
					var module = semestre[nom_module]
					var module_min = {}

					module_min.moyenne = module['moyenne']
					module_min.absences = module['absences']

					semestres[i][nom_module] = module
				}
			}

			return {semestres: semestres, pdv: (CONSTANTES.NOMBRE_VIES - getAbsences(liste))}

		},
		

		getMeteo: function(semestres){
			try{
				var meteo = ""
				var comparateur = {modulesInfMoyenne: [], moyenneGenerale: -1}
				var listeMoyennes = []
				console.log("SEMESTRES____")
				console.log(semestres)
				for(n in semestres){
					for(nom_module in semestres[n]){
						var module = semestres[n][nom_module]
						var tab = module.moyenne.split(' rappel: ')
						var moyenne = parseFloat(tab[tab.length - 1])

						if(module && moyenne){
							if(moyenne < 12){
								// comparateur.modulesInfMoyenne.push(semestres[n][nom_module])
								comparateur.modulesInfMoyenne.push(moyenne)
							}

							console.log("MOYENNE___")
							console.log(moyenne)
							listeMoyennes.push(moyenne)
						}
					}
				}

				if(listeMoyennes.length != 0){
					
					var moyenneCalcul = function(liste){
						var sommeMoyennes = 0
						for(var i = 0; i < liste.length; i++){
							sommeMoyennes += liste[i]
						}
						console.log("SOMME DES MOYENNES____")
						console.log(sommeMoyennes)
						return sommeMoyennes/liste.length
					}
					

					comparateur.moyenneGenerale = moyenneCalcul(listeMoyennes)
					console.log("COMPARATEUR")
					console.log(comparateur)
					switch(comparateur.modulesInfMoyenne.length){
						case 0:
							if(comparateur.moyenneGenerale < 12.2 ){
								meteo = CONSTANTES.METEO_NIVEAU[7]
							}
							else if(comparateur.moyenneGenerale < 12.5){
								meteo = CONSTANTES.METEO_NIVEAU[8]
							}
							else if(comparateur.moyenneGenerale < 13){
								meteo = CONSTANTES.METEO_NIVEAU[9]
							}
							else if(comparateur.moyenneGenerale < 14){
								meteo = CONSTANTES.METEO_NIVEAU[10]
							}
							else if(comparateur.moyenneGenerale < 16){
								meteo = CONSTANTES.METEO_NIVEAU[11]
							}
							else{
								meteo = CONSTANTES.METEO_NIVEAU[12]
							}
							break;
						
						case 1: 
							var moyenneModulesInfM = moyenneCalcul(comparateur.modulesInfMoyenne)
							if(moyenneModulesInfM > 10){
								meteo = CONSTANTES.METEO_NIVEAU[6]
							}
							else if(moyenneModulesInfM > 8){
								meteo = CONSTANTES.METEO_NIVEAU[5]
							}
							else{
								meteo = CONSTANTES.METEO_NIVEAU[4]
							}
							break;

						case 2: 
							var moyenneModulesInfM = moyenneCalcul(comparateur.modulesInfMoyenne)
							if(moyenneModulesInfM > 10){
								meteo = CONSTANTES.METEO_NIVEAU[3]
							}
							else{
								meteo = CONSTANTES.METEO_NIVEAU[2]
							}
							break;

						case 3: 
							meteo = CONSTANTES.METEO_NIVEAU[1]
							break;

						default: 
							meteo = CONSTANTES.METEO_NIVEAU[0]
							break;
					}

				}
				else{
					meteo = CONSTANTES.METEO_NIVEAU_DEFAULT
				}
				return meteo
			}
			catch(error){
				console.log("error Meteo")
				console.log(error.message)
				return CONSTANTES.METEO_NIVEAU_DEFAULT
			}
			
			
			
		}

	}
})
