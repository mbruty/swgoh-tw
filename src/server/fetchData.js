const ApiSwgohHelp = require('api-swgoh-help');
require('dotenv').config();
//Create the cache and set the time to live to 6 hours
const NodeCache = require( "node-cache" );
const codes = [647793576];
const sortToons = require('./fetchData/sortToons');
const MAX_REJECTIONS = 5;

const guildCache = new NodeCache({stdTTL: 21600});

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

const fetchGuildData = async (allycodes, count = 0) => {
    return new Promise(async (resolve, reject) => {
        if(count === MAX_REJECTIONS) reject(new Error("Maximum number of retrys exceeded"))
        const payload = {
            allycodes,
            collection: "guildExchangeItemList"
        }
        let  { result, error, warning }  = await swapi.fetchGuild( payload );
    
        //Result is an array of guild data
        //Example object returned see guild_sample_result.json
        if(error) {
            reject(error);
        }
        if(warning) {
            console.warn(warning);
            console.log(result);
            fetchGuildData(allycodes, count + 1)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        }
        else{
            let resultArr = [];
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
//@return Promise with guildID 
//Fetches the player data for the guild and updates the cache with the guild info
const fetchPlayerData = async (allycodes, count = 0, guild) => {
    return new Promise(async (resolve, reject) => {
        if(count === MAX_REJECTIONS) reject(new Error("Maximum number of retrys exceeded"))
        const payload = {
            allycodes,
            collection: "unitsList"
        };
        let { result, error, warning } = await swapi.fetchPlayer( payload )
        if(error) {
            console.error(error);
            reject(error);
        }
        if(warning) {
            console.warn(warning);
            console.log(result);
            fetchPlayerData(allycodes, count + 1)
            .then((res) => resolve(res))
            .catch((err) => reject(err))
        }
        else{
            let playerMap = new Map();
            result.forEach(player => {
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
                // Sort the characters by power
                sortToons(toonArr);
                // Sort the ships by power
                sortToons(shipArr);
                playerMap.set(player.allyCode, {name: player.name, level: player.level, toons: toonArr, ships: shipArr})
            });
            guild.fetchedPlayers = true;
            guild.roster = playerMap;
            guildCache.set(guild.id, guild);
            resolve(guild.id);
        }
    })
}

const processGuild = (guildArr) => {
    guildArr.forEach(guild => {
        //Retrieve the guild from the cache
        let cachedGuild = guildCache.get(guild);
        //Create the array of allycodes within the guild
        let playerArray = [];
        //Get each player from a guild's roster and add their allycode to the array
        cachedGuild.roster.forEach(player => {
            playerArray.push(player.allyCode);
        });
        //Gather all of the players details
        fetchPlayerData(playerArray, 0, cachedGuild)
        .then(res => {
            console.log(res)
        })

    })
}


const start = () => {
    login()
    //Fetch the data for the tracked guilds
    .then(() => fetchGuildData(codes)
        .then((res) => processGuild(res))
        .catch((err) => console.log(err))
    )
    .catch(err => console.error(err));
}


module.exports = start;