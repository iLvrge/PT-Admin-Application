import React, { useState, useEffect, forwardRef, useRef  } from 'react';
import {connect} from 'react-redux';
import useStyles from "./styles";
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import {
  AddBox,
  ArrowDownward, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clear, 
  DeleteOutline, 
  Edit, 
  FilterList, 
  FirstPage, 
  LastPage, 
  Remove, 
  SaveAlt, 
  Search, 
  ViewColumn
} from '@material-ui/icons';

import {
  Collapse,
  Button,
  TextField,
  Typography,
  Radio,
  FormLabel,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core";


import { getUsers, addUser, updateUser, deleteUser, createAccount, updateClientLogo } from "../../../actions/patenTrackActions";

function Users(props) {
  const classes = useStyles();
  const [state, setState] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState(0);
  const refUserAccount = useRef(null);
  const refUserLogo = useRef(null);
  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };
  const options = {
    paging: false,
    search: false,
    maxBodyHeight: props.height * 39  / 100,
    addRowPosition: 'first',
    toolbarButtonAlignment: 'left'
  };

  const [message, setMessage] = useState("");

  const [open, /*setOpen*/] = useState(false);

  function TelephoneIcon (){
    return (
      <i className={"fa fa-phone"}></i>
    )
  }


  useEffect(() => {
    const data = [];
    if(props.clientID > 0 && props.companyData && props.companyData.name != "") {
      setCompanyName(props.companyData.name)
      setCompanyType(parseInt(props.companyData.organisation_type))
    }
    if( props.userList.length > 0 ) {
      props.userList.forEach( user => {
        const record = {
          id: user.user_id,
          first_name: user.first_name,
          last_name: user.last_name,
          job_title: user.job_title,
          email_address: user.email_address,
          password: '',
          telephone:  user.telephone,
          telephone1: user.telephone1,
          type: user.role_id == 1 ? 0 : 1
        };
        data.push( record );
      });
    }
    const columns = [
      { 
        field: 'first_name', 
        title: '1st',
        headerStyle: {
          minWidth: 120, width: 120
        },
        cellStyle: {
          minWidth: 120, width: 120
        } 
      },
      {         
        field: 'last_name', 
        title: 'Last',
        headerStyle: {
          minWidth: 120, width: 120
        },
        cellStyle: {
          minWidth: 120, width: 120
        } 
      },
      { 
        field: 'job_title', 
        title: 'Title',
        headerStyle: {
          minWidth: 350, width: 350
        },
        cellStyle: {
          minWidth: 350, width: 350
        } 
      },
      { 
        field: 'email_address', 
        title: 'Email',
        headerStyle: {
          minWidth: 120, width: 120
        },
        cellStyle: {
          minWidth: 120, width: 120
        } 
      },
      { field: 'password', 
        title: 'Password',
        headerStyle: {
          minWidth: 90, width: 90
        },
        cellStyle: {
          minWidth: 90, width: 90
        } 
      },
      { field: 'telephone', 
        title: <TelephoneIcon/>,
        headerStyle: {
          minWidth: 80, width: 80
        },
        cellStyle: {
          minWidth: 80, width: 80
        } 
      },
      { field: 'telephone1',
        title: <TelephoneIcon/>,
        headerStyle: {
          minWidth: 80, width: 80
        },
        cellStyle: {
          minWidth: 80, width: 80
        } 
      },
      { 
        field: 'type',
        title: 'Type',
        headerStyle: {
          minWidth: 70, width: 70
        },
        cellStyle: {
          minWidth: 70, width: 70
        },
        lookup: { 0: "Admin", 1: "Manager" }
      }
    ];
    setState({
      columns: columns,
      data: data
    });
  },[props.userList]);

  const handleCreateAccount = ( form ) => {            
    let formData = new FormData(form); 
    if(props.clientID > 0){
      formData.append('organisation_id', props.clientID);
    }
    props.createAccount(formData, props.clientID);
  }

  const handleUpdateClientLogo = (form) => {
    let formData = new FormData(form); 
    props.updateClientLogo(formData, props.clientID);
  }

  const handleChangeType = (event) => {
    setCompanyType(parseInt(event.target.value))
  };

  const handleChangeName = (event) => {
    setCompanyName(event.target.value)
  };

  return (
    <div
      className  = {classes.userItemsContainer}
    >
      <div className={classes.container}>
        <div className={classes.formContainer}>
          <div className={classes.flex}>
            <Typography variant="h6" component="h2">
              Create / Change a Account name
            </Typography>
            <form ref={refUserAccount} className={classes.root} noValidate autoComplete="off">              
              <div>       
                <TextField id="company_name" name="company_name" label="Account Name" value={companyName} onChange={handleChangeName} />       
              </div>
              <div className={classes.mrgTop10}>       
                <FormLabel component="legend">Type</FormLabel>
                <RadioGroup aria-label="organisationType" name="organisation_type" value={companyType} onChange={handleChangeType}>
                  <FormControlLabel value={1} control={<Radio />} label="Company" />
                  <FormControlLabel value={2} control={<Radio />} label="Bank" />
                  <FormControlLabel value={3} control={<Radio />} label="Law Firm" />
                </RadioGroup>     
              </div>
              <Button   
                onClick={() => {
                  handleCreateAccount(refUserAccount.current)
                }} 
              >
                Save
              </Button>
            </form>
          </div>
          <div className={classes.flex}>
            <Typography variant="h6" component="h2">
              Update Client Logo
            </Typography>
            <form ref={refUserLogo} className={classes.root} noValidate autoComplete="off" encType='multipart/form-data'>     
              <div className={"MuiFormControl-root MuiTextField-root"}>    
                <TextField id="url_customer_logo" name="url_customer_logo" label="Logo url:" />       
              </div>
              <div className={"MuiFormControl-root MuiTextField-root"}>
                <label className={"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"} >Upload logo from hard drive:</label>
                <div className={"MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"}>
                <input
                  className={"MuiInputBase-input MuiInput-input"}
                  id="contained-button-file"
                  type="file"
                  name="file"
                />                
                </div>
              </div>
              <Button  disabled={props.clientID == 0 ? false : true}
                onClick={() => {
                  handleUpdateClientLogo(refUserLogo.current)
                }}
              >
                Save
              </Button>
            </form>
          </div>
        </div>
        {
          Object.keys(props.companyData).length > 0 && props.companyData.standard != '' && props.companyData.standard != null
          ?
            <a href={`https://standard.app.patentrack.com/${props.companyData.standard}`} target={'_blank'} style={{color: '#fff'}}>Version: Standard</a>
          :
          ''
        }
        <Collapse in={open}>
          <Alert severity="warning">
            {message}
          </Alert>
        </Collapse>
        <div className={classes.scrollbar}
          style={{height: props.height * 39  / 100}}
        >
          {      
            <MaterialTable
              localization={{
                header: {
                  actions: '#'
                }
              }}
              title=""
              icons={tableIcons}
              columns={state.columns}
              data={state.data}
              options={options}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    if(newData.email_address !== "" && newData.email_address != null) {
                      let formData = new FormData();
                      Object.entries(newData).forEach( key => {
                        if(key[0] !== 'tableData') {
                          formData.append( key[0], key[1] );
                        }                  
                      });
                      props.addUser(formData, props.clientID);
                      setTimeout(() => {
                        resolve();
                        setState((prevState) => {
                          const data = [...prevState.data];
                          newData.password = '';
                          data.push(newData);
                          console.log("onRowAdd", newData);
                          return { ...prevState, data };
                        });
                      }, 600);
                    }  else {
                      reject();
                      console.log("Email address cannot be empty.");
                      setMessage("Email address cannot be empty.");
                      /*setOpen(true);
                      setTimeout(() => {
                        setOpen(false);
                      }, 3000);*/
                    }                  
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    if(oldData) {
                      let formData = new FormData();
                      let editUserID = 0;
                      Object.entries(newData).forEach( key => {
                        if(key[0] !== 'tableData') {
                          if(key[0] === 'id') {
                            editUserID = key[1];
                          } else {
                            formData.append( key[0], key[1] );
                          }                          
                        }                  
                      });
                      if (editUserID > 0) {
                        props.updateUser(formData, editUserID, props.clientID);
                        setTimeout(() => {
                          resolve();
                          if (oldData) {
                            setState((prevState) => {
                              const data = [...prevState.data];
                              data[data.indexOf(oldData)] = newData;
                              console.log("onRowUpdate", newData);
                              return { ...prevState, data };
                            });
                          }
                        }, 600);
                      }
                    }                    
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    console.log("OldData", oldData);
                    if(oldData.id > 0) {
                      props.deleteUser( oldData.id, props.clientID );    
                      setTimeout(() => {
                        resolve();
                        setState((prevState) => {
                            const data = [...prevState.data];
                            data.splice(data.indexOf(oldData), 1);
                            console.log("onRowDelete", oldData);
                            return { ...prevState, data };
                          });
                      }, 600);
                    }                    
                  })
              }}
            />
          }
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    userList: state.patenTrack.userList,
    clientID: state.patenTrack.clientID,
    companyData: state.patenTrack.company_data,
  };
};

const mapDispatchToProps = {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  createAccount,
  updateClientLogo
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
