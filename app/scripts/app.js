'use strict';

/**
 * @ngdoc overview
 * @name mdWebapp
 * @description
 * # mdWebapp
 *
 * Main module of the application.
 */
angular
  .module('mdWebapp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
