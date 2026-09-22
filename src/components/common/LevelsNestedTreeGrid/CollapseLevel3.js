/*
 * Class names GENERATED from this module's former makeStyles object by
 * scripts/jss-to-css.cjs; the rules live in the stylesheet imported below.
 *
 * useStyles() deliberately stays a function returning { key: className }, so
 * every `const classes = useStyles()` call site is unchanged.
 */
import './CollapseLevel3.css'
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
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
import CollapseLevel4 from "./CollapseLevel4";
import {
  setNestGridTabIndex,
  getFilterTimeLine,
  getCustomersNameCollections,
  setTimelineTabIndex,
  getCustomerRFIDAssets,
  getCollectionIllustration,
  setIllustrationUrl,
  setCurrentCollectionID,
  setCurrentAsset,
  getAssetsOutsource,
  getAssets,
  getComments,
} from "../../../actions/patenTrackActions";
import { signOut } from "../../../actions/authActions";

const useRowStyles = () => ({
  "root3": "pt-levels-nested-tree-grid-collapse-level3-root3",
});

function RowWithoutCollapse(props) {
  const { row2, row3, parentNodeParent, parentNodeParent1 } = props;
  console.log(props, row2, row3, "*********maurya");
  const row = row3;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  const errorProcess = err => {
    if (
      err !== undefined &&
      err.status === 401 &&
      err.data === "Authorization error"
    ) {
      props.signOut();
      return true;
    }
    return false;
  };

  const handleSelect = (
    event,
    nodeIds,
    level1,
    name,
    parentCompany,
    parentNodeId,
    parentName,
  ) => {
    setOpen(!open);

    if (nodeIds != "") {
      const targetEvent = event.currentTarget;
      const selectElement = "NODE";
      if (selectElement != null && selectElement != undefined) {
        const itemText = name;
        const parentElement = targetEvent.parentNode;
        if (parentElement != null) {
          const level = parentElement.getAttribute("level2");
          const tabId = parentElement.getAttribute("tabid2");
          // eslint-disable-next-line default-case
          switch (parseInt(level)) {
            case 2:
              props.setCurrentCollectionID(itemText);
              props.setCurrentAsset("");
              props.setIllustrationUrl("about:blank");
              props
                .getComments("collection", itemText)
                .catch(err => errorProcess({ ...err }.response));
              props
                .getCustomerRFIDAssets(
                  itemText,
                  tabId,
                  parentNodeParent.id,
                  parentNodeParent1.id,
                  nodeIds,
                )
                .catch(err => errorProcess({ ...err }.response));
              props
                .getFilterTimeLine(parentCompany, itemText, 2)
                .catch(err => errorProcess({ ...err }.response));
              props
                .getCollectionIllustration(itemText)
                .catch(err => errorProcess({ ...err }.response));
              break;
            case 3:
              props.setCurrentAsset(itemText);
              props.setCurrentCollectionID("");
              props.setIllustrationUrl("about:blank");
              props
                .getComments("asset", itemText)
                .catch(err => errorProcess({ ...err }.response));
              props
                .getAssetsOutsource(itemText)
                .catch(err => errorProcess({ ...err }.response));
              props
                .getAssets(itemText)
                .catch(err => errorProcess({ ...err }.response));
              props
                .getFilterTimeLine(parentCompany, itemText, 3)
                .catch(err => errorProcess({ ...err }.response));
              break;
          }
        }
      }
    }
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root3}>
        <TableCell node2={row3.id} level2={row3.level} tabid2={0}>
          <IconButton
            aria-label="expand row"
            size="small"
            // onClick={() => setOpen(!open)}
            onClick={event =>
              handleSelect(
                event,
                row3.id,
                row3.level,
                row3.name,
                parentNodeParent.name,
                parentNodeParent.id,
                parentNodeParent.name,
              )
            }
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row3 ? row3.id : ""}
        </TableCell>
        <TableCell align="left">{row3 ? row3.name : ""}</TableCell>
        <TableCell align="left">{row3 ? row3.level : ""}</TableCell>
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
              <TableBody>
                {/* <CollapseLevel4 row={row.child ? row.child : []} /> */}
                {row.child ? (
                  row.child.map(historyRow => (
                    <CollapseLevel4
                      row4={historyRow}
                      parentNodeParent={row}
                      {...props}
                    />
                  ))
                ) : (
                  <CollapseLevel4 row4={[]} {...props} />
                )}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function CollapsibleTable(props) {
  const { row3, row2 } = props;
  return <>{<RowWithoutCollapse key={row2.name} row3={row2} {...props} />}</>;
}

const mapDispatchToProps = {
  setNestGridTabIndex,
  getFilterTimeLine,
  getCustomersNameCollections,
  setTimelineTabIndex,
  getCustomerRFIDAssets,
  getCollectionIllustration,
  setIllustrationUrl,
  setCurrentCollectionID,
  setCurrentAsset,
  getAssetsOutsource,
  getAssets,
  getComments,
  signOut,
};

export default connect(null, mapDispatchToProps)(CollapsibleTable);