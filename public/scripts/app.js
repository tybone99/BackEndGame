(function () {
  angular.module("myApp", ['ui.router', 'ngMaterial', 'jkAngularCarousel', 'ngMessages', 'material.svgAssetsCache', 'firebase', 'luegg.directives'])

    .config(function ($stateProvider, $urlRouterProvider) {
      //
      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise("/main");
      //
      // Now set up the states
      $stateProvider
        .state('main', {
          url: "/main",
          template: '<home></home>'
        })
    })
    .controller('AppCtrl', function ($scope, $mdDialog, $firebaseAuth, $log, Player) {
      $scope.status = '  ';
      $scope.customFullscreen = false;
      $scope.playerService = Player;

      var originatorEv;

      $scope.openNameMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
      };

      $scope.showAdvanced = function (ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'templates/loginDialog.template.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose: true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        });
      };

      function DialogController($scope, $mdDialog, Player) {
        $scope.playerService = Player;

        $scope.hide = function () {
          $mdDialog.hide();
        };

        $scope.cancel = function () {
          $mdDialog.cancel();
        };

      }
    });

})();