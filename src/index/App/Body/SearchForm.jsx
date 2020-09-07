import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Formik, useField, Form } from "formik";
import { fetchData } from "../data";

const CustomTextField = ({ placeholder, ...props }) => {
	const [field, meta] = useField(props);
	const errorText = meta.error && meta.touched ? meta.error : "";
	return (
		<TextField
			placeholder={placeholder}
			{...field}
			helperText={errorText}
			error={!!errorText}
			className="allycode-input"
		/>
	);
};
const SearchForm = (props) => {
	return (
		<Formik
			validate={(values) => {
				const errors = {};
				if (!values.allyCode) {
					errors.allyCode = "Allycode is required";
				} else if (values.allyCode.replace(/-/g, "").length !== 9) {
					errors.allyCode = "Invalid allycode";
				}
				return errors;
			}}
			onSubmit={(data) => {
        props.setCode(data.allyCode);
				fetchData(data.allyCode);
			}}
			initialValues={{ allyCode: props.codes }}
		>
      {({ values, errors, isSubmitting }) => (
			<Form>
				<CustomTextField placeholder="Allycode" name="allyCode" />
				<Button type="submit" inline="true" variant="outlined" disabled={errors.allyCode} color="primary">
					Search
				</Button>
			</Form>
      )}
		</Formik>
	);
};

export default SearchForm;
