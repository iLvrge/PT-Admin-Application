import React, { useState, useEffect, forwardRef  } from 'react';
import {connect} from 'react-redux';
import useStyles from "./styles";
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
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


import { getAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser } from "../../../actions/patenTrackActions";

function AdminUsers(props) { 
  const classes = useStyles();
  const [state, setState] = useState([]);
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
    maxBodyHeight: props.height * 80  / 100,
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
    if( props.userList.length > 0 ) {
      props.userList.forEach( user => {
        const record = {
          id: user.user_id,
          username: user.username, 
        };
        data.push( record );
      });
    }
    const columns = [
      { field: 'username', title: 'Username'},
    ];
    setState({
      columns: columns,
      data: data
    });
  },[props.userList]);

  return (
    <div
      className  = {classes.userItemsContainer}
    >
      <div className={classes.container}>
        <Collapse in={open}>
          <Alert severity="warning">
            {message}
          </Alert>
        </Collapse>
        <div style={{width: '100%'}}>Password: <b>123456</b> <span>URL: <a href='http://167.172.195.92:3001' target='_blank' style={{color: '#fff'}}>http://167.172.195.92:3001</a></span></div>
        <div className={classes.scrollbar}
          style={{height: props.height * 80  / 100}}
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
                    if(newData.username !== "" && newData.username != null) {
                      let formData = new FormData();
                      Object.entries(newData).forEach( key => {
                        if(key[0] !== 'tableData') {
                          formData.append( key[0], key[1] );
                        }                  
                      });
                      formData.append( 'first_name', ' ' );
                      formData.append( 'last_name', ' ' );
                      formData.append( 'password', '123456' );
                      props.addAdminUser(formData);
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
                  }),/* 
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
                        props.updateAdminUser(formData, editUserID);
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
                  }), */
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    if(oldData.id > 0) {
                      props.deleteAdminUser( oldData.id );    
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
    userList: state.patenTrack.adminUserList,
    clientID: state.patenTrack.clientID,
  };
};

const mapDispatchToProps = {
  getAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser
};

export default connect(mapStateToProps, mapDispatchToProps)(AdminUsers);
