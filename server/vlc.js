// define the music player class
// which allows the application to communicate with VLC
// via it's RC interface
// this is a bit hacky for now


// constructor 
VLCplayer = function VLCplayer(host, port){ 

  this.vlcHost = host?host:"localhost";
  this.vlcPort = port?port:"1234";
  this.socket = undefined;
  this.musicPath = process.env.PWD+'/public/';

  if(this.vlcHost == "localhost") {
    console.log('starting VLC...');
    this.startVLC.call(this);					//start VLC locally
  }
  else {
    console.log('connecting to VLC...');
  }

  // wait some time to get vlc a chance to start
  // if not retry anyway
  setTimeout(this.InitSocketVLC.call(this), 2000);       		

} //~VLCplayer (constructor)



VLCplayer.prototype.toString = this.getName = function() {
  return "vlc player" ;
} //~toString


// initialise communication with VLC
// VLC must have been started beforehand
VLCplayer.prototype.InitSocketVLC = function() {
  var Myself = this;
  this.socket = new net.Socket();

  this.socket.connect(this.vlcPort, this.vlcHost, function() {		// launch the socket !
    Myself.socket.write('status\n');       
  });

  /// event handlers ///

  this.socket.on('data', function(data) {
    //console.log('vlc data: ' + data);
  });

  this.socket.on('error', function(exception){
    console.log('Exception:' + exception);
    if(exception.errno == 'ECONNREFUSED') {
      // VLC isn't reacheable yet, wait and retry
      setTimeout(Myself.InitSocketVLC.bind(Myself), 2000);
    }
  });

  this.socket.on('drain', function() {
    //console.log("vlc drain!");
    //Myself.connectedToVLC = true;
  });

  this.socket.on('timeout', function() {
    console.log("vlc timeout!");
  });

  this.socket.on('close', function() {
    console.log('vlc connection closed');
  });
}//~InitSocketVLC


// start (c)VLC with(out) its graphical interface but with it's RC interface
// and then use a socket to connect to it
// command:  (vlc --extraintf rc --rc-host localhost:1234) &
VLCplayer.prototype.startVLC = function() {
  exec('(vlc --extraintf rc --rc-host ' + this.vlcHost + ':' + this.vlcPort + ') &',
      puts
      ); 
}//~startVLC


// @unused checks if the VLC process is started
// Note : VLC may be running but not yet have it's RC interface up and ready
VLCplayer.prototype.isVLCrunning = function(callback){
  return exec('pgrep -nc vlc', function(error, stdout, stderr) {
    var res = false;
    if(stdout == "1\n") {
      res = true;
    }
    callback(res);
  });
}


// access VLC RC Interface via a socket
VLCplayer.prototype.sendCommand =  function(cmd) {
  this.socket.write(cmd + '\n');      
}//~sendCommand


// VLC exposed methods (mostly untested)
// VLC -I rc
// > longhelp

VLCplayer.prototype.add = function(xyz){ this.sendCommand('add ' + this.musicPath + xyz); }
VLCplayer.prototype.enqueue = function(xyz){ this.sendCommand('enqueue ' + this.musicPath + xyz); this.play();}
VLCplayer.prototype.playlist = function(){ this.sendCommand('playlist'); } 
VLCplayer.prototype.play = function(){ this.sendCommand('play'); } 
VLCplayer.prototype.stop = function(){ this.sendCommand('stop'); } 
VLCplayer.prototype.next = function(){ this.sendCommand('next'); } 
VLCplayer.prototype.prev = function(){ this.sendCommand('prev'); } 
//VLCplayer.prototype.goto = function(){ this.sendCommand('goto'); } 
VLCplayer.prototype.repeat = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('repeat on');} else {this.sendCommand('repeat off');}} 
VLCplayer.prototype.loop = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('loop on');} else {this.sendCommand('loop off');}} 
VLCplayer.prototype.rnd = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('random on');} else {this.sendCommand('random off');}} 
VLCplayer.prototype.clear = function(){ this.sendCommand('clear'); } 
VLCplayer.prototype.status = function(){ this.sendCommand('status'); } 
VLCplayer.prototype.title = function(x){ this.sendCommand('title ' + x); }
//...	
VLCplayer.prototype.pause = function(){ this.sendCommand('pause '); } 	
//...														
VLCplayer.prototype.volume = function(x){this.sendCommand('volume ' + x); }
//...	


