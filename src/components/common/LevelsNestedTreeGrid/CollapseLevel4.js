/*
 * Class names GENERATED from this module's former makeStyles object by
 * scripts/jss-to-css.cjs; the rules live in the stylesheet imported below.
 *
 * useStyles() deliberately stays a function returning { key: className }, so
 * every `const classes = useStyles()` call site is unchanged.
 */
import './CollapseLevel4.css'
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
// import CollapsibleTable3 from './CollapsibleTable3'

const useRowStyles = () => ({
  "root": "pt-levels-nested-tree-grid-collapse-level4-root",
});

function RowWithoutCollapse(props) {
  const { row5 } = props;
  const [open, setOpen] = React.useState(false);
  const row = row5;

  const classes = useRowStyles();
  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {" "}
          </IconButton>
        </TableCell>
        {/* <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell /> */}
        <TableCell component="th" scope="row">
          {row ? row.id : ""}
        </TableCell>
        <TableCell align="left">{row ? row.name : ""}</TableCell>
        <TableCell align="left">{row ? row.level : ""}</TableCell>
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
              <TableBody></TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable(props) {
  const { row4, parentNodeParent } = props;
  return (
    <>
      <TableRow>
        {/* <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell /> */}
        <TableCell />
        <TableCell style={{ width: "37%" }}>ID</TableCell>
        <TableCell style={{ width: "23%" }}>Name</TableCell>
        <TableCell style={{ width: "7%" }}>Level</TableCell>
      </TableRow>
      {
        <RowWithoutCollapse
          key={row4.name}
          row5={row4}
          parentNodeParent={parentNodeParent}
        />
      }
    </>
  );
}