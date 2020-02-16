module.exports = async function getAllSavedTracks(spotifyApi) {
    let hasTracks = true;
    let results = [];

    while (hasTracks) {
        const tracks = await spotifyApi.getMySavedTracks({
            limit: 50,
            offset: results.length
        });

        results = results.concat(tracks.body.items);
        hasTracks = !!tracks.body.next;

        console.log('Got ' + results.length + ' tracks of ' + tracks.body.total);
    }

    return results;
}