//Create the cache and set the time to live to 6 hours
const NodeCache = require("node-cache");
const guildCache = new NodeCache({ stdTTL: 21600 });
const playerCache = new NodeCache({ stdTTL: 21600 });

// Using this as a proxy so that the cahce object isn't passed around
// wasting memory

// Implicit returns
const playerCacheHas = (query) => playerCache.has(query);

const playerCacheGet = (query) => playerCache.get(query);

const guildCacheGet = (query) => guildCache.get(query);
// Doesn't need to return anything
const playerCacheSet = (key, value) => {
	playerCache.set(key, value);
};

const guildCacheSet = (key, value) => {
  guildCache.set(key, value);
}

module.exports = {
  playerCacheHas,
  playerCacheGet,
  playerCacheSet,
  guildCacheGet,
  guildCacheSet
}