(function () {
  angular.module('myApp')
    .component('home', { // the tag for using this is <char-detail>
      templateUrl: "templates/home.template.html",
      controller: homeController,
      controllerAs: 'vm'

    });

  function homeController(Features) {
    var vm = this;
    vm.features = Features.features;
    vm.dataArray = [
      {
        src: 'images/site/home/player_info.png'
      },
      {
        src: 'images/site/home/top_characters.png'
      },
      {
        src: 'images/site/home/enemy_select.png'
      },
      {
        src: 'images/site/home/battle.png'
      }
    ];
  }
})();
