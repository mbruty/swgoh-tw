import React, { useState } from "react";
import { registerCallBack, registerFetchState } from "./data";
import Squads from "./Body/Squads";
import Paper from "@material-ui/core/Paper";
import { LinearProgress, Box, Typography } from "@material-ui/core";
import SearchForm from "./Body/SearchForm";

const Body = (props) => {
	const [data, setData] = useState();
	const [code, setCode] = useState(props.codes);
	registerCallBack((data) => {
		setData(data);
	});
	const [fetchState, setFetchState] = useState({message: "Fetching data...", progress: 0});
	registerFetchState((data) => {
		setFetchState(data);
	})

	console.log(props.codes);
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
	// If we don't have any codes to search for
	else if (!code){
		return(
			<div className="body">
				<Paper elevation={3} className="Paper">
					<SearchForm setCode={setCode}/>
				</Paper>
			</div>
		)
	}
	// Display progress if we don't have the data
	else
		return (
			<div class="body">
				<Paper elevation={3} className="Paper">
					<h1>{fetchState.message}</h1>
					<LinearProgressWithLabel value={fetchState.progress} />
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
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default Body;
