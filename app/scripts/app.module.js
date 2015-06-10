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
    'ngRoute'
  ])
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .directive('card', function(){
    return{
      restrict: 'E',
      template: '<div class="{{pclass}}">'+
                  '<div class="{{mclass}}"></div>'+
                '</div>',
      replace: true,
      scope: {
        pclass: '@',
        mclass: '@'
      }
    }
  });
