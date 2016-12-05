(function(){
  angular.module('myApp')
    .service('Gravatar', Gravatar);

  function Gravatar(){
    var self = this;

    self.get_gravatar_image_url = get_gravatar_image_url;

    function get_gravatar_image_url (email, size, default_image, allowed_rating, force_default)
    {
      email = typeof email !== 'undefined' ? email : 'does not exists';
      size = (size >= 1 && size <= 2048) ? size : 80;
      default_image = typeof default_image !== 'undefined' ? default_image : 'mm';
      allowed_rating = typeof allowed_rating !== 'undefined' ? allowed_rating : 'pg';
      force_default = force_default === true ? 'y' : 'n';

      return ("https://secure.gravatar.com/avatar/" + md5(email.toLowerCase().trim()) + "?size=" + size + "&default=" + encodeURIComponent(default_image) + "&rating=" + allowed_rating + (force_default === 'y' ? "&forcedefault=" + force_default : ''));
    }
  }
})();
