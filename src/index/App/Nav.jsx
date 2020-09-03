import React, { useState } from "react";
import { Navbar, Button, Form, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import { fetchData } from "./data";

const NavForm = (props) => {
	const [validated, setValidated] = useState(false);
	return (
		<Formik
			validate={(values) => {
				const errors = {};
				if (!values.allyCode) {
					errors.allyCode = "Allycode is required";
					setValidated(false);
				} else if (values.allyCode.replace(/-/g, "").length !== 9) {
					errors.allyCode = "Invalid allycode";
					setValidated(false);
				} else {
					setValidated(true);
				}
				return errors;
			}}
			onSubmit={(data, { setSubmitting }) => {
				setSubmitting(true);
				fetchData(data.allyCode)
				.then(() => setSubmitting(false));
			}}
			initialValues={{ allyCode: props.codes }}
		>
			{({ values, errors, isSubmitting, handleChange, handleSubmit }) => (
				<Form
					noValidate
					validated={validated}
					className="nav-form"
					inline="true"
					onSubmit={handleSubmit}
				>
					<Form.Group>
						<Form.Control
							type="text"
							name="allyCode"
							placeholder="Ally code"
							isInvalid={errors.allyCode}
							required
							className="nav-input"
							onChange={handleChange}
							value={values.allyCode}
						/>
						<Form.Control.Feedback type="invalid">
							{errors.allyCode}
						</Form.Control.Feedback>
					</Form.Group>
					{isSubmitting ? (
						<>
							<Button variant="success" disabled>
								<Spinner
									as="span"
									animation="border"
									size="sm"
									role="status"
									aria-hidden="true"
								/>
								<span className="sr-only">Loading...</span>
							</Button>{" "}
						</>
					) : (
						<Button type="submit" inline="true" variant="outline-success">
							Search
						</Button>
					)}
				</Form>
			)}
		</Formik>
	);
};

const Nav = (props) => (
	<Navbar expand="lg" variant="dark" bg="dark">
		<Navbar.Brand href="#home">SWGOH TW Inspector</Navbar.Brand>
		<Navbar.Toggle aria-controls="responsive-navbar-nav" />
		<Navbar.Collapse className="justify-content-end">
			<NavForm codes={props.codes} />
		</Navbar.Collapse>
	</Navbar>
);

export default Nav;
