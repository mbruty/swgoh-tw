import React from "react";
import { getSquads } from "../data";
import { Table, Accordion } from "react-bootstrap";
import Card from "./Shared/Card";
import ShowSquad from './Squads/ShowSquad';

const Suqads = () => {
	const data = getSquads();

	return (
		<Card cardKey="2" title="Squads">
			<Accordion>
			{data.map((element, idx) => (
				<Card cardKey={idx + 1} title={element[0].squad.title}>
					<Table striped border>
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
					</Card>
			))}
			</Accordion>
		</Card>
	);
};

export default Suqads;
