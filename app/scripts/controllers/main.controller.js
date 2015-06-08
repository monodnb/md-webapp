'use strict';

/**
 * @ngdoc function
 * @name materialDesign.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the materialDesign
 */
angular.module('mdWebapp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
