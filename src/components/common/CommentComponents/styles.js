import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  commentsComponents: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexGrow: 1
  },
  container: {
    backgroundColor: theme.color.background,
    margin: 5,
    color: 'white',
    flexGrow: 1,
    border: '1px solid #363636',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  context: {
    padding: theme.spacing(2),
  },
  contextExpand: {
    padding: theme.spacing(4),
  },
  typography: {
    paddingBottom: theme.spacing(1),
    margin: 0,
    /* fontSize: '1.075rem', */
    wordBreak: 'break-all'
  },
  typographyExpand: {
    paddingBottom: theme.spacing(1),
    margin: 0,
    /* fontSize: '1.475rem', */
    lineHeight: 1.5,
    wordBreak: 'break-all'
  },
  textarea: {
    width: '100%',
    backgroundColor: theme.color.background,
    color: '#bdbdbd',
    border: 0,
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit'
  },
  scrollbar: {
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    '& .MuiTableCell-root':{
      color: theme.color.lightGray + ' !important'
    }
  },
  context: {
    backgroundColor: theme.color.background,
    color: 'white',
    flexGrow: 1,
    overflow: 'hidden',
    height: '100%',
    border: '1px solid #363636',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  open: {
    color: theme.color.lightGray + ' !important',
    marginRight: '5px'
  }
}));