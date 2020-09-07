import React from "react";
import { Navbar } from "react-bootstrap";

const Nav = (props) => (
	<Navbar expand="lg" variant="dark" bg="dark">
		<Navbar.Brand href="#home">SWGOH TW Inspector</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		<Navbar.Collapse className="justify-content-end">
		</Navbar.Collapse>
	</Navbar>
);

export default Nav;
