(function(){
  angular.module('myApp')
    .service('Features', Feature);

  function Feature($firebase, $firebaseArray, $log){
    var self = this;
    self.features = $firebaseArray(firebase.database().ref().child('features'));
    $log.log("Got Here");
    self.features.$loaded().then(function(items){
      if(items.length == 0){
        console.log(items);
        items.$add(
          {
            title: "Facebook Login",
            description: "Allows for use of Facebook users to login",
            image: "FB-f-Logo__blue_72.png"
          });
        items.$add(
          {
            title: "Gravatar Integration",
            description: "Uses gravatar images for player profile image",
            image: "ftr-gravatar.jpg"
          });
        items.$add(
          {
            title: "Turn-Based Fighting",
            description: "Players fight their battles in turn-based fashion",
            image: "ftr-turn-based.png"
          });
        items.$add(
          {
            title: "Player Ranking",
            description: "Players are ranked based on their scores",
            image: "ftr-ranked.png"
          });
        items.$add(
          {
            title: "Six Starting Enemies",
            description: "Six starting enemies to test your skills against",
            image: "ftr-enemies.png"
          });
        items.$add(
          {
            title: "Enemy Data Logging",
            description: "We store where enemies win or lose fights for game balance tweeking",
            image: "ftr-big-data.png"
          });
      }else {
        //console.log(items.length);
      }
    });
  }
})();