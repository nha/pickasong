
if (Meteor.isClient){
  Songs = new Meteor.Collection('songs');
  Meteor.subscribe('songs');							// change when a lot of musics.

  Playlist = new Meteor.Collection('playlist');
  Meteor.subscribe('playlist');

  Template.playlist.songtitle = function () {
    return Songs.find({}, {sort: {artist: 1, title: 1}});			
  };


////////// Edition //////////


////////// Helpers for in-place editing, keep before //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};


// When editing a song title, ID of the song
Session.set('editing_song', null);


// chanson editee visible depuis le html
Template.song.editing = function () {
  return Session.equals('editing_song', this._id);
};


///evenements chanson
Template.song.events({
 
  'dblclick': function (evt, tmpl) {
    Session.set('editing_song', this._id);
    Meteor.flush(); // update DOM before focus
    activateInput(tmpl.find("#song-input"));
    //Meteor.call("test");
    //test jouer chanson
    //Meteor.call("print", "monId : " + this._id);
    //Meteor.call("play", this._id);
    //Playlist.insert(this._id);
  }

});

// evenement chanson en cours de modif "#song-input"
Template.song.events(okCancelEvents(
  '#song-input',
  {
    ok: function (value) {
      Songs.update(this._id, {$set: {title: value}});
      Session.set('editing_song', null);
    },
    cancel: function () {
      Session.set('editing_song', null);
    }
  }));

////////// Fin Edition //////////


////////// Play a song //////////

///click play button on a song
Template.playButton.events({
  'click': function (evt, tmpl) {
    evt.preventDefault();		// we don't want to change the URL
    Meteor.call("printObj", this);
    Meteor.call("playSong", this);
  }
});

}//~client
