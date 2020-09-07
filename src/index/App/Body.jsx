import React, { useState } from "react";
import { registerCallBack } from "./data";
import { Spinner } from "react-bootstrap";
import MemberInfo from "./Body/MemberInfo";
import Squads from "./Body/Squads";
import Paper from "@material-ui/core/Paper";

const Body = (props) => {
	const [data, setData] = useState();
	registerCallBack((data) => {
		setData(data);
	});
	// Display the data if we have it
	if (data) {
		return (
			<div class="body">
				<Paper elevation={3} className="Paper">
					<h1>Guild Data: {data.name}</h1>
					<h3>Description: {data.desc}</h3>
					<ul>
						<li>Guild gp: {data.gp}</li>
						<li>Members: {data.members}</li>
					</ul>
					<Squads />
				</Paper>
			</div>
		);
	}
	// Display a spinner if not
	else
		return (
			<div class="body">
				<div className="loading">
					<Spinner animation="border" size="m" />
					<h1>Loading data...</h1>
				</div>
			</div>
		);
};

export default Body;
