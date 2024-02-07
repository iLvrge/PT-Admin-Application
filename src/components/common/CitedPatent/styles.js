import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
    container: {
        backgroundColor: theme.color.background,
        height: '100%',
        margin: 0,
        padding: `0 1rem`,
        color: theme.color.lightGray,
        border: 0,
        display: 'flex',
        position: 'relative',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60,
        '& svg.svg-inline--fa':{
            width: 24,
            height: 24
        },
        '& .MuiTablePagination-root': {
            color: '#fff'
        },
        '& .MuiTablePagination-select':{
            paddingTop: 11,
            
        },
        '& .MuiTablePagination-selectIcon':{
            top: 7,
            fontSize: 16
        }
    },
    flexColumn: {

    },
    box: {
        width: 500,
        minHeight: 140,
        margin: '100px auto',
        background: '#424242',
        padding: 10,
        color: '#fff',
        '& input': {
            color: '#fff',
        },
        '& button': {
            marginTop: 20,
            marginRight: 10,
        }
    }
}));