(function(){
  angular.module('myApp')
    .component('enemySelect', {
        templateUrl: "templates/enemySelect.template.html",
        controller: enemySelectController,
        controllerAs: 'vm'

    })
    .config(enemySelectConfig);

  function enemySelectConfig($stateProvider) {
    $stateProvider.state('enemySelect', {
        url: '/enemySelect/',
        template: '<enemy-select></enemy-select>'
    });
  }

  function enemySelectController(EnemyNPC, $log, Battle) {
    var vm = this;
    vm.selectedEnemy = undefined;
    //$log.log(EnemyNPC);
    vm.enemies = EnemyNPC.getEnemies();
    vm.battleService = Battle;

  }
})();
