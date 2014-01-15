/**
 * TODO support other encodings:
 * http://stackoverflow.com/questions/7329128/how-to-write-binary-data-to-a-file-using-node-js
 */

// TODO add here the file in the right collections
// will become usefull only when a way to prevent a full reload when 
// the downloaded song is saved is found


Meteor.methods({
  saveFile: function(blob, name, path, encoding) {
    var path = cleanPath(path) ;
    name = cleanName(name || 'file');
    encoding = encoding || 'binary';
    chroot = Meteor.chroot || 'public';

    path = process.env.PWD + '/public/';
    
    // TODO Add file existance checks, etc...
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
