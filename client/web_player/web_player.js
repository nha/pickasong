
// events from the web player are sent to VLC via the exposed mongo methods
// HTML Web Player --> This file --> Meteor.call (which are defined in Meteor.Methods on the server side)
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

  Template.pause.events({
    'click input' : function () {
      Meteor.call('pausePlayer');
    }
  });

  Template.setVolume.events({
    'mouseup input' : function (evt) {
      Meteor.call('setVolume', evt.target.value );
    }
  });

}

