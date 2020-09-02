import React from "react";
import { getData } from "../data";
import { Table } from "react-bootstrap";
import Card from "./Shared/Card";

const MemberInfo = (props) => {
	return (
		<Card cardKey="1" title="Member Info">
			<Table striped border hover>
				<thead>
					<tr>
						<th>Name</th>
						<th>GP</th>
						<th>Toon Count</th>
						<th>Ship Count</th>
					</tr>
				</thead>
				<tbody>
					{getData().roster.map((row) => (
						<tr>
							<td>{row.name}</td>
							<td>{row.gp}</td>
							<td>{row.toons.length}</td>
							<td>{row.ships.length}</td>
						</tr>
					))}
				</tbody>
			</Table>
		</Card>
	);
};

export default MemberInfo;
