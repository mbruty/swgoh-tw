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

const Suqads = () => {
	const data = getSquads();

	return (
		<Card cardKey="2" title="Squads">
			<div>
				{data.map((element, idx) => (
					<Card
						cardKey={idx + 1}
						style={{ width: "100%" }}
						title={element[0].squad.title}
						secondary={`Squad count: ${element.length}`}
					>
						<TableContainer component={Paper}>
							<Table aria-label="Squad table">
								<TableHead>
									<TableRow>
										<TableCell>Name</TableCell>
										<TableCell align="right">Power</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{element.map(item => (
										<>
											<TableRow>
												<TableCell>
													{item.owner}
												</TableCell>
												<TableCell allign="right">
													{item.squad.squadGp}
												</TableCell>
											</TableRow>
											<ShowSquad data={item} />
										</>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</Card>
				))}
			</div>
		</Card>
	);
};

export default Suqads;
