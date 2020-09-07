const redis = require("redis");
const client = redis.createClient({password: process.env.REDIS_PWD});
 
client.on("error", function(error) {
  console.error(error);
});

client.on('connect', function() {
  console.log('Redis client connected');
});

const cacheHas = (query) => client.get(query, (res) => res ? true : false)

const cacheGet = (query) => client.get(query, res => res);


// Doesn't need to return anything
const cacheSet = (key, value) => {
	client.set(key, value);
};


module.exports = {
  cacheHas,
  cacheGet,
  cacheSet,
}