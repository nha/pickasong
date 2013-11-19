// define the music player class
// which allows the application to communicate with VLC
// via it's RC interface
// assumed a singleton (only one music player at a time) - initialized in main

// FIXME VLC may be slow to slow to start, so we have to wait
// mostly OK since commands won't flow away right when starting the app, but probably needs fixing
// And the first attempt seem to always fail. No idea why
// @ see variable hasVLCstarted : use it
// @improvement : use VLC volume normalization

// constructor 
VLCplayer = function VLCplayer(host, port){ 

	this.vlcHost = host?host:"localhost";
	this.vlcPort = port?port:"1234";
	this.socket = undefined;
	this.musicPath = process.env.PWD+'/public/';
	this.connectedToVLC = false;		// unused



	if(this.vlcHost == "localhost") {
		console.log('starting VLC...');
		this.startVLC.call(this);					//start VLC locally
	}
	else {
		console.log('connecting to VLC...');
	}
	setTimeout(this.InitSocketVLC.call(this), 2000);       			// Assume some time to let vlc start properly (or else the socket retries anyway)
										// TODO? use http://www.w3schools.com/js/js_timing.asp  instead?

} //~VLCplayer (constructor)



VLCplayer.prototype.toString = this.getName = function() {
	return "vlc player" ;
} //~toString


// initialise the communication with the player
// the player must have been started beforehand
VLCplayer.prototype.InitSocketVLC = function() {
	var Myself = this;	// clojure
	this.socket = new net.Socket();

	this.socket.connect(this.vlcPort, this.vlcHost, function() {		// launch the socket !
		Myself.socket.write('status\n');       
	});

	/// event handlers ///

	this.socket.on('data', function(data) {
		console.log('DATA: ' + data);
	});

	this.socket.on('error', function(exception){
		console.log('Exception:' + exception);
		if(exception.errno == 'ECONNREFUSED') {
			// VLC isn't reacheable yet, wait and retry (async style)
			Myself.connectedToVLC = false;	
			setTimeout(Myself.InitSocketVLC.bind(Myself), 2000);		// retry every 2 sec
											// TODO? counter ? and/or use isVLCrunning( function(res){if(!res){//...retry} }  );
		}
	});

	this.socket.on('drain', function() {
		console.log("drain!");
		Myself.connectedToVLC = true;
	});

	this.socket.on('timeout', function() {
		console.log("timeout!");
	});

	this.socket.on('close', function() {
		console.log('Connection closed');
	});
}//~InitSocketVLC


// start (c)VLC with(out) its graphical interface but with it's RC interface
// and then use a socket to connect to it
// @improvement : test if vlc if running (fct below)?
VLCplayer.prototype.startVLC = function() {
	exec('(vlc --extraintf rc --rc-host ' + this.vlcHost + ':' + this.vlcPort + ') &', puts);        	// start VLC (vlc --extraintf rc --rc-host localhost:1234) &
}//~startVLC


// checks if the VLC process is started
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
	// TODO an array of accepted keywords ?
	this.socket.write(cmd + '\n');      
}//~sendCommand


/// TODO methods exposing the vlc RC interface
// TODO tests by hand
// VLC -I rc
// > longhelp

VLCplayer.prototype.add = function(xyz){ this.sendCommand('add ' + this.musicPath + xyz + '.ogg'); }				// FIXME HOW TO GUESS EXTENSION ? Populate DB at startup time ???
VLCplayer.prototype.enqueue = function(xyz){ this.sendCommand('enqueue ' + this.musicPath + xyz + '.ogg'); this.play();} 	// TODO remove play call, do it only once
VLCplayer.prototype.playlist = function(){ this.sendCommand('playlist'); } 
VLCplayer.prototype.play = function(){ this.sendCommand('play'); } 
VLCplayer.prototype.stop = function(){ this.sendCommand('stop'); } 
VLCplayer.prototype.next = function(){ this.sendCommand('next'); } 
VLCplayer.prototype.prev = function(){ this.sendCommand('prev'); } 
VLCplayer.prototype.goto = function(){ this.sendCommand('goto'); } 		//? arg
VLCplayer.prototype.repeat = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('repeat on');} else {this.sendCommand('repeat off');}} 
VLCplayer.prototype.loop = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('loop on');} else {this.sendCommand('loop off');}} 
VLCplayer.prototype.rnd = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('random on');} else {this.sendCommand('random off');}} 
VLCplayer.prototype.clear = function(){ this.sendCommand('clear'); } 
VLCplayer.prototype.status = function(){ this.sendCommand('status'); } 
VLCplayer.prototype.title = function(x){ this.sendCommand('title ' + x); } 	//?// FIXME %20 in Sing Sing Sing
//...	
VLCplayer.prototype.pause = function(){ this.sendCommand('pause '); } 		//?
//...														
VLCplayer.prototype.volume = function(x){this.sendCommand('volume ' + x);
} 		//?
//...	
//...	




