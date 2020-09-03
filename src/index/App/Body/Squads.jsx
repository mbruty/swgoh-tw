import React from "react";
import { getSquads } from "../data";
import { Table } from "react-bootstrap";
import Card from "./Shared/Card";
import ShowSquad from './Squads/ShowSquad';

const Suqads = () => {
	const data = getSquads();

	return (
		<Card cardKey="2" title="Squads">
			{data.map(element => (
						<>
						<h3>{element[0].squad.title}</h3>
					<Table striped border hover>
							<thead>
								<tr>
									<th>Name</th>
									<th>Power</th>
								</tr>
							</thead>
							<tbody>
							{element.map((item) => (
							<>
							<tr>
								<td>{item.owner} </td>
								<td>{item.squad.squadGp}</td>
							</tr>
								<ShowSquad data={item} />
							</>
						))}
							</tbody>
						</Table>
					</>
			))}
		</Card>
	);
};

export default Suqads;
