/*
*library for starting and editing data 
*
*/

//Dependencies
var fs = require ('fs');
var path = require ('path');
const { json } = require('stream/consumers');
const { StringDecoder } = require('string_decoder');

//Container for the module (to be exported)
var lib = {};

//Base directory of the data folder
lib.basedir = path.join (__dirname,'/../.data/');





//Write data to a file 
lib.create = function(dir,file,data,callback){
    //Open the file for writing 
fs.open(lib.basedir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
    if(!err && fileDescriptor){

        //Create data to string 
var srtingData = JSON.stringify(data);

//write to file and close it 
fs.writeFile(fileDescriptor,srtingData,function(err){
    if (!err){
        callback(false);
    }else{
        callback('Error closing new file ');
    }
});
    }else{
        callback ('could not create new file, it may already exist');

    }
});
};

// Read data from a file 
lib.read = function(dir,file,callback){
    fs.readFile(lib.basedir+dir+'/'+file+'.json','utf8',function(err,data){
        callback(err,data);
    });
};

//Update data inside a file
lib.update = function(dir,file,data,callback){

    // Open the file for writing
    fs.open(lib.basedir+dir+'/'+file+'.json', 'r+', function(err, fileDescriptor){
      if(!err && fileDescriptor){
        // Convert data to string
        var stringData = JSON.stringify(data);
  
        // Truncate the file
        fs.ftruncate(fileDescriptor,function(err){
          if(!err){
            // Write to file and close it
            fs.writeFile(fileDescriptor, stringData,function(err){
              if(!err){
                fs.close(fileDescriptor,function(err){
                  if(!err){
                    callback(false);
                  } else {
                    callback('Error closing existing file');
                  }
                });
              } else {
                callback('Error writing to existing file');
              }
            });
          } else {
            callback('Error truncating file');
          }
        });
      } else {
        callback('Could not open file for updating, it may not exist yet');
      }
    });
};  

//Delete a file
lib.delete = function(dir,file,callback){
    //Unlink the file
    fs.unlink(lib.basedir+dir+'/'+file+'.json',function(err){
        if(!err){
            callback(false);
        }else{
            callback('Error deleting file');
        }
    });
};


//Export the module 
module.exports = lib;