import React from "react";

const showSquad = (props) => {
	if (props.data !== {}) {
		console.log(props.data.squad.units.length);
		return (
			<tr
				class="squad"
				style={{
					height: `${props.data.squad.units.length > 5 ? "200px" : "100px"}`,
				}}
			>
				<div class="row">
					{props.data.squad.units.map((unit) => (
						<div id="toon" className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
							<img
								class="char"
								alt={`${unit.defId}`}
								src={`https://swgoh.gg/game-asset/u/${unit.defId}/`}
								height="80"
								width="80"
							/>
							{console.log(unit)}
							<div
								className={` ${
									unit.relic.currentTier > 1
										? "char-portrait-relic"
										: `char-portrait-no-relic g${unit.gear}`
								} ${unit.side}`}
							/>
							<div
								className={`star star1 ${unit.rarity >= 1 ? null : "inactive"}`}
							/>
							<div
								className={`star star2 ${unit.rarity >= 2 ? null : "inactive"}`}
							/>
							<div
								className={`star star3 ${unit.rarity >= 3 ? null : "inactive"}`}
							/>
							<div
								className={`star star4 ${unit.rarity >= 4 ? null : "inactive"}`}
							/>
							<div
								className={`star star5 ${unit.rarity >= 5 ? null : "inactive"}`}
							/>
							<div
								className={`star star6 ${unit.rarity >= 6 ? null : "inactive"}`}
							/>
							<div
								className={`star star7 ${unit.rarity >= 7 ? null : "inactive"}`}
							/>
							{unit.zetas.length > 0 ? <div className="zeta" >{unit.zetas.length}</div> : null}
              {unit.relic.currentTier > 1 ? <div className="relic">{unit.relic.currentTier - 2}</div> : null}
              <div className="level">{unit.level}</div>
						</div>
					))}
				</div>
			</tr>
		);
	} else return null;
};

export default showSquad;