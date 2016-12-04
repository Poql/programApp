
//Fichier qui contient un service qui permet de transformer les differentes pages HTML en objet Javacript
//Il utilise pour cela jQuery

angular.module('ServiceTraitement', ['ServiceAnnexes', 'ServiceConstantes'])
.service('traitement', function(annexes, CONSTANTES){
	this.error = function(data){
		//detection d'une identification incorrecte
		//dans le cas d'une telle erreure, le serveur renvoie la page d'identification contenant en plus une petite balise p contenant 
		// le texte "identification incorerecte"

		return $($(data).find('p')[0]).text().trim().toLowerCase() == "identification incorrecte"
	}
			
	this.selectMessages = function(data){
		var list = [],
			selection = 'li',
			espace = ' '

		console.log($(data).find('ul.list li'))
		$(data).find('ul.list li').each(function(index){
			list.push({index: index, texte: $(this).html()})
		})

		return list
	}

	this.selectAbsences = function(data){
		//renvoie la liste d'absences
		//une absence est de la forme : {'date' : d, "heure" : h, "type" : t, "duree" : d, "ue" : u}
		var index = {0: 'date', 1: 'classe', 2: 'heure', 3: 'matiere', 4: 'type', 5:'duree', 6: 'ue'}
		var liste_absences = []
				
		$(data)
		.find('tr')
		.each(function(i){
			if(i != 0){
				var ligne = $(this)
				var absence = {}

				ligne
				.find('td')
				.each(function(t){
					var bulle = $(this).text().trim().toLowerCase()
					if(t == 0){
						absence[index[t]] = bulle.split('-')
					}
					else if(t == 3 || t == 4){
						absence[index[t]] = bulle.charAt(0).toUpperCase() + bulle.slice(1)
					}
					else if(t == 2){
						
						absence[index[t]] = annexes.retirer0_av_ap(bulle)
						
					}
					else{
						absence[index[t]] = bulle
						}
					})

				liste_absences.push(absence)
			}
		})
		console.log("ABSENCES__")
		console.log(liste_absences)
		return liste_absences
	}

	this.selectEdt = function(data){
		//Renvoi une liste de jours, ici listeJours 
		//un jour est de la forme : {date: '', matieres: [{horaire: h, nom_matiere: nom, groupe: g, type: t, professeur: p,duree: d, salle: , observation: }, ...]}

		var index = {1: 'classe', 2: 'horaire', 3: 'nom_matiere', 4: 'groupe', 5: 'type', 6: 'professeur',7: 'duree', 8: 'salle', 9: 'observation'}
		var listeJours = []
		var jour = {date: '', matieres: []}
		var pasdefini = false


		var capitalise =  annexes.capitalise
		var retirer0_av_ap = annexes.retirer0_av_ap
		var retirer0_av = annexes.retirer0_av
				
			$(data)
			.find('table[width="100%"]')
			.find('tr')
			.each(function(i){
				if(i != 0){
					var ligne = $(this)
					var l = {}

					ligne
					.find('td')
					.each(function(t){
						var bulle = $(this)
						var text = bulle.text().trim().toLowerCase()

						if(text != ""){
							if(t == 1){
								l[index[t]] = text.toUpperCase()
							}
							else if(t == 0){
								if(jour.date != text && text != ""){
									if(jour.date != ""){
										listeJours.push(jour)
									}

									pasdefini = true
									var tab_date = text.split(" ")
									text = tab_date[0] + " " + annexes.retirer0_av(tab_date[1]) + " " + tab_date[2]
									jour = {date: text, matieres: []}
								}
							}

							else if(t == 7){
								//calcul heure de fin
								var tab_d = text.split('h')
								var tab_h = l.horaire.split('h')

								var min = parseInt(tab_h[0]) * 60 + parseInt(tab_h[1]) + parseInt(tab_d[0]) * 60 + parseInt(tab_d[1])
								var minutes = min % 60
								var minutes_fin = minutes

								if(minutes < 10){
									minutes_fin = "0" + minutes
								}
											
								l['fin'] = parseInt(min / 60) + 'h' + minutes_fin

								//definition de l'attribut duree
								l[index[t]] = retirer0_av_ap(text)
							}

							else if(t == 2){
								l[index[t]] = retirer0_av(text)
							}

							else if(t == 4){
								if(text == '-'){
									l[index[t]] = ""
								}
								else{
									var tab = text.split('/')

									l[index[t]] = retirer0_av(tab[0]) + '/' + retirer0_av(tab[1])
								}
							}
							
							else if(t == 3){
								l[index[t]] = capitalise(text)																	
							}
							else{
								l[index[t]] = capitalise(text)
							}
						}
						
						else{
							if(t == 3){
								l[index[t]] = "Autre"
							}
							else{
								l[index[t]] = CONSTANTES.INDICATEUR_CASE_VIDE
							}
										
						}
					})

								
					horaire = l.horaire.split('h')
					if(pasdefini && horaire){
						if(parseInt(horaire[0]) * 60 + parseInt(horaire[1]) >= 12 * 60){
							pasdefini = false
							l.dejeuner = true
						}
						else{
							l.dejeuner = false
						}
					}
		
					else{
						l.dejeuner = false
					}

					jour.matieres.push(l)
				}
			})

			// var listeMatieres = []

			// for(var i = 0; i < listeJours.length; i++){
			// 	var jour = listeJours[i]
			// 	for(var j = 0; j < jour.matieres.length; j++){
			// 		var matiere = jour.matieres[j]
			// 		matiere.date = jour.date
			// 		listeMatieres.push(matiere)
			// 	}
			// }
			// //{date: '', matieres: [{horaire: h, nom_matiere: nom, groupe: g, type: t, professeur: p,duree: d, salle: , observation: }, ...]}
			// console.log("LISTE MATIERES !!")
			// console.log(listeMatieres)
			
			return listeJours;
		}

		this.selectNotes = function(data){
			//Renvoie une liste de 2 éléments, 0 : premier semestre et 1: second semestre
			//un semestre est de la forme : {nom_ue1:  module1, nom_ue2 : module2  ...}
			//ue = module
			//un module est de la forme : {moyenne: m, absence: a, credit: c, moyenne_rappel: mr, matieres: [{nom_matiere: nm, coefficent: co, note: no, detail: d}
			//$(data).find('table') ne fonctionne pas ici


			var index_1 = {0: 'nom_ue', 1: 'moyenne', 2: 'absences', 3: '', 4: 'credit', 6: 'moyenne_rappel', 5:"note_ects"}
			var index_2 = {0: 'nombre_ue', 1: 'nom_matiere', 3: 'num_ue', 5: 'coefficient', 6: 'note', 8: 'detail'}
				
			var classe = ""
					
			var liste_semestres = [{}, {}, {}]
			var liste_modules_7 = {}
			var liste_modules_9 = {}
			var error_semestre = false
			// var liste_semestres = []

					
			var nombre_7 = 0 // est augmenter d'un à chaque fois qu'une ligne de taille 7 est decouverte,
							  // on peut savoir à la premiere fois que l'on en rencontre une pour pouvoir ne pas prendre en compte la premiere ligne  
			var nombre_9 = 0 // de meme pour 9

			$(data)
			.find('tr')
			.each(function(i){
				var ligne = $(this)
				var nombre_de_cases = 0
				var nom_module = ''

				//determination de la taille de la ligne = nombre de case
				ligne.find('td').each(function(u){
					nombre_de_cases++
				})
				//cas 0, tout petit tableau contenant la classe
				if(nombre_de_cases == 1){
					ligne
					.find('td')
					.each(function(t){
						var tableau = $(this).text().trim().split(':')
						classe = tableau[tableau.length - 1].trim()
						console.log(classe)
					})
				}
				//cas 1, petit tableau, création des modules avec les éléments de l'index_1
				if(nombre_de_cases == 7){

					//cas ou la ligne de taille 7 n'est pas la premiere de découverte
					if(nombre_7 != 0){
						//creation d'un module
						var module = {}

						ligne
						.find('td')
						.each(function(t){
							var bulle = $(this).text().trim()

							//Si bulle non vide
							if(bulle != ""){
								//si bulle != de chose pas interressante 
								if(t != 3 && t != 0 && t != 1){ 
									//on complete l'objet module
									module[index_1[t]] = bulle
								}

								//on attrape le nom du module
								if(t == 0){
									nom_module = bulle
									console.log(nom_module)
								}

								if(t == 1){
									module[index_1[t]] = annexes.retirer0_notes(bulle)
								}
							}
							else{
								module[index_1[t]] = ""
							}
							//on détermine le numero du semestre à partir du nom du module = derniere lettre
							// var n = parseInt(nom_module.split('')[nom_module.length - 1] % 2);
							// console.log(n)

							// if(n != 0 && n != 1){
							// 	n = 2
							// }
							//on remplie le semestre avec le module 
							liste_modules_7[nom_module] = module

						})
					}

					nombre_7++
				}

			//cas 2, tableau avec le détail des notes de chaque matiere
			//création des objets matieres avec les attributs de l'index_2 puis remplissage des listes de matieres des modules
			
				if(nombre_de_cases == 9){
					

					if(nombre_9 != 0){
						//creation d'un objet matiere
						var matiere = {}
						//nom du module correspondant
						var nom_module = ''
						//numero du semestre correspondant
						var numero_semestre = 0

						ligne
						.find('td')
						.each(function(t){

							var bulle = $(this).text().trim()

							//si bulle non vide
							if(bulle != ""){
								//cas interressants

								if(t == 0){
									try{
										var tab = bulle.split(' ')
										var numero = parseInt(tab[1].split("-")[1])

										if(numero){
											numero_semestre = numero
										}
										else{
											numero_semestre = 3
										}
									}
									catch(error){
										// impossible de déterminer le semestre
										numero_semestre = 3
										error_semestre = true
									}								
								}
								else if(t != 0 && t != 2 && t != 4 && t != 7 && t != 3 && t != 6){
									matiere[index_2[t]] = bulle
								}
								else if(t == 6){
									var tab = bulle.split(' rappel: ')
									matiere[index_2[t]] = tab[0].trim()
									if(tab[1]){
										matiere[index_2[t]] += CONSTANTES.INDICATEUR_NOTE_RAPPEL + tab[1].trim()
									}
								}
								//determination du nom du module dans lequel appatient la matiere
								else if(t == 2){

									nom_module = bulle
									//puis du numero£
									
								}
							}
							else{
								matiere[index_2[t]] = CONSTANTES.INDICATEUR_CASE_VIDE
							}
						})

						//on remplie la liste des semestres

						//Avant que des notes soient données par le BVE, le tableau de 7 lignes n'est pa donné
						//par conséquence, on a besoin de compléter les objet semestre avant d'ajouter les matieres aux modules
						
						//Si le tableau de 7 lignes est présent, un objet module du nom "nom_module" est présent dans l'objet semestre
						//donc on a juste à le remplir
						if(liste_modules_9[nom_module]){
							liste_modules_9[nom_module]['matieres'].push(matiere)
						}

						//Si le tableau n'est pas présent 
						//les objets semestre (1 ou 2) sont vides
						//on doit donc crée un objet module et le placer dans un des semestres dans lequel, il appartient
						else{
							//on le cree au semestre auquel il appartient
							
							liste_modules_9[nom_module] = {moyenne: ""}
							//on le complete
							liste_modules_9[nom_module].nom_module = nom_module
							liste_modules_9[nom_module].matieres = []
							liste_modules_9[nom_module].matieres.push(matiere)
							console.log(numero_semestre)
							liste_modules_9[nom_module].numero_semestre = numero_semestre
						}
						
						
					}
					nombre_9++
				}
			})
			console.log("LISTE  NUMERO 7")
			console.log(liste_modules_7)
			console.log("LISTE NUMERO 9")
			console.log(liste_modules_9)
			annexes.fusionObjets(liste_modules_7, liste_modules_9)
			
			console.log(liste_modules_9)
			for(nom_module in liste_modules_9){
				var module = liste_modules_9[nom_module]
				console.log(module)
				liste_semestres[liste_modules_9[nom_module].numero_semestre - 1][nom_module] = liste_modules_9[nom_module]
			}

			// return {notes: [{CM1:{moyenne:"1.1"}, CM2:{moyenne:"1"}, TM1:{moyenne:"1"}}, {UI:{moyenne:"1"}}], classe: classe}
			return {notes: liste_semestres, classe: classe, error_semestre: error_semestre};
		}
	
})