// define the Player Class (constructor)
// which allows the application to communicate with VLC
// via it's RC interface
// assumed a singleton (only one music player at a time) TODO make sure it is a singleton :)

// FIXME slow to start, have to wait : see initialisation (end of constructor)
// mostly OK since commands won't flow away when starting the app, but needs fixing


// constructor 
VLCplayer = function VLCplayer(host, port){ 


	// ************************************************************************ 
	// PRIVATE VARIABLES AND FUNCTIONS 
	// ONLY PRIVELEGED METHODS MAY VIEW/EDIT/INVOKE 
	// *********************************************************************** 
	var vlcHost=host?host:"localhost";
	var vlcPort=port?port:"1234";
	var socket = undefined;
	var musicPath = process.env.PWD+'/public/';
	var hasVLCstarted = false;


	// ************************************************************************ 
	// PRIVILEGED METHODS 
	// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
	// MAY NOT BE CHANGED; MAY BE REPLACED WITH PUBLIC FLAVORS 
	// ************************************************************************ 
	this.toString=this.getName=function(){ return "vlc player" } 


	// initialise the communication with the player
	// the player must have been started beforehand
	this.InitSocketVLC = function() {
		//http://stackoverflow.com/questions/9328737/tcp-socket-write-function-in-node-js-net-package-not-writing-to-socket
		console.log('establishing connection with VLC...');
		socket = new net.Socket();

		socket.connect (vlcPort, vlcHost, function() {
			console.log("connected to VLC!")
			socket.write('status\n');       
		});

		/// event handlers ///

		socket.on('data', function(data) {
			console.log('DATA: ' + data);
		});

		socket.on('error', function(exception){
			console.log('Exception:' + exception);
		});

		socket.on('drain', function() {
			console.log("drain!");
		});

		socket.on('timeout', function() {
			console.log("timeout!");
		});

		socket.on('close', function() {
			console.log('Connection closed');
		});
		return socket;
	}//~InitSocketVLC


	this.startVLC = function() {

		// start (c)VLC with(out) its graphical interface but with it's http interface
		console.log('VLC starting up!');
		console.log('Music path : ' + musicPath);

		//exec('(cvlc --extraintf rc --rc-host localhost:1234) &', this.InitSocketVLC);        // FIXME callback never called

		exec('(vlc --extraintf rc --rc-host ' + vlcHost + ':' + vlcPort + ') &');        	// FIXME tmp only @see above

		// wait until it is started
		// and then use a socket to connect to it
		//while(! this.hasVLCstarted) {

			exec('pgrep -nc vlc', function(error, stdout, stderr) {
				if(stdout == "1\n") {
					console.log("launch the socket!" + hasVLCstarted);
					hasVLCstarted = true;						//ugly (no this here): http://stackoverflow.com/questions/11555125/javascript-how-can-set-parent-object-variable-in-callback  see also http://howtonode.org/what-is-this
					InitSocketVLC();
					//setTimeout(this.InitSocketVLC, 1500);       				// Assume some time to let vlc start properly
				}
			});
		//}

		console.log('vrai?' + hasVLCstarted);
	}//~startVLC


	// access VLC RC Interface via a socket
	this.sendCommand =  function(cmd) {
		// TODO an array of accepted keywords ?
		socket.write(cmd + '\n');      
	}//~sendCommand

	/// TODO methods exposing the vlc RC interface
	// TODO tests by hand before
	// in here because it needs musicPath...
	this.add = function(xyz){ this.sendCommand('add ' + musicPath + xyz + '.ogg'); }			// FIXME HOW TO GUESS EXTENSION ? Populate DB at startup time ???
	this.enqueue = function(xyz){ this.sendCommand('enqueue ' + musicPath + xyz + '.ogg'); this.play();} 	// TODO remove play call, do it only once
	this.playlist = function(){ this.sendCommand('playlist'); } 
	this.play = function(){ this.sendCommand('play'); } 
	this.stop = function(){ this.sendCommand('stop'); } 
	this.next = function(){ this.sendCommand('next'); } 
	this.prev = function(){ this.sendCommand('prev'); } 
	this.goto = function(){ this.sendCommand('goto'); } 
	this.repeat = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('repeat on');} else {this.sendCommand('repeat off');}} 
	this.loop = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('loop on');} else {this.sendCommand('loop off');}} 
	this.rnd = function(onOrOff){ if(onOrOff == 'on') {this.sendCommand('random on');} else {this.sendCommand('random off');}} 
	this.clear = function(){ this.sendCommand('clear'); } 
	this.status = function(){ this.sendCommand('status'); } 
	this.title = function(x){ this.sendCommand('title ' + x); } 
	//...														// FIXME %20 in Sing Sing Sing

	// ************************************************************************ 
	// PUBLIC PROPERTIES -- ANYONE MAY READ/WRITE 
	// ************************************************************************ 


	// ************************************************************************ 
	// CONSTRUCTOR ADDITIONNAL CODE
	// ************************************************************************ 

	this.startVLC();


}//~constructor


// ************************************************************************ 
// PUBLIC METHODS -- ANYONE MAY READ/WRITE 
// ************************************************************************ 



// ************************************************************************ 
// PROTOTYOPE PROERTIES -- ANYONE MAY READ/WRITE (but may be overridden) 
// ************************************************************************ 


// ************************************************************************ 
// STATIC PROPERTIES -- ANYONE MAY READ/WRITE 
// ************************************************************************ 
