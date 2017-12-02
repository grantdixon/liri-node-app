var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

var Twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');
var prompt = require('prompt');

var userInput = '';
var userSelection = '';

var myTweets = 'tweets';
var songs = 'spotify-this-song';
var movies = 'movie';
var doWhat = 'surprise';

prompt.message = ("Type one of the following: tweets, spotify-this-song, movie, or surprise");
prompt.delimiter = ("\n");

prompt.start();

prompt.get({
	properties: {
		userInput: {
			description: ('What do you choose?')
		}
	}
}, function(err, result){
	userInput = result.userInput;

if(userInput == myTweets){
		myTwitter();
	} 
else if(userInput == songs){
		prompt.get({
			properties: {
				userSelection: {
					description: ('What song do you want to look up?')
				}
			}
		}, function(err, result){

			if(result.userSelection === ""){
				userSelection = "what's my age again";
			} else{
				userSelection = result.userSelection;
			}
			mySpotify(userSelection);
		});
	} 

else if(userInput == movies){
		prompt.get({
			properties: {
				userSelection: {
					description: ('What movie do you want to look up?')
				}
			}
		}, function(err, result){
			if(result.userSelection === ""){
				userSelection = "Mr. Nobody";
			} else{
				userSelection = result.userSelection;
			}
			myMovies(userSelection);
		});

} else if(userInput == doWhat){
		lastOption();
	};
});

function myTwitter(){
	
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret,
	});
	
	var params = {
		screen_name: 'tilikumorcinus',
		count: '20',
		trim_user: false,
	}

client.get('statuses/user_timeline', params, function(error, timeline, response){
		if(!error){
			for(tweet in timeline){
				
				var tDate = new Date(timeline[tweet].created_at);

				
				console.log("Tweet #: " + (parseInt(tweet)+1) + " ");
				console.log(tDate.toString().slice(0, 24) + " ");
				console.log(timeline[tweet].text);
				console.log("\n");

				
				fs.appendFile('log.txt', "Tweet #: " + (parseInt(tweet)+1) + "\n");
				fs.appendFile('log.txt', timeline[tweet].text + "\n");
				fs.appendFile('log.txt', "\n");

			}
		} 
	})

}

function mySpotify(userSelection){
	
	Spotify.search({ 
		type: 'track', 
		query: userSelection
	}, function(err, data) {
	    if (err) throw err;
	    
		var music = data.tracks.items;
		
		    for (var i = 0; i<music.length; i++){
		    	for (j=0; j<music[i].artists.length; j++){
		    	    console.log(("Artist: ") + music[i].artists[j].name);
		        	console.log(("Song Name: ") + music[i].name);
		        	console.log(("Preview Link of the song from Spotify: ") + music[i].preview_url);
		        	console.log(("Album Name: ") + music[i].album.name + "\n");
		    	
		    		fs.appendFile('log.txt', "\n");
			   	    fs.appendFile('log.txt', "Artist: " + music[i].artists[j].name + "\n")
			       	fs.appendFile('log.txt', "Song Name: " + music[i].name + "\n");
			       	fs.appendFile('log.txt', "Preview Link of the song from Spotify: " + music[i].preview_url + "\n");
			       	fs.appendFile('log.txt', "Album Name: " + music[i].album.name + "\n");
			       	fs.appendFile('log.txt', "\n");
		    	}
		    }
	});
}




function myMovies(type){
	
	request('http://www.omdbapi.com/?t='+type+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
		if(error) throw error;
		
		json = JSON.parse(body);
		
		console.log(('Title: ') + json.Title);
		console.log(('Year: ') + json.Year);
		console.log(('Rated: ') + json.Rated);
		console.log(('Country: ') + json.Country);
		console.log(('Language: ') + json.Language);
		console.log(('Director: ') + json.Director);
		console.log(('Actors: ') + json.Actors);
		console.log(('Plot: ') + json.Plot);
		console.log(('imdbRating: ') + json.imdbRating);
		console.log(('Rotten Tomatoes Rating: ') + json.tomatoRating);
		console.log(('Rotten Tomatoes URL: ') + json.tomatoURL);

		
		fs.appendFile('log.txt', "\n");
		fs.appendFile("log.txt", "\n" + "Title: " + json.Title + "\n");
		fs.appendFile("log.txt", "Year: " + json.Year + "\n");
		fs.appendFile("log.txt", "Rated: " + json.Rated + "\n");
		fs.appendFile("log.txt", "Country: " + json.Country + "\n");
		fs.appendFile("log.txt", "Language: " + json.Language + "\n");
		fs.appendFile("log.txt", "Director: " + json.Director + "\n");
		fs.appendFile("log.txt", "Actors: " + json.Actors + "\n");
		fs.appendFile("log.txt", "Plot: " + json.Plot + "\n");
		fs.appendFile("log.txt", "imdbRating: " + json.imdbRating + "\n");
		fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + json.tomatoRating + "\n");
		fs.appendFile("log.txt", "Rotten Tomatoes URL: " + json.tomatoURL + "\n");

	})
}



var lastOption = function(last){
	
	fs.readFile('random.txt', 'utf-8', function(err, data){
		
		var things = data.split(',');
		
		if(things[0] === songs){
			userSelection = things[1];
			mySpotify(userSelection);
		}
	})
}

