// ***********************
// WEB PLAYER METHODS
// ***********************
// the exposed methods that the client web player can use
// those are control commands over the VLC media player

Meteor.methods({
  // start the VLC player
  startPlayer: function() {
    pl.play();
    return 0;
  },

// stop the VLC player
stopPlayer: function() {
  pl.stop();
  return 0;
},

// pause the VLC player
pausePlayer: function() {
  pl.pause();
  return 0;
},

// set the volume of the VLC player
setVolume: function(volume) {
  // VLC volume is between 0 and 256 (can be more, but we restrict it at 100%)
  // while the volume on the web interface is between 0 and 100.
  pl.volume(volume /100 * 256);
  return 0;
},
  });




