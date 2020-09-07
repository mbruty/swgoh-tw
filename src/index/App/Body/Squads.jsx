import React from "react";
import { getSquads } from "../data";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "./Shared/Card";
import ShowSquad from "./Squads/ShowSquad";
import MuiVirtualizedTable from "./Squads/MuiVirtualizedTable";

const Suqads = () => {
	const data = getSquads();

	return (
			<>
				{data.map((element, idx) => (
					<Card title={element[0].squad.title} secondary={`Squad Count: ${element.length}`} >
						<MuiVirtualizedTable data={element} />
					</Card>
				))}
			</>
	);
};

export default Suqads;
