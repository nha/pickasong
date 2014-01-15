// Known pb: meteor reloads when the uploaded  song is saved...

Meteor.methods({
  saveFile: function(blob, name, path, encoding) {
    var path = cleanPath(path) ;
    name = cleanName(name || 'file');
    encoding = encoding || 'binary';
    chroot = Meteor.chroot || 'public';

    path = process.env.PWD + '/public/';

    fs.writeFile(path + name, blob, encoding, function(err) {
      if (err) {
        console.log(err);
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    }); 

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
  }
});
