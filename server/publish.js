// publishing rules
// not enforced by meteor conf yet

if(Meteor.isServer){

  Songs = new Meteor.Collection("songs");
  Playlist = new Meteor.Collection("playlist");

  Meteor.publish('songs', function () {
    return Songs.find();
  });


  Meteor.publish('playlist', function () {
    return Playlist.find();
  });


  // event when a song is added to the playlist
  Playlist.find().observe({
    added: function(item){ 
      console.log('new song in the playlist');
    }
  });

}

