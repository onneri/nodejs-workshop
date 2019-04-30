// dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

// buid path for file in use
const buildPath = function (dir, filename) {
  const baseDir = path.join(__dirname, '/../.data');
  return `${baseDir}/${dir}/${filename}.json`;
};

const lib = {};


lib.create =  function(dir, filename, data, callback){
  const filepath = buildPath(dir, filename);

  fs.open(filepath, 'wx', function(err, file){
    if(!err && file){
      fs.writeFile(file, JSON.stringify(data), function(err){
        if(!err){
          fs.close(file, function (err) {
            if(!err){
              callback(false);
            }else{
              callback('Error closing new file');
            }
          })
        }else{
          callback('Error writing on new file');
        }
      })
    }else{
      callback('Error creating new file');
    }
  });
};

lib.read = function(dir, filename, callback){
  const filepath = buildPath(dir, filename);

  fs.readFile(filepath, 'utf8', function(err, data){
    if(!err && data){
      const parsedData = helpers.parseJsonToObject(data);
      callback(false, parsedData);
    }else{
      callback(err, data);
    }
  });
};

lib.update =  function(dir, filename, data, callback){
  const filepath = buildPath(dir, filename);

  fs.open(filepath, 'r+', function(err, file){
    if(!err && file){
      fs.truncate(filepath, function (err) {
        if(!err){
          fs.writeFile(file, JSON.stringify(data), function(err){
            if(!err){
              fs.close(file, function (err) {
                if(!err){
                  callback(false);
                }else{
                  callback('Error closing updated file');
                }
              })
            }else{
              callback('Error writing to existing file');
            }
          })
        }else{
          callback('Error truncating file');
        }
      })
    }else{
      callback('Error opening file');
    }
  });
};

lib.delete = function(dir, filename, callback){
  const filepath = buildPath(dir, filename);

  fs.unlink(filepath, function(err){
    if(!err){
      callback(false);
    }else{
      callback('error deleting the file');
    }
  });
};

module.exports = lib;