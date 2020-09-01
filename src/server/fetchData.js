const ApiSwgohHelp = require('api-swgoh-help');
require('dotenv').config();
const fs = require('fs');
//Create the cache and set the time to live to 6 hours
const NodeCache = require( "node-cache" );
const sortToons = require('./fetchData/sortToons');
const sortPlayers = require('./fetchData/sortPlayers');
const { getSquads } = require('./fetchData/units');
const MAX_REJECTIONS = 5;

const guildCache = new NodeCache({stdTTL: 21600});
const playerCache = new NodeCache({stdTTL: 21600});

let swapi = undefined;
// API Login
const login = () => {
    swapi = new ApiSwgohHelp({
        "username":process.env.API_UNAME,
        "password":process.env.API_PASSWORD
    });
    return new Promise(async (resolve, reject) => {
        swapi.connect()
        .then(res => resolve(res))
        .catch(err => reject(err));

    })
}

//@param allycodes => Array of ally codes to fetch the guild data for
//@param count | default zero => Number of rejections
//@return Promise with array of guild id's

const fetchGuildData = async (codes, count = 0) => {
    return new Promise(async (resolve, reject) => {
        let resultArr = [];

        let searchCodes = [];
        // See if the cache contains any of the allycodes and remove it from the search array
        // Only look on first pass
        if(count === 0){
            codes.forEach((code) => {
                if(playerCache.has(code)){
                    resultArr.push(playerCache.get(code))
                }
                else{
                    searchCodes.push(code)
                }
            });
        }
        // If all of the codes have been found in the cache, return as no new data is needed
        if(searchCodes.length === 0){
            resolve(resultArr);
            return;
        }
        if(count === MAX_REJECTIONS) reject(new Error("Maximum number of retrys exceeded"))
        const payload = {
            allycodes: searchCodes,
            collection: "guildExchangeItemList"
        }
        let  { result, error, warning }  = await swapi.fetchGuild( payload );
    
        //Result is an array of guild data
        //Example object returned see guild_sample_result.json
        if(error) {
            console.log("Guild error");
            reject(error);
        }
        else if(warning) {
            console.warn("Warning:", warning, "Done");
            // Check both results are there
            if(result[0] && result[1]){
                fetchGuildData(searchCodes, count + 1)
                .then((res) => resolve(res))
                .catch((err) => reject(err));
            }
            else{
                if(!result[0]) reject(`Guild ${codes[0]} not found`)
                if(!result[1]) reject(`Guild ${codes[1]} not found`)
            }
        }
        else{
            result.forEach(res => {
                //Add the guild id to the result array
                resultArr.push(res.id);
                //Add the guild to the cache
                guildCache.set(res.id, res)
            })
            resolve(resultArr);
        }
    })
}

//@param allycodes => Array of allycodes to obtain
//@param count | default zero => Number of rejections
//@param guild => The guildID to update
//@return Promise with guild object
//Fetches the player data for the guild and updates the cache with the guild info
const fetchPlayerData = async (allycodes, count = 0, guild) => {
    return new Promise(async (resolve, reject) => {

        // Fetched players is set once the guild has been processed and placed in the cache
        // This will only be true if the guild has been processed and is contained in the cache
        if(guild.fetchedPlayers){
            resolve(guild);
            return;
        }
        if(count === MAX_REJECTIONS) reject(new Error("Maximum number of retrys exceeded"))
        const payload = {
            allycodes: allycodes,
            collection: "unitsList"
        };
        let { result, error, warning } = await swapi.fetchPlayer( payload )
        if(error) {
            console.log("Player error", error);
        }
        if(warning) {
            console.warn(warning);
            fetchPlayerData(allycodes, count + 1)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        }
        else{
            let playerArr = [];
            let spookySquads = [];
            result.forEach(player => {

                // Add the player to the player cache
                playerCache.set(player.allyCode, guild.id)

                let toonArr = [];
                let shipArr = [];
                player.roster.forEach(character => {
                    //Actual relic level is currentTier - 2
                    let charObj = {
                        name: character.defId,
                        star: character.rarity,
                        level: character.level,
                        power: character.gp,
                        relic: character.relic
                    }
                    if(character.combatType === 1){
                        toonArr.push(charObj);
                    } else {
                        shipArr.push(charObj);
                    }
                })

                let trackedSquads = getSquads(player.roster, player.name);
                // If the player has a tracked squad, add it to the array
                if(trackedSquads.squads.length > 0){
                    spookySquads.push(trackedSquads)
                }
                // Sort the characters by power
                sortToons(toonArr);
                // Sort the ships by power
                sortToons(shipArr);

                // Find the stat for gp
                let gp = player.stats.filter(stat => stat.nameKey === "STAT_GALACTIC_POWER_ACQUIRED_NAME");
                gp = gp[0].value;
                playerArr.push({name: player.name, gp: gp, level: player.level, toons: toonArr, ships: shipArr})
                // Sort the player array to get the highest gp first
                sortPlayers(playerArr)
            });
            guild.fetchedPlayers = true;
            guild.roster = playerArr;
            guild.squads = spookySquads;
            guildCache.set(guild.id, guild);
            resolve(guild);
        }
    })
}

const createPlayerArray = (guildCode) => {
    // Get the guild from the cache
    let guild = guildCache.get(guildCode);
    let arr = [];
    guild.roster.forEach(player => {
        arr.push(player.allyCode);
    });
    return {
        guild: guild,
        playerArr: arr
    }
}
const processGuild = (guildArr) => {
    return new Promise((resolve, reject) => {
        let guildOne = createPlayerArray(guildArr[0]);
        let guildTwo = createPlayerArray(guildArr[1]);
    
        let fetchOne = fetchPlayerData(guildOne.playerArr, 0, guildOne.guild)
        let fetchTwo = fetchPlayerData(guildTwo.playerArr, 0, guildTwo.guild)
    
        Promise.all([fetchOne, fetchTwo]).then(res => {
            resolve(res);
        })
        .catch((err => console.log("err")))
    });
}

const fetchGuildPlayerData = (allycodes) => {
    return new Promise((resolve, reject) => {
        fetchGuildData(allycodes)
        .then(res => processGuild(res)
                    .then(respose => resolve(respose))
                    .catch(err => reject(err))
        )
        .catch(err => reject(err))
    })
}

module.exports = {
    fetchGuildPlayerData: fetchGuildPlayerData,
    login: login,
    cache: guildCache
}