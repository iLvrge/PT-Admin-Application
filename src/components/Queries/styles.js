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
        backgroundColor: '#121212',
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
    },    
    settingContainer: {
        position: 'relative',
        flexGrow: 1,
        display: 'flex',
        height: 'auto',
        justifyContent: 'center',
        width: '100%',
        color: '#fff' 
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    context: {
        border: '1px solid #363636',
        backgroundColor: theme.color.background,
        width: '100%',
        margin: '0 auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '& .MuiToolbar-root': {
            minHeight: 'auto'
        }
    },
    customerSearchHeight:{
        height: '50vh'
    },
    splitPane: {
        position: 'relative !important',

        '& .Resizer': {
        background: `${theme.palette.divider}`,
        opacity: 1,
        zIndex: 1,
        boxSizing: 'border-box',
        backgroundClip: 'padding-box',
        '&.horizontal': {
            height: 3,
            margin: '5px 0',
            borderTop: '3px dashed grey',        
            cursor: 'row-resize',
        },
        '&.vertical ': {
            width: 11,
            margin: '0 5px',
            borderLeft: '5px dashed grey',    
            cursor: 'col-resize',
        },
        },
        '& .Pane2': {
            height: '100%',
            overflow: 'auto',
        }
    }
}));