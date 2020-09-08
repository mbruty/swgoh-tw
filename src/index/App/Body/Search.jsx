import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import Chip from "./Search/Chip";

export default (props) => {
	let [values, setValues] = useState(["", 0, 0, 1, "No"]);
	console.log(values);
	return (
		<>
			<form
				noValidate
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault();
					props.callBack(values);
					console.log(values);
				}}
			>
				<TextField
					id="standard-basic"
          label="Player search"
          style={{marginTop: '-15px', marginRight: '15px', width: "250px"}}
					onChange={(e) => {
						let newArr = [...values];
						newArr[0] = e.target.value;
						setValues(newArr);
					}}
				/>
				<Chip
					name="Minimum Relic"
					options={Array.from(Array(8).keys())}
					values={values}
					setValues={setValues}
					index={1}
				/>
				<Chip
					name="Minimum Gear Level"
					options={Array.from(Array(14).keys())}
					values={values}
					index={2}
					setValues={setValues}
				/>
				<Chip
					name="Minimum Stars"
					options={Array.from(Array(7).keys(), (x) => x + 1)}
					values={values}
					setValues={setValues}
					index={3}
				/>
				<Chip
					name="Match all toons"
					options={["No", "Yes"]}
					values={values}
					setValues={setValues}
					index={4}
				/>
				<Button
					type="submit"
					variant="contained"
					color="Secondary"
					className="no-focus"
				>
					Search
				</Button>
			</form>
		</>
	);
};
