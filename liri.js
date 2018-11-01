require("dotenv").config();

//vars
var keys = require("./keys");
var fs = require("fs");
var request = require("request");
var bandsintown = require("bandsintown");
//var Spotify = require('spotify-web-api-node')
var Spotify = require("node-spotify-api");
//creates log.txt file
var filename = "./log.txt";
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger(filename);
log.setLevel('all');

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

//get spotify keys

var spotify = new spotify(keys.spotify);

var getArtistsName = function (artist) {
    return artist.name;
};

var getSpotity = function (songName) {
    if (songName === undefined) {
        songName = "I want it that way";
    }
    spotify.search(
        {
            type: 'track',
            query: userCommand
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

function mySwitch(userCommand) {
    switch(userCommand) {

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

    function getConcert() {
        var concertName = secondCommand;

        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        request(queryUrl, function(error, response, artist) {
            var artist = JSON.parse(artist);
            logOutput('===================Artist info===================');
            logOutput('')
        })
    }

    function getMovie() {
        var movieName = secondCommand;

        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);
                logOutput('=================Movie Info=================');
                logOutput("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB rating: " + body.imdbRating);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput("Rotten Tomatoes rating: " + body.Ratings[2].Value);
                logOutput("Rotten Tomatoes URL: " + body.tomatoURL);
                logOutput("==================The End==================");

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
            fs.readFile("random.txt", "utf8", function(error, data){
                if (!error);
                console.log(data.toString());
                var cmds = data.toString().split(',');
            });
        }
}
    mySwitch(userCommand);
