var sys = Npm.require('sys');
var exec = Npm.require('child_process').exec;

function puts(error, stdout, stderr) { sys.puts(stdout) }




if (Meteor.isServer) {
  Meteor.startup(function () {
    console.log("Server starting up!");


// start VLC with its interface
exec("ls -la", puts);
exec("vlc -I", puts);

    console.log("VLC started!");
	// test call to vlc
/*
    Meteor.http.call("POST", "http://api.twitter.com/xyz",
                 {data: {some: "json", stuff: 1}},
                 function (error, result) {
                   if (result.statusCode === 200) {
                     Session.set("twizzled", true);
                   }
                 });

*/
  });
}
