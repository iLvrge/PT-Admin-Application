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
    },
    link: {
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    eventsContainer: {
      color: '#bdbdbd',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 1,
      width: '40%',
      zIndex: 1000,
      background: '#222222 !important',
      padding: 10,
      margin: '0 auto'
    },
    container: {
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '200px',
      padding: 10
    }
}));