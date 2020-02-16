const _ = require('underscore');

module.exports = function artistsAudit(tracks) {
    let artistsIds = {};

    _.each(tracks, track => {
        _.each(track.track.artists, artist => {
            if (typeof artistsIds[artist.name] === 'undefined') {
                artistsIds[artist.name] = artist.id;
                return;
            }

            if (artistsIds[artist.name] !== artist.id) {
                console.log(artistsIds[artist.name] + ' != ' + artist.name);
                console.log(track.track);
            }
        });
    });
}