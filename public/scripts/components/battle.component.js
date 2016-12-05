(function(){
  angular.module('myApp')
    .component('battle', {
      templateUrl: "templates/battle.template.html",
      controller: battleController,
      controllerAs: 'vm'

    })
    .config(battleConfig);

  function battleConfig($stateProvider) {
    $stateProvider.state('battle', {
      url: '/battle/',
      template: '<battle></battle>'
    });
  }

  function battleController($state, $firebaseAuth, EnemyNPC, $log, Battle, Player, Character, Gravatar, $firebaseObject, Ability, $mdDialog) {
    var vm = this;
    vm.playerService = Player;
    vm.enemyNPCService = EnemyNPC;
    vm.battleService = Battle;
    vm.characterService = Character;
    vm.gravatarService = Gravatar;

    vm.auth = $firebaseAuth();
    vm.firebaseUser = null;
    vm.character = {};
    vm.characterAbilities = {};
    vm.characterAbilitiesObjs = [];
    vm.battle = {};
    vm.enemy = {};
    vm.enemyAbilities = {};
    vm.enemyAbilitiesObjs = [];
    vm.enemyAttackPattern = [];
    vm.characterHP = 0;
    vm.enemyHP = 0;
    vm.turn = 1;
    vm.battleLog = "";
    vm.gameOver = false;

    vm.playerAttack = playerAttack;
    vm.scrollText = scrollText;

    function scrollText(){
      var textarea = document.getElementById('battleLog');
      textarea.scrollTop = textarea.scrollHeight;
    }

    function playerAttack(ability){
      //Check to see if the ability is successfully executed
      vm.battleLog += vm.character.charName + " " + ability.useVerb + " " + vm.enemy.enemyName + " ";
      var hits = Math.floor(Math.random()*11) < ability.effectiveness;
      $log.log("Player hits:" + hits);
      if(hits){
        // Move is successfully
        var playerDmg = Math.floor(Math.random()*ability.maxEffect) + ability.minEffect;
        vm.battleLog += "and is successful and does " + playerDmg + " " + ability.dmgType + " damage to " + vm.enemy.enemyName + "\n";
        vm.enemyHP = vm.battle.enemyHP -= playerDmg;
        vm.battle.battleLog = vm.battleLog;
        checkForGameOver();
        if(vm.gameOver){
          return;
        }
      }else{
        // Move fails
        vm.battleLog += " but misses\n";
        vm.battle.battleLog = vm.battleLog;
      }

      enemyAttack(ability.type == "melee block" && hits);
      if(vm.gameOver){
        return;
      }
      vm.turn++;
      vm.battle.turn = vm.turn;
      console.log(vm.turn);
      vm.battle.$save();
    }

    function enemyAttack(blocked){
      // Find out which ability to use
      $log.log("Turn:"+vm.turn);
      $log.log("AttackPattern Length:" + vm.enemyAttackPattern.length);
      var abilityNumber = vm.enemyAttackPattern[vm.turn % vm.enemyAttackPattern.length];
      $log.log("Enemy is using ability number: " + abilityNumber);
      var ability = {};
      if(abilityNumber == -1){ // Random Ability
        console.log("Got Random");
        abilityNumber = Math.floor(Math.random() * vm.enemyAbilitiesObjs.length);
        ability = vm.enemyAbilitiesObjs[abilityNumber];
      }else{
        ability = vm.enemyAbilitiesObjs[abilityNumber];
      }
      vm.battleLog += vm.enemy.enemyName + " " + ability.useVerb + " " + vm.character.charName + " ";
      // Find out if ability is successful
      var hitChance = (Math.floor(Math.random()*11));
      console.log("Random Enemy Hit Chance:" + hitChance);
      if(hitChance < ability.effectiveness){
        // Move is successfully
        if(!blocked) {
          var enemyDamage = Math.floor(Math.random() * ability.maxEffect) + ability.minEffect;
          vm.battleLog += "and is successful and does " + enemyDamage + " " + ability.dmgType + " damage to " + vm.character.charName + "\n";
          vm.characterHP = vm.battle.characterHP -= enemyDamage;
          vm.battle.battleLog = vm.battleLog;
          checkForGameOver();
        }else{
          vm.battleLog += " but is blocked\n";
          vm.battle.battleLog = vm.battleLog;
        }

      }else{
        // Move fails
        vm.battleLog += " but misses\n";
        vm.battle.battleLog = vm.battleLog;
      }

    }
    function checkForGameOver() {
      var playerWon = false;
      if (vm.characterHP <= 0) {
        vm.characterHP = 0;
        vm.character.losses++;
        vm.enemy.wins++;
        vm.gameOver = true;
      } else if (vm.enemyHP <= 0) {
        vm.enemyHP = 0;
        vm.character.wins++;
        vm.enemy.losses++;
        vm.gameOver = true;
        playerWon = true;
      }
      if(vm.gameOver) {
        vm.character.rating = (vm.character.wins * 2 - vm.character.losses) / (vm.character.wins + vm.character.losses);
        //Display the Battle Resolution Dialog
        vm.character.battleID = null;
        vm.battle.$remove();
        // Save the character
        vm.character.$save();
        // Save the enemy
        vm.enemy.$save();

        //Show the correct dialog
        if(playerWon){
          vm.showWin();
        }else{
          vm.showLoss();
        }

      }
    }

    vm.auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) { // The user is logged in
        vm.firebaseUser = firebaseUser;
        // Ref to Specific user based on Unique ID so that on refresh we get it again
        vm.user = $firebaseObject(Player.userRef.child(firebaseUser.uid));
        vm.user.$loaded().then(function(){
          vm.character = Character.getCharacter(Player.user.selectedCharacter);
          vm.character.$loaded().then(function(){
            vm.characterAbilities = Object.keys(vm.character.abilities);
            for(var i = 0; i < vm.characterAbilities.length; i++){
              vm.characterAbilitiesObjs.push(Ability.getAbilityByID(vm.characterAbilities[i]));
            }
            vm.battle = Battle.findBattle(vm.character.battleID);
            vm.battle.$loaded().then(function(){
              //$log.log(vm.battle.enemyID);
              vm.enemy = EnemyNPC.getEnemyByID(vm.battle.enemyID);
              vm.enemy.$loaded().then(function(){
                vm.enemyAbilities = Object.keys(vm.enemy.abilities);
                for(var i = 0; i < vm.enemyAbilities.length; i++){
                  vm.enemyAbilitiesObjs.push(Ability.getAbilityByID(vm.enemyAbilities[i]));
                }
                vm.enemyAttackPattern = Array.from(vm.enemy.attackPattern);
              });
              vm.characterHP = vm.battle.characterHP;
              vm.enemyHP = vm.battle.enemyHP;
              vm.turn = vm.battle.turn;
              if(vm.battle.battleLog == undefined){
              }else{
                vm.battleLog = vm.battle.battleLog;
              }
            });
          });
        });
      } else {
        vm.firebaseUser = null;
      }
    });

    vm.showWin = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Game Over')
        .textContent('You Won the Battle against the ' + vm.enemy.enemyName)
        .ariaLabel('Game Over')
        .targetEvent(ev)
        .ok('Return to Player Info')
        .cancel('Log Out');

      $mdDialog.show(confirm).then(function() {
        $state.go("playerInfo");
      }, function() {
        //Log out
        Player.logout();
      });
    };

    vm.showLoss = function(ev) {
      // Appending dialog to document.body to cover sidenav in docs app
      var confirm = $mdDialog.confirm()
        .title('Game Over')
        .textContent('You Lost the Battle against the ' + vm.enemy.enemyName)
        .ariaLabel('Game Over')
        .targetEvent(ev)
        .ok('Return to Player Info')
        .cancel('Log Out');

      $mdDialog.show(confirm).then(function() {
        $state.go("playerInfo");
      }, function() {
        //Log out
        Player.logout();
      });
    };

  }


})();
