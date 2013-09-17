
// events from the web player are sent to VLC via the exposed mongo methods
// HTML Web Player --> This file --> Meteor.call are defined in Meteor.Methods in the server side
// --> the server send the commands to VLC
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
	Template.setVol.events({
		'mouseup input' : function (evt) {
			Meteor.call('setVolume', evt.target.value );
		}
	});
	Template.toggleVol.events({
		'click input' : function () {
			Meteor.call('toggleVol');
		}
	});

}

