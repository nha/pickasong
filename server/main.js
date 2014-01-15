// main.* => loaded last

sys = Npm.require('sys');
exec = Npm.require('child_process').exec;
fs = Npm.require('fs') ;
net = Npm.require('net');
Future  = Npm.require('fibers/future');

puts = function(error, stdout, stderr) { sys.puts(error); sys.puts(stdout); sys.puts(stderr); }


if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Server starting up!");

    // launches VLC 
    pl = new VLCplayer();

    // bootstrap music list from /public
    (function() {		
      Playlist.remove({});
      Songs.remove({});
      if (Songs.find().count() === 0) {
        var musicList = getMusicFileList('/public/');
        for (var i = 0; i < musicList.length; i++) {
          Songs.insert({"song": musicList[i]});
        }
      }
    })();

  });//~Meteor.startup
}//~Meteor.isServer



function getMusicFileList(directory) {
  var allFiles = fs.readdirSync(process.env.PWD + directory);

  // todo decide if we need to check that,
  // or maybe just check at upload time...
  /*
     var cleanedUpFiles = _(allFiles).reject( function(fileName) {
     return fileName.indexOf('.ogg') < 0;
     });

     return cleanedUpFiles;
     */
  return allFiles;
}



// ************************************************************************ 
// METHODS PUBLISHED TO THE CLIENT
// ie. our internal API
// *********************************************************************** 

//Also @see server_save_file.js


Meteor.methods({

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

// play a given song: by adding it at the end of the playlist
playSong: function (song) {

  var mySong = Songs.findOne({"song" : song.song});
  // vlc just needs the path
  pl.enqueue(mySong.song);
  Playlist.insert(mySong);	// also update the playlist for everyone
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



