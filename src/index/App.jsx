import React from "react";
import "./App/App.scss";
import Nav from "./App/Nav";
import Body from "./App/Body";
import { fetchData } from "./App/data";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#26c6da',
    },
    secondary: {
      main: '#64dd17',
    },
  },
});

const App = () => {
	// Get the allycodes from the url
	let params = window.location.search.substring(1);
	if (params !== "") {
		fetchData(params);
	}
	return (
		<div className="App">
			<ThemeProvider theme={theme}>
				<Nav codes={params.substring()} />
				<Body codes={params.substring()} />
			</ThemeProvider>
		</div>
	);
};

export default App;
