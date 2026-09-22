/*
 * Class names GENERATED from this module's former makeStyles object by
 * scripts/jss-to-css.cjs; the rules live in the stylesheet imported below.
 *
 * useStyles() deliberately stays a function returning { key: className }, so
 * every `const classes = useStyles()` call site is unchanged.
 */
import './CollapsibleTable.css'
import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CollapseLevel2 from "./CollapseLevel2";

const useRowStyles = () => ({
  "root": "pt-levels-nested-tree-grid-collapsible-table-root",
});

function Row(props) {
  const row = props.row;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell node1={row.id} name={row.name} level={row.level} tabid={0}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.level}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{
            paddingBottom: 0,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
          }}
          colSpan={4}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table aria-label="collapsible table">
              <TableRow>
                <TableCell />
                <TableCell style={{ width: "40%" }}>ID</TableCell>
                <TableCell style={{ width: "40%" }}>Name</TableCell>
                <TableCell style={{ width: "7%" }}>Level</TableCell>
              </TableRow>
              <TableBody>
                {row.child.map(historyRow => (
                  <CollapseLevel2
                    row2={historyRow}
                    parentNodeParent={row}
                    {...props}
                  />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable(props) {
  const classes = useRowStyles();
  const row = props.data;
  return (
    <TableContainer>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Level</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {row.map(row => (
            <Row key={row.name} row={row} {...props} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}