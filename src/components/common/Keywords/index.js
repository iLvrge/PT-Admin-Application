import React, { useState, useEffect, forwardRef  } from 'react';
import {connect} from 'react-redux';
import useStyles from "./styles";
import MaterialTable from 'material-table';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import { Grid } from '@material-ui/core';
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


import { postKeyword, updateKeyword, deleteKeyword, getSuperKeywordList, postSuperKeyword, updateSuperKeyword, deleteSuperKeyword, getStateList, postState, updateState, deleteState } from "../../../actions/patenTrackActions";

function Keywords(props) {
  const classes = useStyles();
  const [keywordState, setKeywordState] = useState([]);
  const [superKeywordState, setSuperKeywordState] = useState([]);
  const [stateKeywordState, setStateKeywordState] = useState([]);
  const [open, setOpen] = useState(false);
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
    maxBodyHeight: props.height * 85  / 100,
    addRowPosition: 'first',
    toolbarButtonAlignment: 'left'
  };

  const [message, setMessage] = useState("");

    useEffect(() => {
        if( props.keywords.length > 0 ) {
          setKeywordState({
            columns: [{field: 'keyword', title: 'Keyword', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}}],
            data: props.keywords
          });
        } 
        
        if (props.super_keywords.length > 0 ) {
          setSuperKeywordState({
            columns: [{field: 'keyword', title: 'Super Keyword', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}}],
            data: props.super_keywords
          });
        }  
        
        if (props.state_keywords.length > 0 ) {
          setStateKeywordState({
            columns: [{field: 'keyword', title: 'State', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}}],
            data: props.state_keywords
          });
        }
        
    },[props.keywords, props.super_keywords, props.state_keywords]);

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
            <Grid container style={{flexGrow: 1}} >
            <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}
            >
              <div className={classes.scrollbar}
              style={{height: props.height * 85  / 100}}
              >
                {
                  props.keywords.length > 0
                  ?
                  <MaterialTable
                    localization={{ 
                      header: {
                        actions: '#'
                      }
                    }}
                    title=""
                    icons={tableIcons}
                    columns={keywordState.columns}
                    data={keywordState.data}
                    options={options}
                    editable={{
                      onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                          if(newData.keyword !== "" && newData.keyword != null) {
                            let formData = new FormData();
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                formData.append( key[0], key[1] );
                              }                  
                            });
                            props.postKeyword(formData, props.clientID);
                            setTimeout(() => {
                              resolve();
                              setKeywordState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                console.log("onRowAdd", newData);
                                return { ...prevState, data };
                              });
                            }, 600);
                          }  else {
                            reject();
                            console.log("Keyword name cannot be empty.");
                            setMessage("Keyword name cannot be empty.");
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
                            let editKeywordID = 0;
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                if(key[0] === 'id') {
                                  editKeywordID = key[1];
                                } else {
                                  formData.append( key[0], key[1] );
                                }                          
                              }                  
                            });
                            if (editKeywordID > 0) {
                              props.updateKeyword(formData, editKeywordID);
                              setTimeout(() => {
                                resolve();
                                if (oldData) {
                                  setKeywordState((prevState) => {
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
                          if(oldData.id > 0) {
                            props.deleteKeyword( oldData.id );    
                            setTimeout(() => {
                              resolve();
                              setKeywordState((prevState) => {
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
                  :
                  
                  ''
                }
              </div>
            </Grid>
            <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}
            >
              <div className={classes.scrollbar}
              style={{height: props.height * 85  / 100}}
              >
                {
                  props.super_keywords.length > 0
                  ?
                  <MaterialTable
                    localization={{ 
                      header: {
                        actions: '#'
                      }
                    }}
                    title=""
                    icons={tableIcons}
                    columns={superKeywordState.columns}
                    data={superKeywordState.data}
                    options={options}
                    editable={{
                      onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                          if(newData.keyword !== "" && newData.keyword != null) {
                            let formData = new FormData();
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                formData.append( key[0], key[1] );
                              }                  
                            });
                            props.postSuperKeyword(formData, props.clientID);
                            setTimeout(() => {
                              resolve();
                              setSuperKeywordState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                console.log("onRowAdd", newData);
                                return { ...prevState, data };
                              });
                            }, 600);
                          }  else {
                            reject();
                            console.log("Keyword name cannot be empty.");
                            setMessage("Keyword name cannot be empty.");
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
                            let editKeywordID = 0;
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                if(key[0] === 'id') {
                                  editKeywordID = key[1];
                                } else {
                                  formData.append( key[0], key[1] );
                                }                          
                              }                  
                            });
                            if (editKeywordID > 0) {
                              props.updateSuperKeyword(formData, editKeywordID);
                              setTimeout(() => {
                                resolve();
                                if (oldData) {
                                  setSuperKeywordState((prevState) => {
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
                          if(oldData.id > 0) {
                            props.deleteSuperKeyword( oldData.id );    
                            setTimeout(() => {
                              resolve();
                              setSuperKeywordState((prevState) => {
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
                  :
                  
                  ''
                }
              </div>
            </Grid>
            <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}
            >
              <div className={classes.scrollbar}
              style={{height: props.height * 85  / 100}}
              >
                {
                  props.state_keywords.length > 0
                  ?
                  <MaterialTable
                    localization={{ 
                      header: {
                        actions: '#'
                      }
                    }}
                    title=""
                    icons={tableIcons}
                    columns={stateKeywordState.columns}
                    data={stateKeywordState.data}
                    options={options}
                    editable={{
                      onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                          if(newData.keyword !== "" && newData.keyword != null) {
                            let formData = new FormData();
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                formData.append( key[0], key[1] );
                              }                  
                            });
                            props.postState(formData, props.clientID);
                            setTimeout(() => {
                              resolve();
                              setStateKeywordState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                console.log("onRowAdd", newData);
                                return { ...prevState, data };
                              });
                            }, 600);
                          }  else {
                            reject();
                            console.log("Keyword name cannot be empty.");
                            setMessage("Keyword name cannot be empty.");
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
                            let editKeywordID = 0;
                            Object.entries(newData).forEach( key => {
                              if(key[0] !== 'tableData') {
                                if(key[0] === 'id') {
                                  editKeywordID = key[1];
                                } else {
                                  formData.append( key[0], key[1] );
                                }                          
                              }                  
                            });
                            if (editKeywordID > 0) {
                              props.updateState(formData, editKeywordID);
                              setTimeout(() => {
                                resolve();
                                if (oldData) {
                                  setKeywordState((prevState) => {
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
                          if(oldData.id > 0) {
                            props.deleteState( oldData.id );    
                            setTimeout(() => {
                              resolve();
                              setKeywordState((prevState) => {
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
                  :
                  
                  ''
                }

              </div>
            </Grid>
            </Grid>
          </div>
        </div>
      );

}

const mapStateToProps = state => {
    return {
        width: state.patenTrack.screenWidth,
        height: state.patenTrack.screenHeight        
    };
};
  
const mapDispatchToProps = {
    postKeyword,
    updateKeyword,
    deleteKeyword,
    getSuperKeywordList,
    postSuperKeyword,
    updateSuperKeyword,
    deleteSuperKeyword,
    getStateList, 
    postState, 
    updateState, 
    deleteState
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Keywords);