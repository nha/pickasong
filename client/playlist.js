
if (Meteor.isClient){

  Playlist = new Meteor.Collection('playlist');
  Meteor.subscribe('playlist');
	
};
