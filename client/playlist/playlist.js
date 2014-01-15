
if (Meteor.isClient){

  Playlist = new Meteor.Collection('playlist');
  Meteor.subscribe('playlist');

  Template.playlist.songs_in_playlist = function () {
    return Playlist.find();
  };

};
