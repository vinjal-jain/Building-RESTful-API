/*
*Create and export configuration variables
*
*/

const { strict } = require("assert");

//Container for all the environments 
var environments = {};

//Staging (default) environment 
environments.staging = {
    'port' : 3000,
    'envName' : 'staging'
};

//Production environment
environments.production = { 
    'port' : 5000,
    'envName' : 'production'
};

//Determine which enviornment was passed as a command line argument 
var currentEnvironment = typeof(process.env.NODE_ENV)==
'string' ?
process.env.NODE_ENV.toLowerCase() : '' ;

// Check that the current environment is one of the enviornment above, if not, default to staging 
var enviornmentToExport = typeof(environments[currentEnvironment]) ==
'object' ? environments[currentEnvironment] :
environments.staging ;

//Export the module 
module.exports = enviornmentToExport;