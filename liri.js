var dotenv = require("dotenv").config();

var keys = require("./keys.js");

var request = require("request");

var Spotify = require('node-spotify-api');

var fs = require("fs");

var spotify = new Spotify(keys.spotify);

var vgn = require('random-game-name');

if (process.argv[2] == "do-what-it-says"){
    var text = fs.readFileSync("random.txt", "utf8").split(",");
    process.argv[2] = text[0];
    process.argv[3] = text[1];
}

switch (process.argv[2]) {
    case "random-game":
        console.log(vgn.random());
        break;
    case "spotify-this-song":
        spotifyThisSong();
        break;
    case "movie-this":
        movieThis();
        break;
}

function movieThis() {

    var movieName = combineArgs();
    movieName = movieName ? movieName : "Mr. Nobody";

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        var response = JSON.parse(body);

        if (!error || response.statusCode === 200) {
            console.log(
                `Title: ${response.Title}\nYear: ${response.Year}\nIMDB Rating: ${response.imdbRating}\nTomato Rating: ${response.tomatoRating}\nCountry: ${response.Country}\nLanguage: ${response.Language}\nPlot: ${response.Plot}\nActors: ${response.Actors}`);
        } else {
            console.log("Something went wrong.");
        }
    });
}

function spotifyThisSong() {
    spotify.search({
        type: 'track',
        limit: 1,
        query: combineArgs()
    }, function (err, data) {
        if (!err) {
            var response = data.tracks.items[0];
            var artists = [];
            for (artist of response.artists){
                artists.push(artist.name);
            }
            console.log(`Artist(s): ${artists.join(", ")}\nSong Name: ${response.name}\nLink: ${response.preview_url}\nAlbum: ${response.album.name}`);
        }
        else{
            console.log(err);
        }
    });
}

function combineArgs() {
    var wordArray = [];
    for (var i = 3; i < process.argv.length; i++) {
        wordArray.push(process.argv[i]);
    }
    return wordArray.join("+");
}