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

import PatenTrackApi from "../../../api/patenTrack";


function Users(props) {
  const classes = useStyles();
  const [state, setState] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");
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

  const [open, setOpen] = useState(false);

  function TelephoneIcon (){
    return (
      <i className={"fa fa-phone"}></i>
    )
  }

  useEffect(() => {    
    if(props.clientID > 0 && props.companyData && props.companyData.name != "") {
      setCompanyName(props.companyData.name)
      setCompanyType(parseInt(props.companyData.organisation_type))
      setCompanyLogo(props.companyData.logo)
    }
  }, [props.clientID, props.companyData])


  useEffect(() => {    
    const data = [];
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
          minWidth: 60, width: 60
        },
        cellStyle: {
          minWidth: 60, width: 60
        } 
      },
      {         
        field: 'last_name', 
        title: 'Last',
        headerStyle: {
          minWidth: 60, width: 60
        },
        cellStyle: {
          minWidth: 60, width: 60
        } 
      },
      { 
        field: 'job_title', 
        title: 'Title',
        headerStyle: {
          minWidth: 100, width: 100
        },
        cellStyle: {
          minWidth: 100, width: 100
        } 
      },
      { 
        field: 'email_address', 
        title: 'Email',
        headerStyle: {
          minWidth: 80, width: 80
        },
        cellStyle: {
          minWidth: 80, width: 80
        } 
      },
      { field: 'password', 
        title: 'Password',
        headerStyle: {
          minWidth: 50, width: 50
        },
        cellStyle: {
          minWidth: 50, width: 50
        } 
      },
      { field: 'telephone', 
        title: <TelephoneIcon/>,
        headerStyle: {
          minWidth: 60, width: 60
        },
        cellStyle: {
          minWidth: 60, width: 60
        } 
      },
      { field: 'telephone1',
        title: <TelephoneIcon/>,
        headerStyle: {
          minWidth: 60, width: 60
        },
        cellStyle: {
          minWidth: 60, width: 60
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
    props.updateClientLogo(form, formData, props.clientID);
  }

  const handleChangeType = (event) => {
    setCompanyType(parseInt(event.target.value))
  };

  const handleChangeName = (event) => {
    setCompanyName(event.target.value)
  };

  const handleChangeCompanyLogo = (event) => {
    setCompanyLogo(event.target.value)
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
                  <FormControlLabel value={4} control={<Radio />} label="University" />
                  <FormControlLabel value={5} control={<Radio />} label="Goverment" />
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
                <TextField id="url_customer_logo" name="url_customer_logo" label="Logo url:" value={companyLogo} onChange={handleChangeCompanyLogo}/>       
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
              <Button  disabled={props.clientID == 0 ? true : false}
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
        
        <div className={classes.scrollbar}
          style={{height: props.height * 39  / 100}}
        >
          <Collapse in={open}>
            <Alert severity="warning">
              {message}
            </Alert>
          </Collapse>
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
                      let formData = new FormData(), findType = false;
                      Object.entries(newData).forEach( key => {
                        if(key[0] !== 'tableData') {
                          formData.append( key[0], key[1] );
                        }  
                        if(key[0] == 'type') {
                          findType = true
                        }                
                      });
                      console.log('findType', findType)
                      if(findType === true) {
                        PatenTrackApi
                        .addUser( formData, props.clientID )
                        .then(res => {
                          console.log('res', res)
                          setState((prevState) => {
                            const data = [...prevState.data];
                            newData.password = '';
                            data.push(newData);
                            console.log("onRowAdd", newData);
                            resolve();
                            setOpen(false)
                            return { ...prevState, data };
                          });
                        }).catch(function (error) {
                          reject("Error while adding user")
                          setOpen(true)
                          setMessage("Error while adding user");
                        })
                      } else {
                        reject("Please select type of user")
                        setOpen(true)
                        setMessage("Please select type of user");
                      }  
                    }  else {
                      reject();
                      setOpen(true)
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
