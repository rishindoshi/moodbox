module.exports = function(app, api) {

	// Logged in check
	function loggedIn(req, res, next) {
	    if (req.user) {
	        next();
	    } else {
	        res.redirect('/login');
	    }
	}

	//Rendering our index page
	app.get('/login', function(req, res){
		res.render('login');
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});

	// When a user submits an artist
	app.get('/results', loggedIn, function(req, res){
		// Here we get all the tracks from all the user's playlists
		// we want to extract all the unique artists from each of these tracks
		// we then want this list of artists and add to it related artists
		// we then want to extract playlists that match input mood (happy/sad/etc) by doing playlist search on spotifyAPI
		// we will again extract unique artists from these playlists and also add related artists
		// now find intersection of artists between above two lists

		// now generate playlist of random tracks from all artists in above intersection artist list
		api.createPlaylist(req.user.id, 'test playlist', { 'public' : false })
		  .then(function(data) {
			var playlist = data.body;
			// sample data
			var tracklist = ["spotify:track:0eGsygTp906u18L0Oimnem"];
			// add tracks to the playlist and render the widget
			api.addTracksToPlaylist(req.user.id, playlist.id, tracklist)
				.then(function(data) {
				    res.render('results', playlist);
				});

		  }, function(err) {
		    console.log('Something went wrong!', err);
		  });
	});

	app.get('/', loggedIn, function(req, res) {
		res.render('home', {user: req.user});
	});

	app.get('*', loggedIn, function(req, res) {
		res.redirect('/', {user: req.user});
	})

}
