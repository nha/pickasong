
if (Meteor.isClient){

  Meteor.subscribe('playlist');

  Template.playlist.songs_in_playlist = function () {
    return Playlist.find();
  };

};
