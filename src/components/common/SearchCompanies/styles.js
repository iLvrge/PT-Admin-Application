import { purple } from "@material-ui/core/colors";
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
        '& svg.svg-inline--fa':{
            width: 24,
            height: 24
        } 
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
        '& .ReactVirtualized__Table__row': {
            borderBottom: '1px solid #363636',
            color: '#fff'
        },
        '& .ReactVirtualized__Table__sortableHeaderColumn':{
            whiteSpace: 'nowrap'
        },
        '& .ReactVirtualized__Table__headerColumn':{
            position: 'relative',
            color: '#fff',
            '& .DragHandle':{
              flex: '0 0 16px',
              zIndex: 2,
              cursor: 'col-resize',
              position: 'absolute',
              right: 10
            }
        },
        '& .ReactVirtualized__Table__rowColumn':{
            color: '#fff'
        },
    },
    rowBold: {
        fontWeight: 'bold'
    },
    searchIcon: {
        position: 'relative',
        left: '-2px',
        top: '6px',
        cursor: 'pointer'
    },
    normalizedRow: {
        color: '#61f53c',
        '& a':{
            color: '#61f53c !important'
        }
    },
    selected:{
        color: 'red !important'
    },
    scrollbar: {
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
        '& .ReactVirtualized__Table__row':{
            color: '#fff'
        },
        '& .ReactVirtualized__Table__rowColumn':{
            color: '#fff'
        },
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
        display: 'flex',
        justifyContent: 'space-between',
        position: 'relative',
        '& .MuiInputLabel-root':{
            color: '#ffffff !important',
            fontWeight: 'inherit',
            /* fontFamily: 'inherit' */        
        },
        '& .MuiFormControl-root':{
            width: '40%'
        }
    },
    marginRight: {
        marginRight: 10
    },
    marginTop: {
        marginTop: 3
    },
    spanAbsolute: {
        /*position: 'absolute',
        right: '120px',
        top: '22px',*/
        color: '#E60000',
        position: 'absolute'
        //float: 'right',
        //marginRight: 10,
        //position: 'relative',
    },
    iconAbsolute: {
        /*position: 'absolute',
        top: '22px',        
        right: '10px',*/
        cursor: 'pointer', 
        float: 'right',
        position: 'relative',
    },
    pointer: {
        cursor: 'pointer', 
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
    containerSc:{
        flexGrow: 1,
        marginTop: '4px',
        '& .ReactVirtualized__Table__rowColumn a':{
            color: '#73b2ff'
        }, 
        '& svg.svg-inline--fa':{
            width: 24,
            height: 24
        }
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
        },
        '& .MuiButton-label':{
            color: 'red !important',
        }
    },
    correctRow: {
        color: 'pink',
        '& a': {
            color: 'pink !important',
        },
        '& .MuiButton-label':{
            color: 'pink !important',
        }
    },
    activeRepresentative: {
        color: '#FFD700',
        '& a':{
            color: '#FFD700 !important',
        }
    },
    applicantRow: {
        color: 'rgb(252, 146, 158)',
        '& a':{
            color: `rgb(252, 146, 158) !important`,
        }
    },
    partiesRow: {
        color: 'rgb(255, 255, 255)',
        '& a':{
            color: `rgb(255, 255, 255) !important`,
        }
    },
    inventorRow: {
        color: '#F44336',
        '& a':{
            color: `#F44336 !important`,
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
        backgroundColor: "#1D2025",
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
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
    btn: {
        /* background: 'white', */
        alignItems: 'flex-start',
        display: 'flex',
        padding: 0
    },
    btnAssignment: {
        cursor: 'pointer',
        color: '#bdbdbd',
        border: '1px solid #bdbdbd',
        padding: '5px',
        borderRadius: '50%'
    },
    last: {
        marginLeft: '10px'
    },
    switchButton: {
        position: 'absolute',
        right: 10,
        /* top: 50, */
        width: 200,
        height: 40
    },
    floatContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 40,
        flex: 1
    },
    floatBtn: {
        /* position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 99999,
        marginRight: 10 */
        display: 'flex'
    },
    displayFlex: {
        display: 'flex',
        padding: '10px 5px',
        color: '#E60000'   
    },
    activateButton: {
        '& .MuiButton-label':{
            color: '#E60000'  
        }
    },
    anchorButton: {
        color: '#90caf9'
    },
    searchInputBox:{
        width: 350,
        marginLeft: 20,
        marginRight: 20,
        '& input':{
            color: '#fff'
        }
    },
    select: {
        color: '#fff'
    },
    btn: {
        color: '#fff'
    },
    addressContainer: {
        display: 'flex',
        flex: 1,
        width: '100%',
        height: '100%'
    },
    containerChild: {
        display: 'flex',
        flex: 1,
        color: '#fff'
    },
    resizable:{
        /* position: "relative",
        display: 'flex',
        flexDirection: 'column', */
        "& .react-resizable-handle": {
            position: "absolute",
            width: 25,
            height: 25,
            bottom: 0,
            right: 0,
            background:
                "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3R5bGU9ImZpbGw6I2ZmZmZmZiIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSIyMHB4IiBoZWlnaHQ9IjIwcHgiPjxwYXRoIGQ9Ik0xOSAxMmgtMnYzaC0zdjJoNXYtNXpNNyA5aDNWN0g1djVoMlY5em0xNC02SDNjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMThjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptMCAxNi4wMUgzVjQuOTloMTh2MTQuMDJ6Ij48L3BhdGg+PC9zdmc+')",
            backgroundPosition: "bottom right",
            /* padding: "0 3px 3px 0", */
            backgroundRepeat: "no-repeat",
            backgroundOrigin: "content-box",
            boxSizing: "border-box",
            cursor: "se-resize",
            padding: 5
        }
    },
}));