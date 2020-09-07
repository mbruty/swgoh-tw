const { cacheHas, cacheGet, cacheSet } = require("./cache");

//@param allycodes => Array of ally codes to fetch the guild data for
//@param count | default zero => Number of rejections
//@return Promise with array of guild id's

module.exports =  async (codes, swapi, socket) => {
  socket.emit('update', {message: 'Fetching guild data...', progress: 5});
	return new Promise(async (resolve, reject) => {
		let retry = true;
		let retryCount = 0;

		let resultArr = [];
		let searchCodes = [];
		// See if the cache contains any of the allycodes and remove it from the search array
		codes.forEach((code) => {
			if (cacheHas(code)) {
				resultArr.push(cacheGet(code));
			} else {
				searchCodes.push(code);
			}
		});
		// If all of the codes have been found in the cache, return as no new data is needed
		if (searchCodes.length === 0) {
      socket.emit('update', {message: 'Found cached data', progress: 25})
			resolve(resultArr);
			return;
		}
    socket.emit('update', {message: 'No cached data found, fetching fresh guild data...', progress: 10});
		while (retry) {
			retry = false;

			if (retryCount === 5) {
				reject(new Error("Maximum number of retry attempts exceeded"));
			}

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
			var { result, error, warning } = await swapi.fetchGuild(payload);

			//Result is an array of guild data
			//Example object returned see guild_sample_result.json
			if (error) {
				console.log("Guild error");
				reject(error);
			} else if (warning) {
				console.warn("Warning:", warning, "Done");
				// Check if no results are undefined
				if (!result.some((res) => res === undefined)) {
					retry = true;
					retryCount++;
				} else {
					reject("Guild not found");
				}
			}
		}

		result.forEach((res) => {
			//Add the guild id to the result array
			resultArr.push(res.id);
			//Add the guild to the cache
			cacheSet(res.id, res);
    });
		resolve(resultArr);
	});
};
