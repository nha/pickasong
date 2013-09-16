// TODO rename bootstrap.js ?
sys = Npm.require('sys');
exec = Npm.require('child_process').exec;
//io = Npm.require('socket.io')) ;
fs = Npm.require('fs') ;

// tcp library
//http://nodejs.org/api/net.html
net = Npm.require('net');
Future  = Npm.require('fibers/future');

puts = function(error, stdout, stderr) { sys.puts(error); sys.puts(stdout); sys.puts(stderr); }
//puts = function(error, stdout, stderr) { if(error){sys.puts(error)}; if(stdout){sys.puts(stdout)}; if(stderr){sys.puts(stderr)}; }

if (Meteor.isServer) {
        Meteor.startup(function () {
               console.log("Server starting up!");
               console.log(process.cwd());	// equivalent a  exec("pwd", puts);
	       console.log(process.env.PWD);

               pl = new VLCplayer();
               pl.isVLCrunning( function(res){console.log('VLC??? ' + res); }  );

	//pl.sendCommand('status');





    Playlist.remove({});
    Songs.remove({});

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
                   "Pink Martini",          "Je ne veux pas travailler",
                   "Sexi Sushi",            "Enfant de putain _ Salope ta mère"
		       ];
      for (var i = 0; i < mySongList.length; i=i+2) 
        Songs.insert({artist: mySongList[i], title: mySongList[i+1]});
     }


/*
var dir='./public/';
var data={};

fs.readdir(dir ,function(err, files){
    if (err) throw err;
    var c=0;
    console.log('reading music files');
    files.forEach(function(file){
    console.log(file);
    //Songs.insert({songpath: file});
    });
});
*/

//populateDB('/home/nha/repo/pickasong/public', function(arr){   console.log(JSON.stringify(arr, null, 4));  }); // TODO find a way to revert path to ./public (broken in meteor update)

/*
var length = songFiles.length,
    element = null;
for (var i = 0; i < length; i++) {
  element = arr[i];
  console.log(element);
}*/
        });//~Meteor.startup
}//~Meteor.isServer





// http://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object
function populateDB(musicPath, callback) {
//  Fiber(function() { 
	var data = {};
	fs.readdir(musicPath, function(err, files){
	    if (err) {
		console.log('main.js : populateDB : error reading music directory - ' + err);
		throw err;
	    }
	    var c=0;
	    console.log('reading music files');
	    files.forEach(function(file){
            c++;
	    //console.log(file);
            data[c] = file;
	    //Songs.insert({songpath: file});	// TODO suppress var data
           if (0===--c) {
                console.log(c + ' ' + data);  //socket.emit('init', {data: data});
                callback(data);
            }
	    });
	});
	
//  }).run();  
}









// ************************************************************************ 
// METHODS PUBLISHED TO THE CLIENT
// ie. our internal API
// *********************************************************************** 


  Meteor.methods({
    test: function () {
       console.log("test song playing");
       //exec(" cvlc /home/nha/Dropbox/repos/pick-a-song/server/music ", puts);
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

     testplay: function (song) {
     	 console.log("songId : " + song._id);
     	 console.log("title : " + song.title);
     	 console.log("artist : " + song.artist);
         var song = Songs.findOne({ title  : song.title, artist : song.artist });	// check if the song exists (it should be) TODO check ._id with the DB (could be faster then)
         // play it ! (later just add it to the playlist via the vlc object)
         //pl.add(song.title);		// TODO TODO IMPORTANT FIND A NAMING CONVENTION OR A WAY TO HANDLE DB + FS CONSISTENCY (song.artist -#?$?#- song.title ??)
         pl.enqueue(song.title);		// TODO TODO IMPORTANT FIND A NAMING CONVENTION OR A WAY TO HANDLE DB + FS CONSISTENCY (song.artist -#?$?#- song.title ??)
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



