import React from "react";
import { getMemberData } from "../data";
import { Table } from "react-bootstrap";
import Card from "./Shared/Card";

const MemberInfo = (props) => {
	const data = getMemberData();
	return (
		<Card cardKey="0" title="Guild Info">
			<ul>
				<li>Guild gp: {data.gp}</li>
				<li>Members: {data.members}</li>
			</ul>
		</Card>
	);
};

export default MemberInfo;
