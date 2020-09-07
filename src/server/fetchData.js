const ApiSwgohHelp = require("api-swgoh-help");
require("dotenv").config();
const fs = require("fs");
//Create the cache and set the time to live to 6 hours
const NodeCache = require("node-cache");
const sortGuildSquads = require("./fetchData/sortGuildSquads");
const sortToons = require("./fetchData/sortToons");
const sortPlayers = require("./fetchData/sortPlayers");
const sortSquads = require("./fetchData/sortSquads");
const { getSquads } = require("./fetchData/units");
const MAX_REJECTIONS = 5;

const guildCache = new NodeCache({ stdTTL: 21600 });
const playerCache = new NodeCache({ stdTTL: 21600 });

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

//@param allycodes => Array of ally codes to fetch the guild data for
//@param count | default zero => Number of rejections
//@return Promise with array of guild id's

const fetchGuildData = async (codes, count = 0) => {
	console.log("Fetch guild");
	return new Promise(async (resolve, reject) => {
		let resultArr = [];

		let searchCodes = [];
		// See if the cache contains any of the allycodes and remove it from the search array
		// Only look on first pass
		if (count === 0) {
			codes.forEach((code) => {
				if (playerCache.has(code)) {
					resultArr.push(playerCache.get(code));
				} else {
					searchCodes.push(code);
				}
			});
		}
		// If all of the codes have been found in the cache, return as no new data is needed
		if (searchCodes.length === 0) {
			console.log("Cache hit");
			resolve(resultArr);
			return;
		}
		console.log("Cahce miss");
		if (count === MAX_REJECTIONS)
			reject(new Error("Maximum number of retrys exceeded"));
		const payload = {
			allycodes: searchCodes,
			collection: "guildExchangeItemList",
			project: {
				id: true,
				name: true,
				desc: true,
				members: true,
				gp: true,
				roster: {
					allyCode: true,
				},
			},
		};
		let { result, error, warning } = await swapi.fetchGuild(payload);

		//Result is an array of guild data
		//Example object returned see guild_sample_result.json
		if (error) {
			console.log("Guild error");
			reject(error);
		} else if (warning) {
			console.warn("Warning:", warning, "Done");
			// Check if no results are undefined
			if (!result.some((res) => res === undefined)) {
				let retry = fetchGuildData(searchCodes, count + 1).catch((err) =>
					console.log("Reject")
				);
				Promise.all([retry]).then((res) => {
					console.log(retry);
					resolve(res);
				});
			} else {
				reject("Guild not found");
			}
		} else {
			result.forEach((res) => {
				//Add the guild id to the result array
				resultArr.push(res.id);
				//Add the guild to the cache
				guildCache.set(res.id, res);
			});
			resolve(resultArr);
		}
	});
};

//@param allycodes => Array of allycodes to obtain
//@param count | default zero => Number of rejections
//@param guild => The guildID to update
//@return Promise with guild object
//Fetches the player data for the guild and updates the cache with the guild info
const fetchPlayerData = async (allycodes, guild) => {
	return new Promise(async (resolve, reject) => {
		// Fetched players is set once the guild has been processed and placed in the cache
		// This will only be true if the guild has been processed and is contained in the cache
		if (guild.fetchedPlayers) {
			resolve(guild);
			return;
		}
		let toFetch = [...allycodes];
		let spookySquads = [];
		while (toFetch.length > 0) {
			console.log("Loop");
			const payload = {
				allycodes: toFetch,
				collection: "unitsList"
			};
			let { result, error, warning } = await swapi.fetchPlayer(payload);
			if (error) {
				console.log("Player error", error);
			} else if (warning) {
				console.warn(warning);
				fetchPlayerData(allycodes, guild)
					.then((res) => resolve(res))
					.catch((err) => reject(err));
			} else {

				let found = [];
				result.forEach((player) => {
					found.push(player.allyCode)
					// Add the player to the player cache
					playerCache.set(player.allyCode, guild.id);

					let toonArr = [];
					let shipArr = [];
					player.roster.forEach((character) => {
						//Actual relic level is currentTier - 2
						let charObj = {
							name: character.defId,
							star: character.rarity,
							level: character.level,
							power: character.gp,
							relic: character.relic,
						};
						if (character.combatType === 1) {
							toonArr.push(charObj);
						} else {
							shipArr.push(charObj);
						}
					});

					let trackedSquads = getSquads(player.roster, player.name);
					// If the player has a tracked squad, add it to the array
					if (trackedSquads.squads.length > 0) {
						trackedSquads.squads.forEach((squad) => {
							// If squads doesn't have the squad in it, add it to an empty object
							if (!spookySquads.find((item) => item.title === squad.title)) {
								spookySquads.push({ title: squad.title, squads: [] });
							}
							spookySquads
								.find((item) => item.title === squad.title)
								.squads.push({
									owner: player.name,
									squad: squad,
									squadGp: squad.squadGp,
								});
						});
					}
				});

				found.forEach((item) => toFetch.splice(toFetch.indexOf(item), 1));
			}
		}
		guild.squads = spookySquads.map((squad) => sortSquads(squad.squads));
		// Lexical sorting of squads
		guild.squads = sortGuildSquads(guild.squads);
		guildCache.set(guild.id, guild);
		resolve(guild);
	});
};

const createPlayerArray = (guildCode) => {
	// Get the guild from the cache
	let guild = guildCache.get(guildCode);
	let arr = [];
	guild.roster.forEach((player) => {
		arr.push(player.allyCode);
	});

	return {
		guild: guild,
		playerArr: arr,
	};
};
const processGuild = (guildArr) => {
	return new Promise((resolve, reject) => {
		let promiseArr = guildArr.map((element) => {
			let players = createPlayerArray(element);
			return fetchPlayerData(players.playerArr, players.guild);
		});

		Promise.all(promiseArr)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => console.log(err));
	});
};

const fetchGuildPlayerData = (allycodes) => {
	return new Promise((resolve, reject) => {
		fetchGuildData(allycodes)
			.then((res) =>
				processGuild(res)
					.then((respose) => resolve(respose))
					.catch((err) => reject(err))
			)
			.catch((err) => reject(err));
	});
};

module.exports = {
	fetchGuildPlayerData: fetchGuildPlayerData,
	login: login,
	cache: guildCache,
};
