(function () {

  angular.module('myApp')
    .component('playerInfo', { // the tag for using this is <char-detail>
      templateUrl: "templates/playerInfo.template.html",
      controller: playerInfoController,
      controllerAs: 'vm'

    })
    .config(playerInfoConfig);

  function playerInfoConfig($stateProvider) {
    $stateProvider.state('playerInfo', {
      url: '/playerInfo/',
      template: '<player-info></player-info>'
    });
  }

  function playerInfoController($state, $firebaseAuth, $log, Player, Character, Gravatar, $firebaseObject, Ability) {
    var vm = this;
    vm.auth = $firebaseAuth(); //The authorization object from firebase, there is only ever one, but for clarity, storing it here
    vm.firebaseUser = vm.auth.$getAuth(); // the firebase user
    vm.user; //the firebaseObject of the player
    vm.playerService = Player;
    vm.characterService = Character;
    vm.gravatarService = Gravatar;
    vm.charNameEdit = false; //whether we are editing the player name
    vm.characterName; // the character name on the form used when changing the name of the character since we are not going to 3-way bind the value
    vm.selectedCharacter; //the selected character
    vm.selectedCharacterAbilities;
    vm.selectedCharacterAbilitiesObjs = [];
    vm.saveCharacterName = saveCharacterName;
    vm.getCharacterPlayerGravatarEmail = getCharacterPlayerGravatarEmail;
    vm.topCharacters = Character.getTopCharacters(50);
    vm.charUrl = [];

    vm.topCharacters.$loaded(function(){
      angular.forEach(vm.topCharacters, function(char, key){
        //$log.log(key);
        vm.getCharacterPlayerGravatarEmail(key, char);
      });
    });

    function saveCharacterName(){
      if(vm.selectedCharacter.charName !== vm.characterName){
        vm.selectedCharacter.charName = vm.characterName;
        vm.selectedCharacter.$save();
      }
      vm.charNameEdit = false;
    }

    function getCharacterPlayerGravatarEmail(index, character){
      var p = Player.getPlayer(character.user);
      p.$loaded().then(function(){
        vm.charUrl[index] = Gravatar.get_gravatar_image_url(p.email);
      })
    }

    // On state Changed will monitor when the authorization state changes
    vm.auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) { // The user is logged in
        vm.firebaseUser = firebaseUser;
        // Ref to Specific user based on Unique ID so that on refresh we get it again
        vm.user = $firebaseObject(Player.userRef.child(firebaseUser.uid));

        vm.user.$loaded().then(function(){ // Once the user is loaded we can then get the selected character
          vm.selectedCharacter = Character.getCharacter(vm.user.selectedCharacter);
          vm.selectedCharacter.$loaded().then(function(){
            vm.characterName = vm.selectedCharacter.charName;
            vm.selectedCharacterAbilities = Object.keys(vm.selectedCharacter.abilities);
            for(var i = 0; i < vm.selectedCharacterAbilities.length; i++){
              vm.selectedCharacterAbilitiesObjs.push(Ability.getAbilityByID(vm.selectedCharacterAbilities[i]));
            }

          });
        });
      } else {
        vm.firebaseUser = null;
      }
    });
  }
})();
