(function(){
  angular.module('myApp')
    .service('Battle', Battle);

  function Battle($firebase, $log, $firebaseObject, Character, Player){
    var self = this;

    // Properties
    self.selectedEnemy = undefined;
    self.battleRef = firebase.database().ref().child("battles");

    // Methods
    self.createBattle = createBattle;
    self.findBattle = findBattle;

    function findBattle(battleID){
      return $firebaseObject(self.battleRef.child(battleID));
    }
    function createBattle(enemy){
      // Check to see if there is a current battle in place
      Player.user.$loaded().then(function() {
        $log.log(Player.user);
        var character = Character.getCharacter(Player.user.selectedCharacter);
        character.$loaded().then(function () {
          if(character.battleID) {
            // There is already a battle, we need to remove it and the player loses that round
            var preexistingBattle = $firebaseObject(self.battleRef.child(character.battleID));
            preexistingBattle.$remove();
            character.losses = character.losses + 1;
            character.rating = (character.wins * 2 - character.losses) / (character.wins + character.losses);
            character.$save();
          }
          var defaultBattle = {
            characterID: character.$id,
            characterHP: character.maxHealth,
            enemyID: enemy.$id,
            enemyHP: enemy.maxHealth,
            turn: 1,
            whoseTurn: 0
          };

          var newBattleKey = self.battleRef.push().key;
          var updates = {};
          updates['/characters/' + character.$id + '/battleID'] = newBattleKey;
          updates['/battles/' + newBattleKey] = defaultBattle;
          firebase.database().ref().update(updates);
          return $firebaseObject(self.battleRef.child(newBattleKey));
        });
      });
    }


  }

})();
