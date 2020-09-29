import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    container: {
        backgroundColor: theme.color.background,
        margin: '0 0px 10px 10px',
        padding: `0 1rem`,
        color: theme.color.lightGray,
        border: '1px solid #363636',
        display: 'flex',
        position: 'relative',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60,
        
    },
    searchContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        zIndex: 1002,
        '& .MuiPaper-root': {
            backgroundColor: 'inherit'
        },
    },
    selected:{
        color: 'red !important'
    },
    scrollbar: {
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
        '& .ReactVirtualized__Table__rowColumn a':{
            color: '#73b2ff',
            cursor: 'pointer'
        }, 
        '& .MuiPaper-root': {
            backgroundColor: 'inherit'
        },        
        marginTop: '2px',
        
    },
    tableView:{
        width: '100%'
    },
    width10: {
        width: '20px'
    },
    context: {
        backgroundColor: theme.color.background,
        width: '100%',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    input:{
        color: theme.color.lightGray,
    },
    form:{
        '& .MuiInputLabel-root':{
            color: '#ffffff !important',
            fontWeight: 'inherit',
            /* fontFamily: 'inherit' */        
        },
        '& .MuiFormControl-root':{
            width: '70%'
        }
    },
    marginRight: {
        marginRight: '10px'
    },
    marginTop: {
        marginTop: '20px'
    },
    spanAbsolute: {
        /*position: 'absolute',
        right: '120px',
        top: '22px',*/
        color: '#E60000',
        float: 'right',
        marginRight: '10px',
        position: 'relative',
    },
    iconAbsolute: {
        /*position: 'absolute',
        top: '22px',        
        right: '10px',*/
        cursor: 'pointer', 
        float: 'right',
        position: 'relative',
    },
    rightManualFlag:{
        

    },
    right:{
        right: '45px'
    },
    list: {
        height: '100%',
        padding: '0.375rem !important',
        margin: 0
    },
    listItem: {
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        color: '#d6d6d6',
        /* fontSize: 'inherit',
        fontFamily:'inherit', */
        padding: '0.375rem 0 0 0.375rem !important',
        margin: 0,
        fontStyle: 'normal',
        /* fontWeight: 400, */
        lineHeight: 1.5,
        "& svg": {
            position: 'relative',
            top: '4px'
        },
        "& ul": {            
            "& li": {
                marginBottom:'10px'
            }
        }        
    },
    selected_company: {
        color: '#E60000',
        fontWeight: 'bold',
    },
    selected_sub_company: {
        color: '#70A800',        
        fontWeight: 'bold',
    },
    children: {
        listStyle: 'none',
        paddingLeft: '25px',
        marginTop: '7px'
    },
    delete: {
        color: '#E60000',
        cursor: 'pointer',
    },
    scrollbar: {
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        marginTop: '4px',
        '& .ReactVirtualized__Table__rowColumn a':{
            color: '#73b2ff'
        },  
    },
    paddingRight20: {
        paddingRight: '20px !important'
    },
    activeCopyRow:{
        color: 'red',
        '& a': {
            color: 'red !important',
        }
    },
    activeRepresentative: {
        color: '#FFD700',
        '& a':{
            color: '#FFD700 !important',
        }
    },
    white: {
        '& a':{
            color: '#bdbdbd'
        }
    } ,
    outSourceWrapper: {
        width: "100%",
        height: "100%",
        position: "relative",
        background: "black",
        overflow: "auto",
        "& svg": {
          position: "absolute",
          "-webkit-touch-callout": "none" /* iOS Safari */,
          "-webkit-user-select": "none" /* Safari */,
          "-khtml-user-select": "none" /* Konqueror HTML */,
          "-moz-user-select": "none" /* Old versions of Firefox */,
          "-ms-user-select": "none" /* Internet Explorer/Edge */,
          "user-select":
            "none" /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */,
        },
      },
      padding: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      switcher: {
        color: '#bdbdbd',
        width: 18,
        height: 18,
        border: '1px solid #bdbdbd',
        borderRadius: 20,
        background: theme.color.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        transform: 'translate(25%,-25%)',
        zIndex: 1200009,
        cursor: 'pointer'
      }
}));