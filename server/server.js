sys = Npm.require('sys');
exec = Npm.require('child_process').exec;
//io = Npm.require('socket.io')) ;
fs = Npm.require('fs') ;
// tcp library
//http://nodejs.org/api/net.html
net = Npm.require('net');


function puts(error, stdout, stderr) { sys.puts(error); sys.puts(stdout); sys.puts(stderr); }
function testWrite() { console.log("connected to VLC!"); socket.write("status", "UTF8", puts); }

function InitSocketVLC() {
	//http://stackoverflow.com/questions/9328737/tcp-socket-write-function-in-node-js-net-package-not-writing-to-socket
	console.log("VLC started!");
	console.log("initialising socket...");

	var socket = new net.Socket();

	socket.connect (1234, "localhost", function() {
		console.log("connected to VLC!")
		socket.write('status\n');       
	});


	// Add a 'data' event handler for the client socket
	// data is what the server sent to this socket
	socket.on('data', function(data) {
		console.log('DATA: ' + data);
		// Close the client socket completely
		//    client.destroy();
	});

	socket.on('error', function(exception){
		console.log('Exception:');
		console.log(exception);
	});


	socket.on('drain', function() {
		console.log("drain!");
	});

	socket.on('timeout', function() {
		console.log("timeout!");
	});

	// Add a 'close' event handler for the client socket
	socket.on('close', function() {
		console.log('Connection closed');
	});

}



if (Meteor.isServer) {
	Meteor.startup(function () {
		console.log("Server starting up!");


		// start (c)VLC with(out) its graphical interface but with it's http interface
		//exec("ls -la", puts);
		//exec("vlc -I qt4 --reset-config", puts);
		///// exec("vlc --extraintf rc --rc-host localhost:1234", puts);
		//exec("vlc -I http --http-host localhost --http-port 1234 --reset-config", puts);

		exec('(cvlc --extraintf rc --rc-host localhost:1234) &', InitSocketVLC);	// FIXME callback never called
		setTimeout(InitSocketVLC, 2500);	// FIXME "manual" callback called. Assume 2.4 sec to start vlc
		//console.log("VLC started!");

	});
}
