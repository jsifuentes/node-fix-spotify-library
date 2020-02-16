const fs = require('fs');
const config = require('./config.env.json');
const SpotifyWebApi = require('spotify-web-api-node');
const askQuestion = require('./ask-question');
const getAllTracks = require('./get-all-tracks');
const artistsAudit = require('./artists-audit');
const badAlbums = require('./bad-albums');
const cache = require('./cache');

const spotifyApi = new SpotifyWebApi({
  clientId: config.client_id,
  clientSecret: config.client_secret,
  redirectUri: config.redirect_uri
});

console.log(config);
const access = config.access;
const command = process.argv[2];

(async function () {
    if (command === 'auth') {
        const scopes = [
            'playlist-read-private',
            'playlist-modify-public',
            'playlist-modify-private',
            'user-library-modify',
            'user-library-read'
        ], state = 'some-state-of-my-choice';

        var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

        console.log('Go to ' + authorizeURL);
        const code = await askQuestion('What is your code: ');

        try {
            const data = await spotifyApi.authorizationCodeGrant(code);
            console.log(JSON.stringify(data.body));
            return;
        } catch (e) {
            console.log('cant auth');
            console.log(e);
            return;
        }
    }

    spotifyApi.setAccessToken(access.access_token);
    spotifyApi.setRefreshToken(access.refresh_token);

    try {
        let allTracks = cache.get('all_tracks') || [];

        if (!allTracks.length) {
            allTracks = await getAllTracks(spotifyApi);
            cache.set('all_tracks', allTracks);
            // fs.writeFileSync("./all-tracks.json", JSON.stringify(allTracks));
        }

        console.log('running artist audit');
        artistsAudit(allTracks);
        console.log('running album audit');
        badAlbums(spotifyApi, allTracks);
    } catch (e) {
        console.log('cant get library');
        console.log(e);
        return;
    }
})();
