import React, { useState } from "react";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu, MenuItem, Avatar } from "@material-ui/core";
import MuiChip from "@material-ui/core/Chip";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const ITEM_HEIGHT = 48;

export default (props) => {
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleClickMenu = (event, idx) => {
    let newArr = [...props.values];
    newArr[props.index] = props.options[idx];
    props.setValues(newArr);
		setSelectedIndex(idx);
	};

	return (
		<PopupState variant="popover" popupId="demo-popup-menu">
			{(popupState) => (
				<React.Fragment>
					<MuiChip
						label={`${props.name}: ${props.options[selectedIndex]} `}
						clickable
						color="primary"
						{...bindTrigger(popupState)}
						avatar={
							<Avatar>
								<ExpandMoreIcon />
							</Avatar>
						}
						style={{ margin: "5px" }}
					/>
					<ChipMenu
						popupState={popupState}
						selectedIndex={selectedIndex}
						options={props.options}
						handleClickMenu={handleClickMenu}
					/>
				</React.Fragment>
			)}
		</PopupState>
	);
};

const ChipMenu = (props) => {
	return (
		<Menu
			PaperProps={{
				style: {
					maxHeight: ITEM_HEIGHT * 4.5,
				},
			}}
			{...bindMenu(props.popupState)}
		>
			{props.options.map((option, index) => (
				<MenuItem
					key={option}
					selected={index === props.selectedIndex}
					onClick={(e) => props.handleClickMenu(e, index)}
				>
					{option}
				</MenuItem>
			))}
		</Menu>
	);
};
