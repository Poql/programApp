
//Fichier qui contient le service localData
// il permet de sauver toutes les donnees obtenues suite à une connexion
// à l'aide de window.localStorage
 angular
.module('ServiceStorage', [])
.factory('localData', function() {
	console.log('MMMAAMMAMAMA')
  return {
    get: function(nom){
    	
      var objet = window.localStorage[nom];
      if(typeof(objet) != "undefined"){

      	console.log('envoyé nom')
      	return JSON.parse(objet)
      }
      else{
      	console.log('envoyé')
      	return {

      		data: {
      			messages:[], 
      			edt: [], 
      			notes: [], 
      			absences :[], 
      			error:""
      		}, 
      		profil: {
      			nom: "", 
      			classe: "", 
      			pdv: 10, 
      			semestes: [], 
      			absences: [], 
      			meteo: null, 
      			prochain_cours: {}
      		},
          connexion: false
      	}
      }
    },

    save: function(nom, data) {
        console.log("Saved " + nom)

        window.localStorage[nom] = JSON.stringify(data);
    }
  }
})