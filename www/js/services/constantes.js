
//Fichier des constantes

angular.module("ServiceConstantes", [])
.factory("CONSTANTES", function(){
	var urlBase = "https://papei.estp.fr/notelv/src/www08e"
	var service = urlBase + "/service.php?id="
    
	return {

		//URLS
		URL_CONNEXION: "https://papei.estp.fr/notelv/src/www08e" + "/session/login_a.php",

    	URL_EDT: service + "emploi_du_temps",
    	URL_EDT_FRAME: "https://papei.estp.fr/notelv/src/edt.php",

    	URL_NOTES: service + "notes",
    	URL_NOTES_FRAME: "https://papei.estp.fr/notelv/src/notelv_nais.php",
        // URL_NOTES_FRAME: "file:///Users/gaetanzanella/Desktop/error.html",

    	URL_ABSENCES: service + "absences",
    	URL_ABSENCES_FRAME: "https://papei.estp.fr/notelv/src/abs.php",

    	//MESSAGES ERREUR
    	INTERNET_ERR_TITRE: "Connexion impossible",
    	INTERNET_ERR: "Vérifiez votre connexion internet",

    	IDENTIFIANTS_ERR_TITRE: "Identifiants incorrects",
    	IDENTIFIANTS_ERR: "Réessayez",

        RECEPTION_ERR_TITRE: "Erreur de traitement",
        RECEPTION_ERR: "Un rapport d'erreur a été envoyé",

        ERR_SEMESTRE_MESS:"Votre BVE ne permet pas de déterminer dans quel semestre se trouve toutes les UE",
        ERR_SEMESTRE_TITRE:"Oups  !",

        INCONNUE_ERR: "Une erreur mystérieuse est apparue, un rapport a été envoyé",
        INCONNUE_ERR_TITRE: "Oh my god !",

        //ERR type
        ERR_IDENTIFICATION: 0,
        ERR_SERVER: 1,
        ERR_RECEPTION: 2,
        ERR_INCONNUE: 3,

    	//NOMBRE VIES
    	NOMBRE_VIES: 10,

    	//NOMBRE DE JOURS A AFFICHER
    	NOMBRE_JOURS: 40,

        //INDICATEUR CASE VIDE
        INDICATEUR_CASE_VIDE: "•",

        //INDICATEUR NOTE RAPPEL
        INDICATEUR_NOTE_RAPPEL: " | ",

        //METEO 
        METEO_NIVEAU_DEFAULT: "wi-day-sunny-overcast",
        METEO_NIVEAU: ["wi-meteor", 
                        "wi-lightning", 
                        "wi-thunderstorm", 
                        "wi-storm-showers", 
                        "wi-snow", 
                        "wi-rain-wind", 
                        "wi-fog", 
                        "wi-horizon",
                        "wi-horizon-alt", 
                        "wi-day-sunny", 
                        "wi-stars",
                        "wi-solar-eclipse", 
                        "wi-alien"
                        ],

        //MESSAGES CHARGEMENT
        CHARGEMENT: [
            "Actualisation ... ",
            "mise en place des fondations",
            "construction des murs",
            "mise en place du toit"
        ],

        //prompt login
        MESSAGE_CONFIRM_LOGIN: "Souhaitez-vous définir ces identifiants comme ceux par défaut ?",
        TITRE_CONFIRM_LOGIN: "Compte par défaut",

        // Option BIA
        MESSAGE_BIA: "Suivez vous cette option ?",
        TITRE_BIA: "Option BIA",

        // INIFINITE SCROLL
        INFINITE_SCROLL_N: 5
	}
})