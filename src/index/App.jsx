import React from "react";
import "./App/App.scss";
import TWBody from "./App/TW-Inspector-Body";
import GuildBody from "./App/GuildBody";
import MenuIcon from '@material-ui/icons/Menu';
import { fetchData } from "./App/data";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { Paper, Tabs, Tab, makeStyles, AppBar, Toolbar, IconButton, Typography, Button } from "@material-ui/core";

let firstRender = true;
const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: {
			main: "#25c5d8",
		},
		secondary: {
			main: "#64dd17",
		},
	},
});
const useStyles = makeStyles({
	root: {
		flexGrow: 1,
		backgroundColor: "#0095a8",
		transform: "translateY(2px)",
	},
});

const App = () => {
	// Get the allycodes from the url
	let params = window.location.search.substring(1);
	if (params !== "" && firstRender) {
		fetchData(params);
		firstRender = false;
	}
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
		console.log(newValue);
	};
	if (value === 0) {
		return (
			<div className="App">
				<ThemeProvider theme={theme}>
					<AppBar position="sticky">
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								SWGOH Inspector
							</Typography>
						</Toolbar>
					<Paper className={classes.root}>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Territory War Inspector" />
							<Tab label="Guild Inspector" />
						</Tabs>
					</Paper>
					</AppBar>
					<TWBody codes={params.substring()} />
				</ThemeProvider>
			</div>
		);
	} else if (value === 1) {
		return (
			<div className="App">
				<ThemeProvider theme={theme}>
        <AppBar position="sticky">
						<Toolbar>
							<Typography variant="h6" className={classes.title}>
								SWGOH Inspector
							</Typography>
						</Toolbar>
					<Paper className={classes.root}>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Territory War Inspector" />
							<Tab label="Guild Inspector" />
						</Tabs>
					</Paper>
					</AppBar>
					<GuildBody codes={params.substring()} />
				</ThemeProvider>
			</div>
		);
	}
};

export default App;
