import React, { useState } from "react";
import { registerCallBack, registerFetchState } from "./data";
import Squads from "./Body/Squads";
import Paper from "@material-ui/core/Paper";
import { LinearProgress, Box, Typography } from "@material-ui/core";
import SearchForm from "./Body/SearchForm";
import Skeleton from "@material-ui/lab/Skeleton";
import Search from "./Body/Search";

const Body = (props) => {
	const [data, setData] = useState();
	const [code, setCode] = useState(props.codes);
	const [searchTerms, setSerchTerms] = useState();
	registerCallBack((data) => {
		setData(data);
	});
	const [fetchState, setFetchState] = useState({
		message: "Fetching data...",
		progress: 0,
	});
	registerFetchState((data) => {
		setFetchState(data);
	});
	// Display the data if we have it
	if (data) {
		return (
			<div class="body">
				<Paper elevation={3} className="Paper">
					<Search callBack={setSerchTerms} />
				</Paper>
				<Paper elevation={3} className="Paper">
					<h1>Guild Data: {data.name}</h1>
					<h3>Description: {data.desc}</h3>
					<ul>
						<li>Guild gp: {data.gp}</li>
						<li>Members: {data.members}</li>
					</ul>
					<Squads search={searchTerms} />
				</Paper>
			</div>
		);
	}
	// If we don't have any codes to search for
	else if (!code) {
		return (
			<div className="body">
				<Paper elevation={3} className="Paper">
					<div className="form-container">
						<SearchForm setCode={setCode} />
					</div>
				</Paper>
			</div>
		);
	}
	// Display progress if we don't have the data
	else
		return (
			<div class="body">
				<Paper elevation={3} className="Paper">
					<h1>{fetchState.message}</h1>
					<LinearProgressWithLabel value={fetchState.progress} />
					<Skeleton animation="wave" variant="text" width={450} height={60} />
					<Skeleton animation="wave" variant="text" width={650} height={30} />
					<Skeleton
						style={{ marginLeft: "25px" }}
						animation="wave"
						variant="text"
						width={150}
						height={25}
					/>
					<Skeleton
						style={{ marginLeft: "25px" }}
						animation="wave"
						variant="text"
						width={150}
						height={25}
					/>
					<Skeleton
						animation="wave"
						variant="text"
						width={"100%"}
						height={80}
					/>
					<Skeleton
						animation="wave"
						variant="text"
						width={"100%"}
						height={80}
					/>
					<Skeleton
						animation="wave"
						variant="text"
						width={"100%"}
						height={80}
					/>
					<Skeleton
						animation="wave"
						variant="text"
						width={"100%"}
						height={80}
					/>
				</Paper>
			</div>
		);
};

function LinearProgressWithLabel(props) {
	return (
		<Box display="flex" alignItems="center">
			<Box width="100%" mr={1}>
				<LinearProgress variant="determinate" {...props} />
			</Box>
			<Box minWidth={35}>
				<Typography variant="body2" color="textSecondary">{`${Math.round(
					props.value
				)}%`}</Typography>
			</Box>
		</Box>
	);
}

export default Body;
