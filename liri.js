require("dotenv").config();

//vars
var keys = require("./keys");
var fs = require("fs");
var request = require("request");
//var Spotify = require('spotify-web-api-node')
var spotify = require("node-spotify-api");
//creates log.txt file
var filename = "./log.txt";
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');
