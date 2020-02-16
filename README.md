# Spotify fix library

This is a quick script I made to identify bad versions of songs in my Spotify library. What I mean by "bad version" is that whenever I ported over my Spotify library from Google Play Music using a third-party tool, the tool somehow added to my "Liked Songs" versions of songs that were not the version of the song you would get if you visited the "Artist" page. For example, I could have "Song A" by "Artist A" in my "Liked Songs" but whenever I visited "Artist A"'s Artist page, it would say I did not have the song liked. This script was made to identfiy songs that I have liked in my library that are not actually in the official album shown on the artist page.

# How to use

Copy `config.env.json.example` to `config.env.json` and replace the configuration values to your Spotify application configuration. Leave "access" an empty object.

Run `node index.js auth`, visit the link it gives you, and enter the code you receive in the URL parameter of your redirect URI as your response. You will receive a JSON string back of your access tokens. Copy this and replace the empty object in config.env.json with this JSON object.

Then run `node index.js` and wait.

Remove `cache.json`