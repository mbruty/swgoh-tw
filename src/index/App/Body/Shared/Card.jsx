import React from "react";
import { Card, Accordion } from "react-bootstrap";

const GuildInfo = (props) => {
	return (
		<Card>
			<Card.Header>
				<Accordion.Toggle as={Card.Header} eventKey={props.cardKey}>
					{props.title}
				</Accordion.Toggle>
				<Accordion.Collapse eventKey={props.cardKey}>
					<Card.Body>{props.children}</Card.Body>
				</Accordion.Collapse>
			</Card.Header>
		</Card>
	);
};

export default GuildInfo;
