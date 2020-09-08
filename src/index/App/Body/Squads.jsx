import React from "react";
import { getSquads } from "../data";
import Card from "./Shared/Card";
import MuiVirtualizedTable from "./Squads/MuiVirtualizedTable";

const checkSquad = (squad, search) => {
	// Check each unit
	return squad.squad.units
		.map((unit) => {
			let found = Array(3);
			if (search[1] === 0) found[0] = true;
			else if (unit.relic.currentTier - 2 >= search[1]) found[0] = true;
			else found[0] = false;
			if (unit.gear >= search[2]) found[1] = true;
			else found[1] = false;
			if (unit.rarity >= search[3]) found[2] = true;
      else found[2] = false;
      // Every element in the found array is true
			if (found.every(item => item)) {
				return unit;
			}
			return null;
		})
		.filter((val) => val !== null);
};

const Suqads = (props) => {
	let data = getSquads();
	if (props.search) {
		// Element is a tracked-squad
		data = data
			.map((element) => {
				// Check each squad
				return element
					.map((squad) => {
						// If we are matching a name
						if (props.search[0] !== "") {
							// If the owner's name isn't the same, we return nothing
							if (squad.owner !== props.search[0]) return null;
						}
						// Get all the toons that match the search
						let filteredSquad = checkSquad(squad, props.search);
						// If we have atleast one squad found
						if (filteredSquad.length > 0) {
							// If we're not matching the whole squad
							if (props.search[4] === "No") return squad;
							// We are matching atleast 5
							else if (filteredSquad.length >= 5) {
                console.log({...squad, units: filteredSquad});
                return { ...squad, squad: { ...squad.squad, units: filteredSquad }};
							}
						}
						return null;
					})
					.filter((val) => val !== null);
			})
			.filter((val) => val !== null)
			.filter((val) => val.length > 0);
		console.log({ data });
	}
	return (
		<>
			{data.map((element, idx) => (
				<>
					<Card
						title={element[0].squad.title}
						secondary={`Squad Count: ${element.length}`}
					>
						<MuiVirtualizedTable data={element} />
					</Card>
				</>
			))}
		</>
	);
};

export default Suqads;
