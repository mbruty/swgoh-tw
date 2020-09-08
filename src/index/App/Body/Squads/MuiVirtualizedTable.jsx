import React from "react";
import clsx from "clsx";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import { AutoSizer, Column, Table } from "react-virtualized";
import ShowSquad from "./ShowSquad";

const styles = (theme) => ({
	flexContainer: {
		display: "flex",
		alignItems: "center",
		boxSizing: "border-box",
	},
	table: {
		// temporary right-to-left patch, waiting for
		// https://github.com/bvaughn/react-virtualized/issues/454
		"& .ReactVirtualized__Table__headerRow": {
			flip: false,
			paddingRight: theme.direction === "rtl" ? "0 !important" : undefined,
		},
	},
	tableRow: {
		cursor: "pointer",
	},
	tableRowHover: {
		"&:hover": {
			backgroundColor: theme.palette.grey[200],
		},
	},
	tableCell: {
		flex: 1,
	},
	noClick: {
		cursor: "initial",
	},
});

class MuiVirtualizedTable extends React.PureComponent {
	static defaultProps = {
		headerHeight: 48,
		rowHeight: 250,
  }
  
	getRowClassName = ({ index }) => {
		const { classes, onRowClick } = this.props;

		return clsx(classes.tableRow, classes.flexContainer, {
			[classes.tableRowHover]: index !== -1 && onRowClick != null,
		});
	};

	cellRenderer = ({ cellData, columnIndex }) => {
		const { columns, classes, rowHeight, onRowClick } = this.props;
		if (columnIndex === 2) {
			return (
				<TableCell
					component="div"
					className={clsx(classes.tableCell, classes.flexContainer, {
						[classes.noClick]: onRowClick == null,
					})}
					variant="body"
					style={{ height: rowHeight }}
					align={
						(columnIndex != null && columns[columnIndex].numeric) || false
							? "right"
							: "left"
					}
				>
					<ShowSquad data={cellData} />
				</TableCell>
			);
		}
		return (
			<TableCell
				component="div"
				className={clsx(classes.tableCell, classes.flexContainer, {
					[classes.noClick]: onRowClick == null,
				})}
				variant="body"
				style={{ height: rowHeight }}
				align={
					(columnIndex != null && columns[columnIndex].numeric) || false
						? "right"
						: "left"
				}
			>
				{cellData}
			</TableCell>
		);
	};

	headerRenderer = ({ label, columnIndex }) => {
		const { headerHeight, columns, classes } = this.props;

		return (
			<TableCell
				component="div"
				className={clsx(
					classes.tableCell,
					classes.flexContainer,
					classes.noClick
				)}
				variant="head"
				style={{ height: headerHeight }}
				align={columns[columnIndex].numeric || false ? "right" : "left"}
			>
				<span>{label}</span>
			</TableCell>
		);
	};

	render() {
		const {
			classes,
			columns,
			rowHeight,
			headerHeight,
			...tableProps
		} = this.props;
		return (
			<AutoSizer>
				{({ height, width }) => (
					<Table
						height={height}
						width={width}
						rowHeight={rowHeight}
						gridStyle={{
							direction: "inherit",
						}}
						headerHeight={headerHeight}
						className={classes.table}
						{...tableProps}
						rowClassName={this.getRowClassName}
					>
						{columns.map(({ dataKey, ...other }, index) => {
							return (
								<Column
									key={dataKey}
									headerRenderer={(headerProps) =>
										this.headerRenderer({
											...headerProps,
											columnIndex: index,
										})
									}
									className={classes.flexContainer}
									cellRenderer={this.cellRenderer}
									dataKey={dataKey}
									{...other}
								/>
							);
						})}
					</Table>
				)}
			</AutoSizer>
		);
	}
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

export default function ReactVirtualizedTable(props) {
	console.log(props.data);
	let height = 800;
	if (props.data.length === 1) {
		height = 300;
	} else if (props.data.length === 2) {
		height = 550;
	}
	return (
		<Paper style={{ height, width: "100%" }}>
			<VirtualizedTable
				rowCount={props.data.length}
				rowGetter={({ index }) => props.data[index]}
				columns={[
					{
						width: 150,
						label: "Name",
						dataKey: "owner",
					},
					{
						width: 100,
						label: "Gp",
						dataKey: "squadGp",
						numeric: true,
					},
					{
						width: 1000,
						label: "Squad",
						dataKey: "squad",
					},
				]}
			/>
		</Paper>
	);
}
