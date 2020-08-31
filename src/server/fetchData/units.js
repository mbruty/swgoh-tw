const fs = require('fs');

let squadData = JSON.parse(fs.readFileSync('./server/fetchData/units/squads.json'));

const getSquads = (unitsList) => {
    const unitsMap = new Map();
    const squads = [];
    // Convert the unit list to a map so that lookups will be O(1)
    unitsList.forEach((unit) => {
        unitsMap.set(unit.defId, unit);
    });
    squadData.forEach(squad => {
        const unitArr = [];
        squad.units.forEach((unit) => {
            // Will return undefined if they don't have the unit
            let playerUnit = unitsMap.get(unit);
            // Undefined is fasly
            if(playerUnit){
                unitArr.push(playerUnit);
            }
        })
        if(unitArr.length >= 5){
            squads.push({title: squad.title, units: unitArr});
        }
    })
    return squads
}

module.exports = {
    getSquads: getSquads,
}