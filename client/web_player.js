
// events from the web player are sent to VLC via the exposed mongo methods
// HTML Web Player --> This file --> Meteor.call are defined in Meteor.Methods in the server side
// --> the server send the commands to VLC
// TODO use a collection ??? => pb: volume doit se mettre a jour pour tout le monde
// TODO replace Meteor.call with Meteor.apply to make async calls :)
// TODO expose pause
if (Meteor.isClient) {

	Template.play.events({
		'click input' : function () {
			Meteor.call('startPlayer');
		}
	});

	Template.stop.events({
		'click input' : function () {
			Meteor.call('stopPlayer');
		}
	});

	Template.pause.events({
		'click input' : function () {
			Meteor.call('pausePlayer');
		}
	});

	Template.setVolume.events({
		'mouseup input' : function (evt) {		// TODO find better event
			Meteor.call('setVolume', evt.target.value );
		}
	});

}

