(function(){
  angular.module("myApp")
    .service("Ability", Ability);

  function Ability($firebaseObject, $firebaseArray, $log){
    var self = this;
    self.abilitiesRef = firebase.database().ref().child('abilities');
    self.abilities = $firebaseArray(self.abilitiesRef);
    self.createAbility = createAbility;
    self.getAbilityByID = getAbilityByID;

    // Initial List of abilities
    self.abilities.$loaded().then(function(items){
      if(false /*items.length == 25*/){
        // // Skeleton
        // self.createAbility("Bite", 1, "melee", "physical", "default.jpg", "bites", 0, 0, false, 6, 1, 5);
        // self.createAbility("Claw", 1, "melee", "physical", "default.jpg", "slashes", 0, 0, false, 9, 2, 6);
        // self.createAbility("Wander", 1, "idle", "none", "default.jpg", "wanders around", 0, 0, false, 10, 0, 0);

        // // Player
        // self.createAbility("Block", 1, "melee block", "physical", "default.jpg", "blocks", 0, 1, true, 9, 2, 3);
        // self.createAbility("Punch", 1, "melee", "physical", "default.jpg", "punches", 0, 2, true, 9, 1, 5);
        // self.createAbility("Kick", 1, "melee", "physical", "default.jpg", "kicks", 0, 3, true, 7, 2, 3);
        // self.createAbility("Pulse Pistol", 1, "range", "electrical", "default.jpg", "shoots", 1, 5, true, 8, 5,5);

        // // Nemo abilities
        // self.createAbility("Foreshortened Fin", 1, "melee", "physical", "default.jpg", "hits you with his foreshortened fin", 0, 0, false, 9, 1, 4);
        // self.createAbility("Small fin rage", 1, "melee", "physical", "default.jpg", "rages over being made fun of", 0, 0, false, 7, 3, 8);
        // self.createAbility("Dory Team-up", 1, "melee", "physical", "default.jpg", "teams up with Dory", 0, 0, false, 6, 5, 9);
        //
        // // Harry Potter abilities
        // self.createAbility("Bombarda Maxima", 2, "range", "arcane", "default.jpg", "casts Bombarda Mazima", 1, 0, false, 9, 6, 11);
        // self.createAbility("Expelliarmus", 2, "range", "arcane", "default.jpg", "casts Expelliarmus", 1, 0, false, 9, 2, 6);
        // self.createAbility("Stupefy", 2, "range", "arcane", "default.jpg", "casts Stupefy", 1, 0, false, 5, 8, 11);
        //
        // // Homer Simpson abilities
        // self.createAbility("Donut Rage", 3, "melee", "physical", "default.jpg", "eats the last bite of his donut, gets mad, and kicks", 0, 0, false, 8, 6, 11);
        // self.createAbility("Children Rage", 3, "melee", "physical", "default.jpg", "gets mad at his kids and charges", 0, 0, false, 7, 2, 6);
        // self.createAbility("Strangle", 3, "melee", "physical", "default.jpg", "strangles", 0, 0, false, 8, 15, 16);
        //
        // // Mario abilities
        // self.createAbility("Jump", 4, "melee", "physical", "default.jpg", "jumps", 0, 0, false, 8, 9, 14);
        // self.createAbility("Fireball", 4, "range", "fire", "default.jpg", "shoots a fireball", 0, 0, false, 7, 3, 9);
        // self.createAbility("Water Gun", 4, "range", "water", "default.jpg", "grabs his F.U.D.D water backpack and blasts", 0, 0, false, 7, 9, 15);
        //
        // // Aragorn abilities
        // self.createAbility("Sword Swipe", 5, "melee", "physical", "default.jpg", "swipes with his sword", 0, 0, false, 8, 9, 14);
        // self.createAbility("Bow Shot", 5, "range", "physical", "default.jpg", "shoots with his bow", 0, 0, false, 8, 7, 9);
        // self.createAbility("Sword Cleave", 5, "melee", "physical", "default.jpg", "cleaves with his sword", 0, 0, false, 7, 10, 16);
        //
        // // Bruce abilities
        // self.createAbility("Shark Bite", 6, "melee", "physical", "default.jpg", "bites", 0, 0, false, 8, 10, 14);
        // self.createAbility("Headbutt", 6, "melee", "physical", "default.jpg", "Headbutts", 0, 0, false, 8, 9, 10);
        // self.createAbility("Tail Whip", 6, "melee", "physical", "default.jpg", "cleaves with his sword", 0, 0, false, 7, 8, 9);

        // Little Jimmy Raynor

        // Dora the Explorer

        // Inigo Montoya

        // Yoshi

        // Joker

        // Pikachu

        // Nacho Libre

        // Stewie

        // Batman

        // Macho Man Randy Savage

        // Hulk

        // Big Boss

        // Bruce Lee

        // Uther
      }
    });

    /**
     *
     * @param name The name of the ability
     * @param level The level of the ability
     * @param type The type of the ability (idle, melee, range, melee block, )
     * @param dmgType The damage type (none, physical, fire, ice, earth, mental, wind, water, electrical, arcane)
     * @param img The abilities image
     * @param useVerb The use verb for battle log
     * @param useType Where the cost of the ability comes from (0 = stamina, 1 = energy)
     * @param useCost The cost of using the ability
     * @param isPlayer If the ability is a player ability (true, false)
     * @param effectiveness The effectiveness of the ability (1-10)
     * @param minEffect The minimum amount of damage/healing the ability can do
     * @param maxEffect The Maximum effect of the ability
     * @returns {*} A promise for the $add method
     */
    function createAbility(name, level, type, dmgType, img, useVerb, useType, useCost, isPlayer, effectiveness, minEffect, maxEffect){
      var abilityTemplate = {
        abilityName: name,
        level: level,
        type: type,
        dmgType: dmgType,
        img: img,
        useVerb: useVerb,
        useType: useType,
        useCost: useCost,
        isPlayer: isPlayer,
        effectiveness: effectiveness,
        minEffect: minEffect,
        maxEffect: maxEffect
      };

      return self.abilities.$add(abilityTemplate);  // in case we need to get to the promise to get the key
    }

    function getAbilityByID(abilityID){
        return $firebaseObject(self.abilitiesRef.child(abilityID));
    }

  }
})();
