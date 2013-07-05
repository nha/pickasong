sys = Npm.require('sys');
exec = Npm.require('child_process').exec;
//io = Npm.require('socket.io')) ;
fs = Npm.require('fs') ;
// tcp library
//http://nodejs.org/api/net.html
net = Npm.require('net');
socket = 

function puts(error, stdout, stderr) { sys.puts(error); sys.puts(stdout); sys.puts(stderr); }


if (Meteor.isServer) {
        Meteor.startup(function () {
               console.log("Server starting up!");
               pl = new VLCplayer();

	//pl.sendCommand('status');

        });
}
