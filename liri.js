require("dotenv").config();
var keys = require("./keys")
var axios = require("axios");
var Spotify = require("node-spotify-api")
var moment = require("moment");
var fs = require("fs")

var spotify = new Spotify(keys.spotify);
// Takes an artist and searches the Bands in Town
var concertThis = function(artist){
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
   
    
    axios.get(queryUrl).then(
        function(response) {
          var jsonData = response.data;
    
          if (!jsonData.length) {
            console.log("No results found for " + artist);
            return;
          }
    
          console.log("Upcoming concerts for " + artist + ":");
    
          for (var i = 0; i < jsonData.length; i++) {
            var show = jsonData[i];
    
            console.log(
              show.venue.city +
                "," +
                (show.venue.region || show.venue.country) +
                " at " +
                show.venue.name +
                " " +
                moment(show.datetime).format("MM/DD/YYYY")
            );
          }
        }
      );
}

// Take song and search Spotify for info
var getMeSpotify = function(songName) {
    if (songName === undefined) {
      songName = "What's my age again";
    }
  
    spotify.search(
      {
        type: "track",
        query: songName
      },
      function(err, data) {
        if (err) {
          console.log("Error occurred: " + err);
          return;
        }
  
        var songs = data.tracks.items;
  
        for (var i = 0; i < songs.length; i++) {
          console.log(i);
          console.log("artist(s): " + songs[i].artists.map(getArtistNames));
          console.log("song name: " + songs[i].name);
          console.log("preview song: " + songs[i].preview_url);
          console.log("album: " + songs[i].album.name);
          console.log("-----------------------------------");
        }
      }
    );
  };

// Search IMDb and return information
var movieThis = function(movie){
    // Default 
    if (!movie){
        movie = "Mr.Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl).then(
        function(response) {
          var jsonData = response.data;
    
          console.log("Title: " + jsonData.Title);
          console.log("Year: " + jsonData.Year);
          console.log("Rated: " + jsonData.Rated);
          console.log("IMDB Rating: " + jsonData.imdbRating);
          console.log("Country: " + jsonData.Country);
          console.log("Language: " + jsonData.Language);
          console.log("Plot: " + jsonData.Plot);
          console.log("Actors: " + jsonData.Actors);
          console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
        }
      );
}

// Output to console and write to log file
var outputData = function(data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err){
        if(err){
            return console.log(err)
        } 
    })
}

var runAction = function(func, parm) {
    switch (func) {
        case "concert-this":
            concertThis(functionData);
            break
        case "spotify-this-song":
            getMeSpotify(functionData);
            break
        case "movie-this":
            movieThis(functionData);
            break
        default:
            outputData("Incorrect Command, Please try again.") 
    }
}

var runThis = function(argOne, argTwo) {
    pick(argOne, argTwo);
  };
  
  runThis(process.argv[2], process.argv.slice(3).join(" "));

