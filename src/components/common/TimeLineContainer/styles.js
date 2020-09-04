import { makeStyles } from "@material-ui/styles";

export default makeStyles((theme) => ({
  timeLineContainer: {
    flexGrow: 1,
    position: 'relative',
    width: '100%',
    zIndex: 9999
  },
  timeLineWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTab-wrapper': {
      fontWeight:'inherit',
      textTransform: 'initial'
    }
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    width: '100%',
  },
  container: {
    backgroundColor: theme.color.background,
    margin: '5px 5px 0px 5px',
    color: 'white',
    flexGrow: 1,
    height: '100%',
    border: '1px solid #363636',
    position: 'relative',
    overflow: 'hidden'
  },
  btnGroups: {
    backgroundColor: '#222',
    border: '1px solid #363636',
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 1000002,
    display: 'flex',
    flexDirection: 'column',
  },
  button: {
    width: 25,
    height: 25,
    margin: 2,
    /* fontSize: 12, */
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    color: theme.color.lightGray,
    '&:hover': {
      color: '#2493f2'
    },
    cursor: 'pointer'
  },
  outsource: {
    /* fontSize: '1.2rem', */
    border: 0,
    width: '100%',
    height: '100%',
  },
  outSourceWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    background: 'black'
  },
  padding: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
}));
