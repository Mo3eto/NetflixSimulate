var unirest = require("unirest");

var req = unirest("GET", "https://imdb-internet-movie-database-unofficial.p.rapidapi.com/search/inception");

req.headers({
	"x-rapidapi-host": "imdb-internet-movie-database-unofficial.p.rapidapi.com",
	"x-rapidapi-key": "b046ec945fmsha6d847d573185b0p142c45jsna903aca1878a"
});


req.end(function (res) {
	if (res.error) throw new Error(res.error);

	console.log(res.body);
});