const fs = require('fs');

let squadData = JSON.parse(fs.readFileSync('./server/fetchData/units/squads.json'));

const getSquads = (unitsList, name) => {
    const unitsMap = new Map();
    const squads = [];
    // Convert the unit list to a map so that lookups will be O(1)
    unitsList.forEach((unit) => {
        unitsMap.set(unit.defId, unit);
    });
    squadData.forEach(squad => {
        const unitArr = [];
        // Keep track of the squad gp
        let squadGp = 0;
        squad.units.forEach((unit) => {
            // Will return undefined if they don't have the unit
            let playerUnit = unitsMap.get(unit);
            // Undefined is fasly
            if(playerUnit){
                // Select the zeta's on the unit
                let zetas = playerUnit.skills.filter((skill) => skill.isZeta);
                squadGp += playerUnit.gp;
                // Get the stats we want to track from the unit
                unitArr.push({
                    defId: playerUnit.defId,
                    rarity: playerUnit.rarity,
                    level: playerUnit.level,
                    gear: playerUnit.gear,
                    gp: playerUnit.gp,
                    relic: playerUnit.relic,
                    zetas: zetas
                });
            }
        })
        if(unitArr.length >= 5){
            squads.push({title: squad.title, sqaudGp: squadGp, units: unitArr});
        }
    })
    return {name, squads}
}

module.exports = {
    getSquads: getSquads,
}