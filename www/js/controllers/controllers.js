angular
.module('starter.controllers', ['ServiceData', 'ServiceConstantes'], function($httpProvider){
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */ 
  var param = function(obj) {
    //function qui permet d'envoyer des requetes POST du module $http avec la meme synthaxe qu'avec jQuery
    //trouvée sur internet (c'est la seule)
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

    for(name in obj) {
      value = obj[name];

      if(value instanceof Array) {
        for(i=0; i < value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName +  ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }

    return query.length ? query.substr(0, query.length - 1) : query;
  };

  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})
.controller('AppCtrl', function(CONSTANTES, $ionicLoading, $scope, $ionicModal, $timeout, $http, $rootScope, $ionicPopup, Data) {

  
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    console.log("😚 : defining modal")
    $scope.modal = modal;
  });




  $rootScope.show = function() {
    //affiche un logo de chargement et empeche toutes interrations
    $ionicLoading.show({
      content: ''+ $scope.chargement,
      template: '<i style="background : none" class="icon ion-loading-c">'+'</i>',
        animation: 'fade-in',
        showBackdrop: false,
        maxWidth: 200,
        showDelay: 0
    });
  };

  $rootScope.hide = function(){
    $ionicLoading.hide();
  };

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    //ferme la page de login
    $scope.modal.hide();
    $scope.choix = null
  };

  //LOGIN ET REFRESH
  // Form data for the login modal
  $scope.loginData = {};
  $scope.loginData.compteDefaut = true
  $scope.choix = null
  
  // Open the login modal
  $scope.login = function() {
    console.log("😚 : showing modal")
    //affiche la page de login
    $scope.modal.show()
  }

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {

    //Loading go !
    $scope.show()

    //login go !
    var user = {login: $scope.loginData.login, password: $scope.loginData.password, bia: undefined, error_semestre: undefined}
    // Data.profil.classe = ""
    // var onConfirm = function(buttonIndex){
    //  console.log("CONFIRM ____")
    //  console.log(buttonIndex)
    //  if(user.login && user.password){
    //    if(buttonIndex == 1){
    //      Data.login(user, true)
    //      $scope.choix = true
    //    }
    //    else{
    //      Data.login(user, false) 
    //      $scope.choix = false
    //    }
        
    //  }

    // }

    // if($scope.choix != true && $scope.choix != false){
    //  navigator.notification.confirm(
    //      CONSTANTES.MESSAGE_CONFIRM_LOGIN,  // message
    //      onConfirm,                  // callback to invoke
    //      CONSTANTES.TITRE_CONFIRM_LOGIN,            // title
    //      ['oui','non']              // defaultText
    //  );
    // }
    // else{
    //  Data.login(user, $scope.choix)
    // }

    Data.login(user, true)
      
  }

  $rootScope.refresh = function(){
    //refresh go!
    Data.refresh()
    
  }

  //SELECTION D ELEMENTS
  $rootScope.selectionEdt = function(element){
    $rootScope.matiereEdt = element
  }
  $rootScope.selectionNotes = function(element){
    $rootScope.matiereNotes = element
  }
  

  //GESTION EVENEMENT

  $rootScope.$on("close_login", function(){
    //hide login 
    $scope.closeLogin()
  })

  $rootScope.$on("error_semestre", function(){
    navigator.notification.alert(CONSTANTES.ERR_SEMESTRE_MESS, function(){}, CONSTANTES.ERR_SEMESTRE_TITRE)
  })

  $rootScope.showAlert = function(titre, message) {
    //affiche une alerte
    // var alertPopup = $ionicPopup.alert({
    //  title: titre,     
    //  template: '<p class="center">' + message + '</p>', 
    //  okType: 'button-clear button-positive'
    // });
    var alertCallback = function(){
      console.log("Ah une alerte !")
    }
    navigator.notification.alert(message, alertCallback, titre)
    
  }

  //http://stackoverflow.com/questions/14527377/handling-data-binding-in-angularjs-services
  // $scope.$watch( function () { return Data.data.messages; }, function ( data ) {
 //    // handle it here. e.g.:
 //     $scope.messages = data

  // });
  // $scope.$watch( function () { return Data.data.edt; }, function ( edt ) {
 //    // handle it here. e.g.:
 //     $scope.edt = edt

  // });
  // $scope.$watch( function () { return Data.data.notes; }, function ( notes ) {
 //    // handle it here. e.g.:
 //     $scope.notes = notes

  // });
  $scope.$watch( function () { return Data.profil; }, function ( profil ) {
   // handle it here. e.g.:
      $rootScope.profil = profil
  });

  $scope.$watch( function () { return Data.connexion; }, function ( connexion ) {
   // handle it here. e.g.:
      $rootScope.connexion = connexion
  });

  $scope.$watch( function () { return Data.numChargement; }, function ( chargement ) {
      // $rootScope.chargement = CONSTANTES.CHARGEMENT[chargement]
      $rootScope.chargement = chargement

  });

  $rootScope.afficherSemestre = function(semestre){
    for(var prop in semestre){
      if(prop != "$$hashKey"){
        return true
      }
    }

    return false
  }
  //INITIALISATION DONNEES ROOTSCOPE

  //le profil de la rootScope permet d'avoir acces à l'element user iniatialisé si l'utilisateur a défini son compte comme le compte personnel
  //et que la connexion a réussi. De cette facon chaque page donne ou non la possibilité de rafraichir à l'aide du push-to-refresh
  // $rootScope.profil = Data.profil
  // $scope.messages = Data.data.messages
  // $scope.notes  = Data.data.notes
  // $scope.edt = Data.data.edt

})
.controller('profilCtrl', function($scope, Data, $ionicScrollDelegate){
  $scope.absences = function(pdv){

    var absences = 10 - parseInt(pdv)
    if(absences == 0){
      return "aucune absence"
    }
    else if(absences == 1){
      return absences + " absence"
    }
    else{
      return absences + " absences"
    }
  }

  $scope.$on("$destroy", function() {
       var delegate = $ionicScrollDelegate.$getByHandle('myScroll');
       delegate. forgetScrollPosition();
   });
  
  
})