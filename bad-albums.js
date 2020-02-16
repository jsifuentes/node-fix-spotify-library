const _ = require('underscore');
const cache = require('./cache');

var artistAlbumCache = {};
var lastApiCall = 0;

module.exports = async function badAlbums(spotifyApi, tracks) {

    async function callApi () {
        let params = Array.prototype.slice.call(arguments);
        let apiName = params.shift();

        if (lastApiCall > (new Date().getTime() - 1000)) {
            await new Promise(r => setTimeout(r, lastApiCall - new Date().getTime()));
        }

        lastApiCall = new Date().getTime();
        return spotifyApi[apiName].apply(spotifyApi, params);
    }

    // get all tracks
    // load the artist
    // load artist albums
    // see if we're using the wrong song of the album

    // load the artist

    for (var i = 0; i < tracks.length; i++) {
        let track = tracks[i];

        await (async (track) => {
            // get first artist
            let artist = track.track.artists[0];
            let album = track.track.album;

            if (album.album_type === 'album') {
                // load the artist albums
                try {
                    let cacheKey = 'arist_' + artist.id + '_albums';
                    let artistAlbums = cache.get(cacheKey);
                    if (!artistAlbums) {
                        artistAlbums = await callApi('getArtistAlbums', artist.id, { include_groups: 'album', limit: 50 });
                        cache.set(cacheKey, artistAlbums);
                    }

                    const albumIds = _.pluck(artistAlbums.body.items, 'id');

                    if (albumIds.indexOf(album.id) > -1) {
                        // console.log('good', track.track.name);
                    } else {
                        console.log('bad - ', track.track.artists[0].name, track.track.name);
                    }
                } catch (e) {
                    console.log('err', e);
                }
            }
        })(track);
    }
}