import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    userItemsContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%',
    zIndex: 1000,
    background: '#222222 !important',
    padding: 10
  }
}));