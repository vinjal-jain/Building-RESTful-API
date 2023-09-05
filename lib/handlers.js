/*
*Request handlers
*
*/

//Dependencies
const { userInfo } = require('os');
var _data = require('./data');
var helpers = require ('./helpers');
const { error } = require('console');



//Define the handlers 
var handlers = {};

//Users
handlers.users = function(data,callback){
  var acceptableMethods = ['post','get','put','delete'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._users[data.method](data,callback);
  } else {
    callback(405);
  }
};

//Container for the users submethods
handlers._users = {};

//Users - POST
//Required data : firstname, lastname , phone , password , tosAgreement
//Optional data : name
handlers._users.post = function(data,callback){
//Check that all required find are filled out
var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
var phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
var tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

if(firstName && lastName && phone && password && tosAgreement){
    // Make sure the user doesnt already exist
    _data.read('users',phone,function(err,data){
      if(err){
        // Hash the password
        var hashedPassword = helpers.hash(password);

        // Create the user object
        if(hashedPassword){
          var userObject = {
            'firstName' : firstName,
            'lastName' : lastName,
            'phone' : phone,
            'hashedPassword' : hashedPassword,
            'tosAgreement' : true
          };

          // Store the user
          _data.create('users',phone,userObject,function(err){
            if(!err){
              callback(200);
            } else {
              console.log(err);
              callback(500,{'Error' : 'Could not create the new user'});
            }
          });
        } else {
          callback(500,{'Error' : 'Could not hash the user\'s password.'});
        }

      } else {
        // User alread exists
        callback(400,{'Error' : 'A user with that phone number already exists'});
      }
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }

};

//Users - Get
//Required data ; phone
//Optional data ; none
 //@TODO only let an authenticated user access their object, Don't let them acess anyone 
handlers._users.get = function(data,callback){
//Check that the phone number is valid 
var phone = typeof(data.queryStringObject.phone)  == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
if(phone){
  //Lookup the user 
  _data.read('users',phone,function(err,data){
    if(!err && data){
      //Remove the hashed passwordd from the user object before returning it to the request
      delete data.hashedPassword;
      callback(200,data);
    }else{
      callback(404);
   }
  });

}else{
  callback(400,{'Error' : 'Missing required field'});
  }
};

//Users - Put
//Required data : phone 
// @Todo Only let an athenticated user update their own object. Don't let then update anyone else's
handlers._users.put = function(data,callback){
 //Check for the required fields
 var phone = typeof(data.payload.phone)  == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

 //Check for the optional fields
 var firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
 var lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
 var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
 
 //Error if the phone is invalid
 if(phone){
  //Error if nothing is sent to update
  if(firstName || lastName || password ){
    //Lookup the user 
    _data.read('users' , phone ,function(err,usreData) {
      if(!err && usreData){
        //Update the fields necessary 
        if(firstName){
          usreData.firstName = firstNamel;
   }
   if(lastName){
    usreData.lastName = lastName;

   }
   if(password){
    usreData.hashedPassword = helpers.hash(password) ;
   }
   //Store the new updates
   _data.update('users',phone,usreData,function(err){
    if(!err){
      callback(200);
    }else{
      console.log(err);
      callback(500,{'Error' : 'Could not update the user'});
    }
   });
      }else{
        callback(400,{'Error' : 'The specified user does not exist'});
      }
    });
  }else{
    callback(400,{'Error' : 'Missing fields to update'});
      }
    }else{
      callback(400,{'Error' : 'Missing required field'});
    }

    };
 
  //Users - Delete
  //Required field : phone
  // @TODO only let an authentication user delete their object , Dont let them deletle anyone elses
  // @TODO Cleanup (Delete) any other data files associated with this user  
handlers._users.delete = function(data,callback){
  //Check that the phone number is valid 

  var phone = typeof(data.queryStringObject.phone)  == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone){
    //Lookup the user 
    _data.read('users',phone,function(err,data){
      if(!err && data){
       _data.delete('users', phone,function(err,data){
        if(!err){
          callback(200);
        }else{
          callback(500,{'Error' : 'Could not delete specified user'})
        }
       })
      }else{
        callback(400,{'Error' : 'Could not find the specified user'});
     }
    });
  
  }else{
    callback(400,{'Error' : 'Missing required field'});
    }
  };


//Ping handler 
handlers.ping = function(data,callback){
 callback(200);   
};



//Not found handler
handlers.notfound = function (data, callback) {
    callback(404);
};


// Export the module
module.exports = handlers
