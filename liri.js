require("dotenv").config();

//vars
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var bandsintown = require("bandsintown")("codingbootcamp");
//var Spotify = require('spotify-web-api-node')
var Spotify = require("node-spotify-api");
//creates log.txt file
var filename = "./log.txt";
//NPM module used to write output to console and log.txt simulatneously
var log = require("simple-node-logger").createSimpleFileLogger(filename);
log.setLevel("all");

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

function mySwitch(userCommand) {
    switch (userCommand) {

        case "concert-this":
            getConcert();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            DoIt();
            break;
    }
//get spotify keys

var spotify = new Spotify(keys.spotify);

var getArtistsName = function (artist) {
    return artist.name;
};

function getSpotify (songName) {
    if (songName === undefined) {
        songName = "I want it that way";
    }
    spotify.search(
        {
            type: 'track',
            query: secondCommand
        },
        function (err, data) {
            if (err) {
                console.log("Error occured: " + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log(i);
                console.log("artist(s): " + songs[i].artists.map(getArtistsName));
                console.log("song name: " + songs[i].name);
                console.log("preview song: " + songs[i].preview_url);
                console.log("album: " + songs[i].album.name);
                console.log("-----------------------------------");
            }
        }
    );
};

    function getConcert() {
        if (action === 'concert-this') {
            var artistName = "";
            for (var i = 3; i < process.argv.length; i++) {
                artistName += process.argv[i];
            }
            console.log(artistName);
        }
        else {
            artistName = parameter;
        }



        var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codecademy";


        request(queryUrl, function (error, response, body) {

            if (!error && response.statusCode === 200) {

                var JS = JSON.parse(body);
                for (i = 0; i < JS.length; i++) {
                    var dTime = JS[i].datetime;
                    var month = dTime.substring(5, 7);
                    var year = dTime.substring(0, 4);
                    var day = dTime.substring(8, 10);
                    var dateForm = month + "/" + day + "/" + year

                    logIt("\n---------------------------------------------------\n");


                    console.log("Date: " + dateForm);
                    console.log("Name: " + JS[i].venue.name);
                    console.log("City: " + JS[i].venue.city);
                    if (JS[i].venue.region !== "") {
                        console.log("Country: " + JS[i].venue.region);
                    }
                    console.log("Country: " + JS[i].venue.country);
                    console.log("\n---------------------------------------------------\n");

                }
            }
        });
    }

    function getMovie() {
        var movieName = secondCommand;

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
        request(queryUrl, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);
                logIt("=================Movie Info=================");
                logIt("Title: " + body.Title);
                logIt("Release Year: " + body.Year);
                logIt("IMdB rating: " + body.imdbRating);
                logIt("Country: " + body.Country);
                logIt("Language: " + body.Language);
                logIt("Plot: " + body.Plot);
                logIt("Actors: " + body.Actors);
                logIt("Rotten Tomatoes rating: " + body.Ratings[2].Value);
                logIt("Rotten Tomatoes URL: " + body.tomatoURL);
                logIt("==================The End==================");

            } else {
                console.log("Error occurred")
            }
            if (movieName === "Mr. Nobody") {
                console.log("---------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        })
    }
    function doIt() {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            var cmds = data.toString().split(',');
        });
    }
}
mySwitch(userCommand);
