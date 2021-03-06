const fs = require("fs");
const sort = require("./shared/sort");
const statCalculator = require('swgoh-stat-calc');
const fetch = require("node-fetch");
// Setup stat calc
fetch('https://swgoh-stat-calc.glitch.me/gameData.json')
  .then(res => res.json())
  .then(gameData => statCalculator.setGameData( gameData ))
let squadData = JSON.parse(
  fs.readFileSync("./server/fetchData/units/squads.json")
);

// Loading this on boot so that lookups are O(1);
let sideMap = new Map();
let sideData = JSON.parse(
  fs.readFileSync("./server/fetchData/units/units.json")
);
sideData.units.forEach((item) => {
  sideMap.set(item.name, { side: item.side });
});

const getSide = (name) => {
  let side = sideMap.get(name);
  if (side) return side.side;
  return null;
};

let zetaMap = new Map();
let zetaData = JSON.parse(
  fs.readFileSync("./server/fetchData/units/zetas.json")
);

zetaData.zetas.forEach((zeta) => {
  zetaMap.set(zeta.id, { name: zeta.name });
});

const getZeta = (zeta) => {
  let zetaName = zetaMap.get(zeta);
  if (zetaName) return zetaName.name;
  return null;
};
const getSquads = (unitsList, name) => {
  const unitsMap = new Map();
  const squads = [];
  // Convert the unit list to a map so that lookups will be O(1)
  unitsList.forEach((unit) => {
    unitsMap.set(unit.defId, unit);
  });
  squadData.forEach((squad) => {
    let unitArr = [];
    // Keep track of the squad gp
    let squadGp = 0;
    squad.units.forEach((unit) => {
      // Will return undefined if they don't have the unit
      let playerUnit = unitsMap.get(unit);
      // Undefined is fasly
      if (playerUnit) {
        // Select the zeta's on the unit
        let zetas = "";
        let count = 0;
        playerUnit.skills.forEach((skill) => {
          if (skill.tier === skill.tiers && skill.isZeta) {
            count++;
            zetas += getZeta(skill.id) + `\n`;
          }
        });
        const gp = statCalculator.calcCharGP(playerUnit);
        squadGp += gp;
        // Get the stats we want to track from the unit
        unitArr.push({
          defId: playerUnit.defId,
          rarity: playerUnit.rarity,
          level: playerUnit.level,
          gear: playerUnit.gear,
          gp: gp,
          relic: playerUnit.relic,
          zetas: { count, names: zetas },
          side: getSide(playerUnit.defId),
          stats: statCalculator.calcCharStats(playerUnit, {gameStyle: true})
        });
      }
    });
    if (unitArr.length >= 5) {
      unitArr = sort(unitArr, (a, b) => a.gp >= b.gp)
      // Get the top 5 gp chars
      unitArr = unitArr.slice(0, 5)
      // Calc squad gp
      const squadGp = unitArr.reduce((prev, curr) => prev + curr.gp, 0);
      // If the squad has a required field
      if (squad.required) {
        let containsRequired = squad.required.some((char) => {
          // If the unit array doesn't inlcude a required character
          return unitArr.some((c) => c.defId === char);
        });
        if (containsRequired)
          squads.push({ title: squad.title, squadGp: squadGp, units: unitArr });
      } else
        squads.push({ title: squad.title, squadGp: squadGp, units: unitArr });
    }
  });
  return { name, squads };
};

module.exports = {
  getSquads: getSquads,
};
