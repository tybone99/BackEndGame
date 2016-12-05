(function () {

  angular.module('myApp')
    .service('Player', Player);

  function Player($state, $firebaseAuth, $firebaseObject, $firebaseArray, $log, $q, $mdDialog, Character) {
    var self = this;
    self.auth = $firebaseAuth(); //The authorization object from firebase, there is only ever one, but for clarity, storing it here
    self.firebaseUser = self.auth.$getAuth(); // the firebase user
    self.user; //the firebaseObject of the user set up in the loginSuccess method and reset when auth changes
    self.userRef = firebase.database().ref("users");
    self.login = login;
    self.loginWithEmail = loginWithEmail;
    self.logout = logout;
    self.getDisplayName = getDisplayName;

    // Player methods
    self.getPlayer = getPlayer;

    // Player's character methods
    self.setSelectedCharacter = setSelectedCharacter;
    self.getCharacters = getCharacters;


    // On state Changed will monitor when the authorization state changes
    self.auth.$onAuthStateChanged(function (firebaseUser) {
      if (firebaseUser) { // The user is logged in
        self.firebaseUser = firebaseUser;
        // Ref to Specific user based on Unique ID so that on refresh we get it again
        self.user = $firebaseObject(self.userRef.child(firebaseUser.uid));
      } else {
        self.firebaseUser = null;
        $state.go('main');
        $log.log("Signed out");
      }
    });

    function getPlayer(userID){
      return $firebaseObject(self.userRef.child(userID));
    }

    function setSelectedCharacter(characterID){
      self.user.selectedCharacter = characterID;
      return self.user.$save();
    }
    function getCharacters(userID){
      return $firebaseArray(self.userRef.child("characters"));
    }


    function getDisplayName() {
      return self.firebaseUser ? self.firebaseUser.displayName || self.firebaseUser.email : undefined;
    }

    function login(provider) {
      // login with third-party provider
      console.log("login");
      return self.auth.$signInWithPopup(provider)
        .then(loginSuccess)
        .catch(loginError);
    }

    function loginWithEmail(email, password) {
      return self.auth.$createUserWithEmailAndPassword(email, password)
        .then(function () {
          self.auth.$signInWithEmailAndPassword(email, password)
            .then(loginSuccess)
            .catch(loginError);
        }, function (error) {
          if (error.code === "auth/email-already-in-use" || error.code == 400) {
            self.auth.$signInWithEmailAndPassword(email, password)
              .then(loginSuccess)
              .catch(loginError);
          } else {
            $log.error(error);
          }
        })
        .catch(loginError);
    }

    function loginSuccess(firebaseUser) {

      var deferred = $q.defer();
      // $log.log("firebaseUser as passed to loginSuccess");
      // $log.log(firebaseUser);

      self.providerUser = firebaseUser.user ? firebaseUser.user : firebaseUser;

      // Users Array Reference
      var ref = firebase.database().ref("users");

      // Ref to Specific user based on Unique ID
      var profileRef = ref.child(self.providerUser.uid);

      self.user = $firebaseObject(profileRef);

      self.user.$loaded().then(function () {
        if (self.user.$value === null) { // the user does not exist yet
          $log.log("creating player...");

          // The default player template used when creating a player
          var playerTemplate = {
            displayName: self.providerUser.displayName,
            email: self.providerUser.email,
            photoURL: self.providerUser.photoURL,
            provider: firebaseUser.credential.provider,
            createdDate: Date.now(),
            lastLoginDate: Date.now(),
            selectedCharacter: {},
            characters: {}
          };

          profileRef.set(playerTemplate).then(function () {
            $log.log("user created.");
            // We need to add a character to the character list
            Character.createCharacter(self.user.$id).then(
              function(){
                $log.log("Character created.");
              }, function(){
                $log.log("Character could not be created.");
              }
            );

          }, function () {
            //$log.log("user could not be created.");
          });
        } else {
          //$log.log('user already created!');
          self.user.lastLoginDate = Date.now(); //Udate the last login
          self.user.$save();
        }
        $state.go('playerInfo');
        deferred.resolve();
      }, function(){
        //$log.log("Error in user.$loaded ")
      });
      $mdDialog.hide(); //Hide the login dialog
      return deferred.promise;
    }

    function loginError(error) {
      //$log.log("Authentication failed:", error);
    }

    function logout() {
      $log.log(self.getDisplayName() + " logged out");
      self.auth.$signOut();
      $state.go('main');
    }

  }

})();