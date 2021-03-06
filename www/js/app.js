// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      controller: "AppCtrl",
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.profil', {
      url: "/profil",
      views: {
        'tab-profil' :{
          templateUrl: "templates/profil.html",
          // controller: 'profilCtrl'
          controller: "profilCtrl"
        }
      }
    })
    .state('tab.messages', {
      url: "/messages",
      views: {
        'tab-messages' :{
          templateUrl: "templates/messages.html",
          // controller: 'messagesCtrl'
          controller: "messagesCtrl"
        }
      }
    })
    .state('tab.edt', {
      url: "/edt",
      views: {
        'tab-edt' :{
          templateUrl: "templates/edt.html",
           // controller: 'edtCtrl'
           controller: "edtCtrl"
          
        }
      }
    })
    .state('tab.notes', {
      url: "/notes",
      views: {
        'tab-notes' :{
          templateUrl: "templates/notes.html",
          // controller: 'notesCtrl'
          controller: "notesCtrl"
        }
      }
    })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/profil');

});
