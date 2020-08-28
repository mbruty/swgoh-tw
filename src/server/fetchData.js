const ApiSwgohHelp = require('api-swgoh-help');
require('dotenv').config();
const fs = require('fs');
const Cache = require('./cache.js');
const codes = [647793576];
const sortToons = require('./fetchData/sortToons');
const MAX_REJECTIONS = 5;

const dataCache = new Cache();

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
//@return array of guild id's

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
                dataCache.addGuild(res)
            })
            resolve(resultArr);
        }
    })
}

//@param allycodes => Array of allycodes to obtain
//@param count | default zero => Number of rejections
//@return void Promise
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
            dataCache.addGuild(guild);
            dataCache.showCache();
        }
    })
}

const processGuild = (guildArr) => {
    guildArr.forEach(guild => {
        //Retrieve the guild from the cache
        let cachedGuild = dataCache.getGuild(guild);
        let playerArray = [];
        //Create the array of allycodes within the guild
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