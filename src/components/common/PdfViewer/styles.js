import { makeStyles } from "@material-ui/core/styles";

export default makeStyles(theme => ({
  pdfContainer: {
    flexGrow: 1,
    position: "relative",
    width: "100%",
    zIndex: 9999,
  },
  pdfWrapper: {
    position: "relative",
    top: "4px",
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
  },
  scrollbar: {
    flexGrow: 1,
    overflow: "hidden",
    height: "100%",
    width: "100%",
  },
  container: {
    margin: "5px 5px 0px 5px",

    flexGrow: 1,
    height: "100%",
    border: "1px solid #363636",
    position: "relative",
    overflow: "hidden",
  },
  outsource: {
    width: "100%",
    border: "0px",
  },
  fullView: {
    width: "100% !important",
  },
  close: {
    position: "absolute",
    left: "-2px",
    zIndex: 11,

    top: "-12px",
    fontSize: "20px",
    cursor: "pointer",
  },
}));
