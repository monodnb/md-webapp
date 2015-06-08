'use strict';

/**
 * @ngdoc overview
 * @name materialWebapp
 * @description
 * # materialWebapp
 *
 * Main module of the application.
 */
angular
  .module('materialWebapp', [
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
        templateUrl: '/app/views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
