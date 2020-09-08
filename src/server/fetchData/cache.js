const redis = require("redis");
const client = redis.createClient({
	password: process.env.REDIS_PWD,
	host: process.env.REDIS_HOST,
});
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);
const EXPIRE_TIME = 43200;
client.on("error", function (error) {
	console.error(error);
});

client.on("connect", function () {
	console.log("Redis client connected");
});

const cacheGet = async (query) => {
	let result = await getAsync(query);
	if (result) result = JSON.parse(result);
	return result;
};

// Doesn't need to return anything
const cacheSet = (key, value) => {
	client.set(key, JSON.stringify(value));
	// Se the key to expire after EXPIRE_TIME seconds
	client.expire(key, EXPIRE_TIME);
};

module.exports = {
	cacheGet,
	cacheSet,
};
