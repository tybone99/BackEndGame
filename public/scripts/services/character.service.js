(function(){
  angular.module('myApp')
    .service('Character', Character);

  function Character($firebaseAuth, $firebase, $firebaseArray, $firebaseObject, $log){
    var self = this;
    self.charactersRef = firebase.database().ref().child('characters'); // the characters array
    self.getCharacter = getCharacter;
    self.createCharacter = createCharacter;
    self.getTopCharacters = getTopCharacters;
    self.getPlayer = getPlayer;

    /*function init(){
      $log.log("Initializing Character controller");
      self.charactersRef = firebase.database().ref().child('characters'); // the characters array
    }*/

    function getCharacter(characterID){
      return $firebaseObject(self.charactersRef.child(characterID));
    }

    function getTopCharacters(numberOfCharacters){
      return $firebaseArray(self.charactersRef.orderByChild('rating').limitToLast(numberOfCharacters));
    }
    function getPlayer(characterID){
      return $firebaseObject(self.charactersRef.child(characterID).child("user"));
    }

    function createCharacter(userID){

      //Create a default character
      var defaultCharacter = {
        charName: "Anonymous",
        user: userID,
        level: 1,
        exp: 0,
        maxHealth: 30,
        currentHealth: 30,
        battleID: {},
        abilities: {
          "-KStGrRb8lw9X7-ZsEel": true,
          "-KStGrRao0RTND1FPtKJ": true,
          "-KStGrR_zTZtfHM_3k3Y": true,
          "-KStGrRZ56rBQehDgtEj": true
        },
        wins: 0,
        losses: 0,
        rating: 0
      };

      // Get the key for the character
      var newCharacterKey = self.charactersRef.push().key;
      $log.log("New Character Key: " + newCharacterKey);

      // Add the player that owns the character
      //defaultCharacter.user = userID;

      // Add the default abilities

      // update the character to the characters ref
      var updates = {};
      updates['/users/' + userID + '/characters/' + newCharacterKey] = true;
      updates['/users/' + userID + '/selectedCharacter'] = newCharacterKey;
      updates['/characters/'+newCharacterKey] = defaultCharacter;
      return firebase.database().ref().update(updates);

    }


  }
})();