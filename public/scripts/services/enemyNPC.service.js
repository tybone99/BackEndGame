(function(){
  angular.module('myApp')
    .service("EnemyNPC", EnemyNPC);

  function EnemyNPC($firebaseObject, $firebaseArray, $log){
    var self = this;
    self.enemiesRef = firebase.database().ref().child('enemies'); // the enemies reference
    self.enemies = $firebaseArray(self.enemiesRef); // an array of all enemies in the database
    self.createEnemy = createEnemy;
    self.getEnemyByID = getEnemyByID;
    self.getEnemies = getEnemies;

    // Enemy Initial list
    self.enemies.$loaded().then(function(items){
      if(false /* == 0*/){
        /*self.createEnemy("Brittle Skeleton", 1, 10, 10, "brittle_skeleton.jpg", "The animated remains of a poor unfortunate that in death is not in much worse shape than it was in life",
          {
            "-KStGrRVhpF3p0gQva6Z": true,
            "-KStGrRX11idOQvT4ze5": true,
            "-KStGrRYUTaRnw4S8bGv": true
          }
          ,
          [-1,1,0,-1]
        );
        self.createEnemy("Nemo", 1, 10, 10, "nemo.png", "A small clown fish that had a great adventure but was a minor character in the second movie",
          {
            "-KT1WVbg0FDpnI4l_2P7": true,
            "-KT1WVbjkGdxP-Ykh_eZ": true,
            "-KT1WVbku_evXRBI1s1P": true
          }
          ,
          [-1]
        );
        self.createEnemy("Harry Potter", 2, 20, 20, "harryPotter.jpg", "A boy who is remarkable because he lived",
          {
            "-KT1WVbku_evXRBI1s1Q": true,
            "-KT1WVblhWs4bjg9BYDf": true,
            "-KT1WVbm_NOVbXuRcpJE": true
          }
          ,
          [-1]
        );
        self.createEnemy("Homer Simpson", 3, 30, 30, "homerSimpson.jpg", "A yellow faced man who eats too many donuts and should be arrested for child abuse",
          {
            "-KT1WVbpp5xQutnRyHrx": true,
            "-KT1WVbszoLbQVGYXVXL": true,
            "-KT1WVbusGvHfriB3sIt": true
          }
          ,
          [-1]
        );
        self.createEnemy("Mario", 4, 40, 40, "mario.png", "A rotund italian plumber who PETA has on their hit list",
          {
            "-KT1WVbvT8PTpRWgN3Fe": true,
            "-KT1WVbwj88E0JwpEDYi": true,
            "-KT1WVbyj5DMuM0nZQ_D": true
          }
          ,
          [-1]
        );
        self.createEnemy("Aragorn", 5, 50, 50, "aragorn.png", "Started as wandering homeless man who later rules as king and marries an elf princess, the definition of WIN!",
          {
            "-KT1WVbyj5DMuM0nZQ_E": true,
            "-KT1WVbztFZ-FEsrWcTZ": true,
            "-KT1WVc-9YIAjWeN4r40": true
          }
          ,
          [-1]
        );
        self.createEnemy("Bruce", 6, 60, 60, "bruce.jpg", "An aussie shark with self-identity issues",
          {
            "-KT1WVc-9YIAjWeN4r41": true,
            "-KT1WVc1IFBUzSym-oLs": true,
            "-KT1WVc1IFBUzSym-oLt": true
          }
          ,
          [-1]
        );*/

      }else {
        //$log.log(items.length);
      }
    });


    function createEnemy(name, level, exp, maxHealth, imgName, description, abilities, attackPattern){
      var enemyTemplate = {
        enemyName: name,
        level: level,
        exp: exp,
        img: imgName,
        maxHealth: maxHealth,
        description: description,
        abilities: abilities,
        attackPattern: attackPattern,
        wins: 0,
        losses: 0
      };
      return self.enemies.$add(enemyTemplate); // in case we need to get to the promise to get the key
    }

    function getEnemyByID(enemyID){
      //$log.log(enemyID);
      return $firebaseObject(self.enemiesRef.child(enemyID));
    }

    function getEnemies(){
      return $firebaseArray(self.enemiesRef);
    }

  }
})();