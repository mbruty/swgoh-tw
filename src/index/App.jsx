import React from "react";
import "./App/App.scss";
import Nav from "./App/Nav";
import Body from './App/Body'
import { fetchData } from "./App/data";

const App = () => {
	// Get the allycodes from the url
	let params = window.location.pathname;
	if (params !== "/") {
		fetchData(params);
	}
	return (
		<div className="App">
			<Nav codes={params.substring(1)} />
			<Body/>
		</div>
	);
};

export default App;
