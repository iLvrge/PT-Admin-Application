import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  customTabContainer: {
    color: theme.color.lightGray,
    display: 'flex',
    justifyContent: 'space-around',
    border: '1px solid #363636',
    borderTop: 'none',
    /* fontSize: '.875rem',
    lineHeight: '1.6rem', */
    backgroundColor: theme.color.background,
    alignItems: 'center',
    padding: '2px 0',
    margin: '-1px 10px 0'
  },
  button: {
    cursor: 'pointer'
  }
}));