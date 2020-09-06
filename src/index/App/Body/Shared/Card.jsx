import React from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	heading: {
		fontSize: theme.typography.pxToRem(15),
		flexBasis: "33.33%",
		flexShrink: 0,
	},
	secondaryHeading: {
		fontSize: theme.typography.pxToRem(15),
		color: theme.palette.text.secondary,
	},
}));

const Card = (props) => {
	const [expanded, setExpanded] = React.useState(false);
	const classes = useStyles();

	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};
	return (
		<Accordion
			expanded={expanded === `pannel${props.cardKey}`}
			onChange={handleChange(`pannel${props.cardKey}`)}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
			>
				<Typography className={classes.heading}>{props.title}</Typography>
				{props.secondary ? <Typography className={classes.secondaryHeading}>{props.secondary}</Typography> : null}
			</AccordionSummary>
			<AccordionDetails>{props.children}</AccordionDetails>
		</Accordion>
	);
};

export default Card;
