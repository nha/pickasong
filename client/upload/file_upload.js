// https://gist.github.com/dariocravero/3922137

Template.fileUpload.events({
  'change input': function(ev) {  
    _.each(ev.srcElement.files, function(file) {
      Meteor.saveFile(file, file.name);
    });
  }
});
