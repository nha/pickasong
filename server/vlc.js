// define the Player Class (constructor)
// which allows the application to communicate with VLC
// via it's RC interface
// assumed a singleton (only one music player at a time)
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

	// ************************************************************************ 
	// PRIVILEGED METHODS 
	// MAY BE INVOKED PUBLICLY AND MAY ACCESS PRIVATE ITEMS 
	// MAY NOT BE CHANGED; MAY BE REPLACED WITH PUBLIC FLAVORS 
	// ************************************************************************ 
	this.toString=this.getName=function(){ return "vlc player" } 


	// initialise the communication with the player
	// the player must have been started beforehand
	// TODO : decide if public or private and if public use it as a (re)start also ?
	this.InitSocketVLC = function() {
		//http://stackoverflow.com/questions/9328737/tcp-socket-write-function-in-node-js-net-package-not-writing-to-socket
		console.log('establishing connection with VLC');
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


	// access VLC RC Interface via a socket
	this.sendCommand =  function(cmd) {
		// TODO an array of accepted keywords ?
		socket.write(cmd + '\n');      
	}//~sendCommand

	// ************************************************************************ 
	// PUBLIC PROPERTIES -- ANYONE MAY READ/WRITE 
	// ************************************************************************ 


	// ************************************************************************ 
	// CONSTRUCTOR ADDITIONNAL CODE
	// ************************************************************************ 


	// start (c)VLC with(out) its graphical interface but with it's http interface
	//exec('(cvlc --extraintf rc --rc-host localhost:1234) &', this.InitSocketVLC);        // FIXME callback never called
	console.log('VLC starting up!');
	exec('(cvlc --extraintf rc --rc-host ' + vlcHost + ':' + vlcPort + ') &');        	// FIXME tmp only @see above
	setTimeout(this.InitSocketVLC, 500);       					        // FIXME "manual" callback called. Assume some time to start vlc
	//this.InitSocketVLC();


}//~constructor


// ************************************************************************ 
// PUBLIC METHODS -- ANYONE MAY READ/WRITE 
// ************************************************************************ 

/// TODO methods exposing the vlc RC interface


// ************************************************************************ 
// PROTOTYOPE PROERTIES -- ANYONE MAY READ/WRITE (but may be overridden) 
// ************************************************************************ 


// ************************************************************************ 
// STATIC PROPERTIES -- ANYONE MAY READ/WRITE 
// ************************************************************************ 
