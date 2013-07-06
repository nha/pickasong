// TODO rename bootstrap.js ?
sys = Npm.require('sys');
exec = Npm.require('child_process').exec;
//io = Npm.require('socket.io')) ;
fs = Npm.require('fs') ;
// tcp library
//http://nodejs.org/api/net.html
net = Npm.require('net');

function puts(error, stdout, stderr) { sys.puts(error); sys.puts(stdout); sys.puts(stderr); }


if (Meteor.isServer) {
        Meteor.startup(function () {
               console.log("Server starting up!");
	       exec("pwd", puts);

               pl = new VLCplayer();

	//pl.sendCommand('status');





    Playlist.remove({});
    if (Songs.find().count() === 0) {
      // TODO exemple de donnees :
	// etre coherent avec mongoDB (blobs binaire de musique?)
          // string artist
	  // string song title
	  // lenght
	  // comment
	  // upvotes
	  // downvotes
      var mySongList = [
                   "Belleruche",            "Minor Swing",
                   "G-Swing",               "Sing Sing Sing (feat Ania Chow)",
                   "Caravan Palace",        "Jolie coquine",
                   "Parov Stellar",         "Chambermaid Swing",
                   "Parov Stellar",         "Libella Swing",
                   "Pink Martini",          "je ne veux pas travailler",
                   "Sexi Sushi",            "Enfant de putain _ Salope ta mère"
		       ];
      for (var i = 0; i < mySongList.length; i=i+2) 
        Songs.insert({artist: mySongList[i], title: mySongList[i+1]});
     }




        });
}







// ************************************************************************ 
// METHODS PUBLISHED TO THE CLIENT
// ie. our internal API
// *********************************************************************** 


  Meteor.methods({
    test: function () {
       console.log("test song playing");
       exec(" cvlc /home/nha/Dropbox/repos/pick-a-song/server/music ", puts);
       return 0;
    },

     // for debugging purposes
     print: function (string) {
         console.log(string);
         return 0;
     },

     // for debugging purposes
     printObj: function(obj) {
          var strObj = JSON.stringify(obj, null, 4);
          console.log(strObj);
     },

     testplay: function (songId) {
     	 console.log("id : " + songId);
         //db.songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1, title: 1});
         //Songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1});
         var artist = Songs.findOne({ _id : songId }, {artist:1});
         console.log("artiste : " + artist);
         //console.log(Songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1, title: 1}));

         return 0;
     },

     // play a given song
     play: function (songId) {
     	 console.log("id : " + songId);
         //db.songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1, title: 1});
         //Songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1});
         var artist = Songs.findOne({ _id : "78052bca-349d-4764-8db4-994a8684a254" }, {artist:1});
         console.log("artiste : " + artist);
         //console.log(Songs.find({ _id : "78052bca-349d-4764-8db4-994a8684a254" },{artist:1, title: 1}));

         return 0;
     },

     // send a command to VLC
     vlcCommand: function(cmd) {
        pl.sendCommand(cmd);
        return 0;
     }

  }); // ~Meteor.methods

