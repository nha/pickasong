//publishes data to the clients

if(Meteor.isServer){

  Songs = new Meteor.Collection("songs");
  Playlist = new Meteor.Collection("playlist");

  Meteor.publish('songs', function () {
    return Songs.find();
  });


  Meteor.publish('playlist', function () {
    return Playlist.find();
  });


  // evenement lorsqu'une chanson est ajoutee a la playlist
  Playlist.find().observe({
    added: function(item){ 
      console.log('nouvelle chanson dans la playlist');
      //Playlist(item.message)
    }
  });

}


//test
/// Songs.insert({artist: "Parov Stellar", title: "Catgroove", lenght: "2:38", comment: "inserted by hand with love"});



