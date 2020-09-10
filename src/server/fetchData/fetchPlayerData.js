const { getSquads } = require("./units");
const { cacheSet } = require("./cache");
const sort = require("./shared/sort");
//@param allycodes => Array of allycodes to obtain
//@param count | default zero => Number of rejections
//@param guild => The guildID to update
//@return Promise with guild object
//Fetches the player data for the guild and updates the cache with the guild info
module.exports = async (allycodes, guild, swapi, socket) => {
  return new Promise(async (resolve, reject) => {
    console.log("Get players");
    // Fetched players is set once the guild has been processed and placed in the cache
    // This will only be true if the guild has been processed and is contained in the cache
    if (guild.fetchedPlayers) {
      socket.emit("update", {
        message: "Found cached player data",
        progress: 100,
      });
      resolve(guild);
      return;
    }
    let toFetch = [...allycodes];
    let spookySquads = [];
    while (toFetch.length > 0) {
      socket.emit("update", {
        message: `Getting player data: ${allycodes.length - toFetch.length} / ${
          allycodes.length
        }`,
        progress: `${
          ((allycodes.length - toFetch.length) / allycodes.length) * 70 + 30
        }`,
      });
      const payload = {
        allycodes: toFetch,
        collection: "unitsList",
      };
      let { result, error, warning } = await swapi.fetchPlayer(payload);
      if (error) {
        console.log("Player error", error);
      } else if (warning) {
        console.log(warning);
      } else {
        let found = processPlayers(result, guild.id, spookySquads);
        found.forEach((item) => toFetch.splice(toFetch.indexOf(item), 1));
      }
    }
    socket.emit("update", {
      message: `Getting player data: ${allycodes.length - toFetch.length} / ${
        allycodes.length
      }`,
      progress: 100,
    });
    guild.squads = spookySquads.map((squad) =>
      sort(squad.squads, (a, b) => a.squad.squadGp >= b.squad.squadGp)
    );
    // Lexical sorting of squads
    guild.squads = sort(guild.squads, (a, b) => {
      let counter = 0;
      a = a[0].squad.title;
      b = b[0].squad.title;
      while(a.charCodeAt(counter) === b.charCodeAt(counter)){
        counter++;
      }
      return a.charCodeAt(counter) < b.charCodeAt(counter);
    })
    guild.fetchedPlayers = true;
    cacheSet(guild.id, guild);
    resolve(guild);
  });
};

const processPlayers = (result, guildId, spookySquads) => {
  let found = [];
  result.forEach((player) => {
    found.push(player.allyCode);
    // Add the player to the player cache
    cacheSet(player.allyCode, guildId);
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
  return found;
};
