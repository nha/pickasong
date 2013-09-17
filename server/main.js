// main.* => loaded last

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


(function() {		// some bootsrap data that corresponds to the data in the /public directory
    Playlist.remove({});
    Songs.remove({});
    if (Songs.find().count() === 0) {

      // exemple de donnees :
	// etre coherent avec mongoDB (blobs binaire de musique?)
          // string artist
	  // string song title
	  // filepath ????? => see below !
	  // lenght
	  // comment
	  // upvotes
	  // downvotes
	// bootstraping code for testing purposes
	var testJSONsonglist = [
		{"artist": "Belleruche",		"title": "Minor Swing",						"filename": "Minor Swing"},
		{"artist": "G-Swing",			"title": "Sing Sing Sing (feat. Ania Chow)",			"filename": "Sing Sing Sing (feat. Ania Chow)"},
		{"artist": "Caravan Palace", 		"title": "Jolie coquine", 					"filename": "Jolie coquine"},
		{"artist": "Parov Stellar", 		"title": "Chambermaid Swing", 					"filename": "Chambermaid Swing"},
		{"artist": "Parov Stellar", 		"title": "Libella Swing", 					"filename": "Libella Swing"},
		{"artist": "Pink Martini", 		"title": "Je ne veux pas travailler", 				"filename": "Je ne veux pas travailler"},
		{"artist": "Sexi Sushi", 		"title": "Enfant de putain _ Salope ta mère", 			"filename": "Enfant de putain _ Salope ta mère"}
	    ];

      for (var i = 0; i < testJSONsonglist.length; i++) {
        Songs.insert(testJSONsonglist[i]);
	}
     }
})();


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
       console.log("test meteor method call");
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

     // play a given song - (in fact add it at the end of the playlist)
     playSong: function (song) {
         var song = Songs.findOne({ title  : song.title, artist : song.artist });	// check if the song exists (it should be) TODO check ._id with the DB (could be faster then)
         pl.enqueue(song.filename);		// TODO TODO IMPORTANT FIND A NAMING CONVENTION OR A WAY TO HANDLE DB + FS CONSISTENCY (song.artist -#?$?#- song.title ??)
						// because that information will
						// come from the forms anyway => the filename attribute should just be some kind of mongo method... (is it possible?)
         return 0;
     },

     // send a command to VLC
     vlcCommand: function(cmd) {
        pl.sendCommand(cmd);
        return 0;
     },

// ***********************
// WEB PLAYER METHODS - in web_player.js
// ***********************


  }); // ~Meteor.methods



