import { makeStyles } from "@material-ui/styles";

export default makeStyles(theme => ({
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
    },
    modalContainer: {
      flexGrow: 1,
      display: 'flex',
      height: '85vh',
      justifyContent: 'center',
      width: '70%',
      margin: '50px auto',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      float: 'right',
      '& .search_container':{
        /* maxWidth: '70%' */
      }
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
}));