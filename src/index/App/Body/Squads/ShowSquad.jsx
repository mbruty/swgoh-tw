import React from "react";
import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

const styles = makeStyles((theme) => ({
	toolTip: {
		whiteSpace: "pre-line",
	},
}));

let classes;

const showSquad = (props) => {
	let left = props.data.units.length > 6 ? 'left' : '';
	left = props.data.units.length === 6 ? 'tadLeft' : left;
	if (props.data !== {}) {
		return (
				<div class="row">
					{props.data.units.map((unit) => (
						<div id="toon" className="col-xs-6 col-sm-3 col-md-3 col-lg-2">
							<img
								class="char"
								alt={`${unit.defId}`}
								src={`https://swgoh.gg/game-asset/u/${unit.defId}/`}
								height="80"
								width="80"
							/>
							<div
								className={` ${
									unit.relic.currentTier > 1
										? "char-portrait-relic"
										: `char-portrait-no-relic g${unit.gear}`
								} ${unit.side} ${left}`}
							/>
							<div
								className={`star star1 ${unit.rarity >= 1 ? '' : "inactive"} ${left}`}
							/>
							<div
								className={`star star2 ${unit.rarity >= 2 ? '' : "inactive"} ${left}`}
							/>
							<div
								className={`star star3 ${unit.rarity >= 3 ? '' : "inactive"}${left}`}
							/>
							<div
								className={`star star4 ${unit.rarity >= 4 ? '' : "inactive"} ${left}`}
							/>
							<div
								className={`star star5 ${unit.rarity >= 5 ? '' : "inactive"} ${left}`}
							/>
							<div
								className={`star star6 ${unit.rarity >= 6 ? '' : "inactive"} ${left}`}
							/>
							<div
								className={`star star7 ${unit.rarity >= 7 ? '' : "inactive"} ${left}`}
							/>
							{unit.zetas.count > 0 ? <Zeta zetas={unit.zetas} left={props.data.units.length > 6}/> : null}
							{unit.relic.currentTier > 1 ? (
								<div className={`relic ${unit.side} ${left}`}>
									{unit.relic.currentTier - 2}
								</div>
							) : null}
							<div className={`level ${left}`}>{unit.level}</div>
						</div>
					))}
				</div>
		);
	} else return null;
};

const Zeta = (props) => {
	// As this is a constant throughout all components of this type, it's only called once
	// to improve performance
	if(!classes) classes = styles();
	return (
		<Tooltip
			classes={{ tooltip: classes.toolTip }}
			title={props.zetas.names}
			placement="bottom"
			arrow
			interactive
		>
			<div className={`zeta ${props.left ? 'left' : ''}`}>{props.zetas.count}</div>
		</Tooltip>
	);
};

export default showSquad;
