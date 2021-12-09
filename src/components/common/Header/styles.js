import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
  logotype: {
    fontWeight: 400,
    fontSize: '1.6994866rem',
    lineHeight: '1.3875',
    letterSpacing: 0,
    fontKerning: 'normal',
    margin: 0,
    whiteSpace: "nowrap",
    display: 'flex',
    alignItems: 'center',
    marginLeft: '5px',
    width: '16.666667%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 6,
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: theme.color.background,
    margin: 5,
    position: 'initial',
    width: 'initial',
    border: '1px solid #363636',
    color: theme.color.lightGray,
    '& button':{
      fontSize: '1rem'
    }
  },
  toolbar: {
    padding: 0,
    height: 44,
    minHeight: 44,
    position: 'relative'
  },
  hide: {
    display: "none",
  },
  grow: {
    flexGrow: 1,
  },
  headerMenu: {
    marginTop: theme.spacing(7),
    marginRight: theme.spacing(7),
  },
  headerMenuButton: {
    marginLeft: '0.5rem',
    padding: '1rem 0.5rem',
    fontSize: '1rem'
  },
  headerIcon: {
    fontSize: '2rem',
    color: theme.color.lightGray,
    lineHeight: 1.2
  },
  badge: {
    height: 10,
    width: 10
  },
  profileMenu: {
    position: 'absolute',
    top: 'calc(100%)',
    background: 'black',
    border: '1px solid #2b2b2b',
    borderTop: 'none',
    right: '-1px',
    boxShadow: '5px 5px 3px -3px rgba(120,120,120,.3)',
    textAlign: 'left',
    minWidth: '9vw'
  },
  profileMenuItem: {
    padding: '0.5rem',
    lineHeight: '1.5',
    fontSize: '1rem',
    borderTop: '1px solid #262626',
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    borderLeft: '3px solid transparent',
    color: theme.color.lightGray,
  },
  fixItMenu: {
    position: 'absolute',
    top: 'calc(100% - 2px)',
    background: 'black',
    border: '1px solid #2b2b2b',
    borderTop: 'none',
    right: 0,
    boxShadow: '5px 5px 3px -3px rgba(120,120,120,.3)',
    textAlign: 'left'
  },
  fixItMenuItem: {
    padding: '0.5rem',
    lineHeight: '1.5',
    fontSize: '1rem',
    borderTop: '1px solid #262626',
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    borderLeft: '3px solid transparent',
    "&:hover": {
      background: "#bdbdbd",
      color: '#2b2b2b'
    }
  },
  textarea: {
    width: '100%',
    backgroundColor: '#444',
    color: 'white',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    border: '1px solid rgb(169,169,169) !important'
  },
  userlogo: {
    width: '3rem',
    alignSelf:'center',
  },
  companyLogo: {
    height: '32px',
    marginTop: '3px' 
  },
  companyLogoBtn: {
    padding: '2px 0px 0px 0px',
    marginRight:'10px',
    float: 'left'
  },
  siteLogo: {
    maxHeight: '33px',
    maxWidth:'90%'
  },
  headerMenuIcon: {
    fill: 'currentColor',
    transition: '.3s',
    transformOrigin: '50% 50%',
    transform: 'rotate(0)',
    filter: 'invert(75%)'
  },
  headerTitle: {
    overflow: 'hidden',
    flexGrow: 1,
    '& .MuiAvatar-circle': {
      borderRadius: 0
    },
    '& .MuiAvatar-root':{
      width: 'auto',
    }, 
    '& .MuiAvatar-img':{
      width: 'auto',
    }  
  },
  headerTitleContent: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    /*fontSize: '1.6994866rem',
    ['@media (max-width:859px)']: {
      fontSize: '1.503565rem',
    },
    ['@media (max-width:479px)']: {
      fontSize: '1.328125rem',
    },*/
    '& .MuiTypography-h2': {
      lineHeight: '35px'
    },
    '& .MuiTypography-h6': {
      lineHeight: '35px !important'
    },
    marginLeft: '20px',
    float: 'left'
  },
  customPadding: {
    padding:'30px'
  },
  customSelect:{
    padding: '5px',
    width: '50%',
    backgroundColor: '#444 !important',
    border: '1px solid rgb(169,169,169) !important',
    '& option:hover': {
      backgroundColor: '#bdbdbd !important',
      color: 'white'
    },
    color: 'white'
  },
  btn:{
    marginLeft: '0px !important'
  },
  small: {
    height: '24px',
   /* position: 'relative',
    top: '2px',*/
    float: 'left',
    paddingTop: '5px'
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  appButton:{
    '-webkit-appearance':'none',
    boxShadow:'6px 6px 12px #434343, -6px -6px 12px #5b5b5b',
    outline: 'none',
    cursor: 'pointer',
    borderRadius:'50%'
  },
  form:{
    '& .MuiInputLabel-root':{
        color: '#ffffff !important',
        fontWeight: 'inherit',
        /* fontFamily: 'inherit' */        
    },
    '& .MuiFormControl-root':{
        width: '70%'
    },
    marginTop: '3px',
    display: 'inherit'
  },
  active: {
    color:'#EF0000 !important'
  },
  white: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: '#fff',
    display: 'flex'
  },
  red: {
    background: '#e60000',
  },
  green: {
    background: 'green',
  },
  flexButton:{
    padding: 0,
    marginRight: '1rem',
    borderRadius: 0,
    '& .MuiIconButton-label':{
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center', 
      textAlign: 'center',
    }
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  drawer:{
    '& .MuiDrawer-paper':{
      top: 42,
      backgroundColor: '#424242',
      width: 200
    }
},
}));
