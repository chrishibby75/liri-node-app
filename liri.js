//keys and call for Spotify
require('dotenv').config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
//call for omdb/bands in town
var request = require('request');
var bandsintown = require('bandsintown')('codingbootcamp');
//call for moment.js
var moment = require('moment');
//call for file system
var fs = require("fs");
//call for logging requests
var filename = './log.txt';
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

var spotify = new Spotify(keys.spotify);

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var input = process.argv[2];
var search = process.argv[3];

function mySwitch() {
    switch (input) {
        case 'spotify-this-song':
            getSpotify();
            break;

        case 'concert-this':
            getConcert();
            break;

        case 'movie-this':
            getMovie();
            break;

        case 'do-what-it-says':
            doWhat();
            break;
    }
}

//spotify call back

function getSpotify() {
    var search = process.argv[3];
    if (search == 'undefined') {
        var search = "the sign";
    }
    //calling for a song by track name
    spotify.search({ type: 'track', query: search, limit: 1 }, function (err, data) {
        //logging error if error
        if (err) {
            return console.log('Error occured: ' + err);
        }
        //logging artist, song, album and song preview
        console.log(JSON.stringify("Artist Name: " + data.tracks.items[0].album.artists[0].name));
        console.log(JSON.stringify("Song Name: " + data.tracks.items[0].name));
        console.log(JSON.stringify("Album Name: " + data.tracks.items[0].album.name));
        console.log(JSON.stringify("Song preview: " + data.tracks.items[0].preview_url));
    });
};

//bands in town call back
function getConcert() {
    if (search === undefined) {
        console.log("Enter artist");
    }
    var url = "https://rest.bandsintown.com/artists/" + search + "/events?app_id=codecademy";
    request(url, function (error, response, body) {
        if (err) {
            return console.log(err)
        }
        //logging venue, location and date
        console.log("venue: " + JSON.parse(body)[0].venue.name);
        console.log("Location: " + JSON.parse(body)[0].venue.city + ", " + JSON.parse(body)[0].venue.region);
        console.log("Date: " + moment(JSON.parse(body)[0].datetime).format('MMMM Do YYYY, h:mm a'));

    })
};

//OMDB Call back
function getMovie() {
    // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
    var movieName = search;
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        // If the request is successful = 200
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);

            //Simultaneously output to console and log.txt via NPM simple-node-logger
            console.log('================ Movie Info ================');
            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);
            console.log('==================THE END=================');

        } else {
            //else - throw error
            console.log("Error occurred.")
        }
        //Response if user does not type in a movie title
        if (movieName === "Mr. Nobody") {
            console.log("-----------------------");
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    });
};

//textfile callback

function textfile() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(",");
        input = dataArr[0];
        process.argv[3] = dataArr[1];

        //run arguments through the switch
        mySwitch();
    })
};

function trackInfo() {
    if (search == undefined || search == "undefined") {
        return console.log("No search was entered")
        process.exit();
    } else {
        fs.appendFile("log.txt", search, + ',', function (err, data) {
            if (err) {
                return console.log(err);
            } else {
                console.log("======================");
                console.log("search has been logged");
                console.log("======================");
            }
        })
    };

    fs.readFile("log.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        }

        var dataArr = data.split(',');
        console.log(dataArr);
    });

};
if (input != "do-what-it-says") {
    mySwitch();
} else {
    console.log("getting commands")
    textfile();
}