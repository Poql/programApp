this.selectNotes = function(data){
			//Renvoie une liste de 2 éléments, 0 : premier semestre et 1: second semestre
			//un semestre est de la forme : {nom_ue1:  module1, nom_ue2 : module2  ...}
			//ue = module
			//un module est de la forme : {moyenne: m, absence: a, credit: c, moyenne_rappel: mr, matieres: [{nom_matiere: nm, coefficent: co, note: no, detail: d}
			//$(data).find('table') ne fonctionne pas ici


			var index_1 = {0: 'nom_ue', 1: 'moyenne', 2: 'absences', 3: '', 4: 'credit', 5: 'moyenne_rappel'}
			var index_2 = {0: 'nombre_ue', 1: 'nom_matiere', 3: 'num_ue', 5: 'coefficient', 6: 'note', 8: 'detail'}
				
			var classe = ""
					
			var liste_semestres = [{}, {}, {}]
			var liste_modules_7 = {}
			var liste_modules_9 = {}
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
						var module = {matieres: []}

						ligne
						.find('td')
						.each(function(t){
							var bulle = $(this).text().trim()

							//Si bulle non vide
							if(bulle != ""){
								//si bulle != de chose pas interressante 
								if(t != 3 && t != 0){ 
									//on complete l'objet module
									module[index_1[t]] = bulle
								}

								//on attrape le nom du module
								if(t == 0){
									nom_module = bulle
									console.log(nom_module)
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
									var tab = bulle.split(' ')
									var numero = parseInt(tab[1].split("-")[1])

									if(numero){
										numero_semestre = numero
									}
									else{
										numero_semestre = 3
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
							liste_modules_9[nom_module].numero_semestre = numero_semestre
						}
						
						
					}
					nombre_9++
				}
				annexes.fusionObjets(liste_modules_7, liste_modules_9)
				
				for(nom_module in liste_modules_9){
					liste_semestres.numero_semestre[nom_module] = liste_modules_9[nom_module]
				}
			})

			return {notes: liste_semestres, classe: classe};
		}