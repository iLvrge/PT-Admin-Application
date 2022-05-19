import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    nestedTree: {
        position: 'relative',
        width: '100%',
        height: '97.5%',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 5
    },
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        '& .heading_svg':{
            width: 20,
            height: 20, 
            fill: '#fff'
        }
    },
    context: {
        backgroundColor: theme.color.background + ' !important',
        color: 'white',
        flexGrow: 1,
        overflow: 'hidden',
        height: '100%',
        border: '1px solid #363636',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    flexColumn: {
        display: 'flex',
        flexDirection: 'column'
    },
    heading:{
        width: '100%',
        textAlign: 'left',
        display: 'block',
        color: 'inherit',
        /* fontSize: 'inherit', */
        padding: '23px 10px 3px 23px',
        /* fontWeight: 700, */
        borderBottom: '1px solid #000'
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
        marginTop: '4px'
    },
    paddingRight20: {
        paddingRight: '20px !important'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    indication: {
        width: 20,
        height: 20,
        borderRadius:'50%',
        background: 'green'
    },
    root: {
        height: 800,
        backgroundColor: '#222',
        color: '#bdbdbd',
        '& .ReactVirtualized__Table__headerRow':{
            backgroundColor: '#222 !important',
        },
        '& .MuiCheckbox-root':{
            '& .MuiSvgIcon-root':{
                fontSize: '18px !important'
            }
        }
    }
}));
