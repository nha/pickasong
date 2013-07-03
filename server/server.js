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
/*
exec('cvlc --extraintf rc --rc-host localhost:1234',
  function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
});
*/
    console.log("VLC started!");



    // test call to vlc
   InitSocketVLC();
/*
    Meteor.http.call("GET", "http://localhost/status:1234",
                 function (error, result) {
                   console.log("error : ");
                   console.log(error);
                   console.log("result : ");
                   console.log(result);
                 });
*/

  });
}
