import { makeStyles } from "@material-ui/styles";
export default makeStyles((theme) => ({
  tabsWrapper: {
    width: '100%',
  },
  tabs: {
    paddingLeft: 8,
    paddingRight: 8,
    minHeight: 'initial',
    position: 'relative',
  },
  tabItem: {
    minWidth: 'initial',
    /* fontSize: '.875rem', */
    lineHeight: '1.5rem',
    minHeight: 'initial',
    marginLeft: 2.5,
    marginRight: 2.5,
    padding: '1px 0.75rem',
    color: theme.color.lightGray,
    border: '1px solid #363636',
    borderTopWidth: 0
  }
}));
