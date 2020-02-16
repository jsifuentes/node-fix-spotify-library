const fs = require('fs');

var cache = {};

function readCache () {
    let cache;

    try {
        cache = fs.readFileSync('./cache.json', { encoding: 'utf8' });
    } catch (e) {
        cache = {};
    }

    return cache;
}

function writeCache(key, value) {
    cache[key] = value;
    flushCache();
}

function flushCache() {
    fs.writeFile('./cache.json', JSON.stringify(cache, null, 2), 'utf8', () => {});
}

readCache();

module.exports = {
    get: (key) => cache[key],
    set: writeCache
};