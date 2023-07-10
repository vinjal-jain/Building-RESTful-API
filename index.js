/*
*Primary file for the API
*
*/

//Dependencies
var http = require('http');
var url = require ('url');


//The server should respond to all requests with a string
var server = http.createServer(function(req,res){

//Get the URl and parse it 
var parseUrl = url.parse(req.url,true);

//Get the Path 
var path = parseUrl.pathname;
var trimmedPath = path.replace(/^\/+$/g,'');

//Get the query string as a Object 
var queryStringObject = parseUrl.query;


//Get the HTPP Method
var method = req.method.toLowerCase();

//Get the headers as an object 
var headers = req.headers;

//Send the response    
    res.end('Hello World\n');

//Log the request path 
console.log ('Request recieved with these headers',headers);

});

//Start the server, and have it listenan port 3000
server.listen(3000,function(){
    console.log("The server is listening on port 3000 now");
});