
if (Meteor.isClient){

  Playlist = new Meteor.Collection('playlist');
  Meteor.subscribe('playlist');
	
  Template.playlist.songs_in_playlist = function () {
    //return Playlist.find({}, {sort: {artist: 1, title: 1}});
    return Playlist.find();	// no sorting here. We want the songs in a FIFO order
  };

};
