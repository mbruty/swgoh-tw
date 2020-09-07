const ApiSwgohHelp = require("api-swgoh-help");
require("dotenv").config();
const { guildCacheGet } = require("./fetchData/cache");

const fetchPlayerData = require("./fetchData/fetchPlayerData");
const fetchGuildData = require("./fetchData/fetchGuildData");

let swapi = undefined;
// API Login
const login = () => {
	swapi = new ApiSwgohHelp({
		username: process.env.API_UNAME,
		password: process.env.API_PASSWORD,
	});
	return new Promise(async (resolve, reject) => {
		swapi
			.connect()
			.then((res) => resolve(res))
			.catch((err) => reject(err));
	});
};

const createPlayerArray = (guildCode) => {
	// Get the guild from the cache
	let guild = guildCacheGet(guildCode);
	let arr = [];
	guild.roster.forEach((player) => {
		arr.push(player.allyCode);
	});

	return {
		guild: guild,
		playerArr: arr,
	};
};

const processGuild = (guildArr, socket) => {
	return new Promise((resolve, reject) => {
		let promiseArr = guildArr.map((element) => {
			let players = createPlayerArray(element);
			return fetchPlayerData(players.playerArr, players.guild, swapi, socket);
		});

		Promise.all(promiseArr)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => console.log(err));
	});
};

const fetchGuildPlayerData = (allycodes, socket) => {
	return new Promise((resolve, reject) => {
		fetchGuildData(allycodes, swapi, socket)
			.then((res) =>
				processGuild(res, socket)
					.then((respose) => resolve(respose))
					.catch((err) => reject(err))
			)
			.catch((err) => reject(err));
	});
};

module.exports = {
	fetchGuildPlayerData: fetchGuildPlayerData,
	login: login,
};
