import React from "react";
import { getData } from "../data";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "./Shared/Card";

const MemberInfo = (props) => {
	return (
		<Card cardKey="1" title="Member Info">
			<TableContainer component={Paper}>
				<Table aria-label="Member table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>GP</TableCell>
							<TableCell>Toon Count</TableCell>
							<TableCell>Ship Count</TableCell>
						</TableRow>
					</TableHead>
					<tbody>
						{getData().roster.map((row) => (
							<TableRow>
								<TableCell>{row.name}</TableCell>
								<TableCell>{row.gp}</TableCell>
								<TableCell>{row.toons.length}</TableCell>
								<TableCell>{row.ships.length}</TableCell>
							</TableRow>
						))}
					</tbody>
				</Table>
			</TableContainer>
		</Card>
	);
};

export default MemberInfo;
