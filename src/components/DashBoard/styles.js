import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  dashboard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  dashboardWarapper: {
    position: 'relative',
    flexGrow: 1,
    flexDirection: 'column',
    display: 'flex',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 1
  },
  container: {
    backgroundColor: '#303030', 
    padding: 5,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'nowrap !important',
    overflowX: 'hidden',
    overflowY: 'hidden',
    [theme.breakpoints.down("md")]: {
      height: 'auto'
    }
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  customIndex:{ 
    zIndex: 1001
  }
}));