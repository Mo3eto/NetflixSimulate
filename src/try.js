const key = '5737c03c0f5959c744a1d11bcaf38950'
const tmdb = require('tmdbv3').init(key);

tmdb.misc.latest((err ,res) => {
	console.log(res.title);
});

tmdb.movie.info(400, (err ,res) => {
	console.log(res.title);	
});

tmdb.person.info(500, (err ,res) => {
	console.log(res.name);	
});

// setting french as default language...
//tmdb.setLanguage('fr');
// and resetting to english.
//tmdb.resetLanguage();