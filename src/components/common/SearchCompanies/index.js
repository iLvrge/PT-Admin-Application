import React, { useState, useRef, forwardRef  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import TextField from '@material-ui/core/TextField';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Loader from "../Loader";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import HTMLTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import MaterialTable from 'material-table';
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

import {SortingState, IntegratedSorting, SelectionState, } from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  VirtualTable,
  TableColumnResizing 
} from "@devexpress/dx-react-grid-material-ui";

import { searchCompany, addCompany, setSearchCompanies, setSearchCompanyLoading, cancelRequest, setSelectedSearchCompanies, setMainCompanyChecked, setSelectedCompany, updateNormalizeEntites, assignmentUpdate, updateEntitiesFlag  } from "../../../actions/patenTrackActions";

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
  mainTable: {
    '& table': {
        border: 0,
        '& th': {
            border: '0 !important'
        },
        '& td': {
            border: '0 !important'
        }
    }        
  }
});

function SearchCompanies(props) {
  const classes = useStyles();
  const inputEl = useRef(null);
  const [checked, setChecked] = useState([]);
  const [timeInterval, setTimeInterval] =  useState( null );
  const [cancelTokenSource, setCancelTokenSource] = useState("");
  const WAIT_INTERVAL = 200;

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
    console.log("newChecked", newChecked);
    if(newChecked.length > 0) {
      newChecked.map( company => {
        let form = new FormData();
        form.append("name", company);
        if(props.main_company_selected === true) {
          form.append("parent_company", props.main_company_selected_name);
        }
        props.addCompany(form);
      })
    }
  };
  

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

  const [sorting, getSorting] = useState([]);

  const [rows, setRows] = useState([]);

  const [entitiesrow, setEntitesRow] = useState([]);

  const [transactionrow, setTransactionRow] = useState([]);

  const [conveyanceType, setConveyanceType] = useState({});

  const [normalizename, setCopiedName] = useState('');

  const [entityrowselection, setEntityRowSelection] = useState([]);

  const [entityselectionnames, setEntityRowSelectionNames] = useState([]);

  const [selection, setSelection] = useState([]);

  const [open, setOpen] = useState(false);

  const [ctrlkey, setCntrlKey] = useState(false);

  const [state, setState] = useState([]);

  React.useEffect(() => {
    if(props.searchCompanies && props.searchCompanies.length > 0 ){      
      setEntitesRow([]);
      setTransactionRow([]);
      setRows(props.searchCompanies);
    } 

    if(props.entities_list && props.entities_list.length > 0) {
      setRows([]);
      setTransactionRow([]);
      setEntitesRow(props.entities_list);
    }
    if(props.transaction_list && props.transaction_list.list.length > 0) {
      setRows([]);
      setEntitesRow([]);
      setTransactionRow(props.transaction_list.list);
      setConveyanceType(props.transaction_list.assignment_type);
      const columns = [
        { field: 'text', title: 'Conveyance Text', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}, editable: 'never'  },
        { field: 'reel_frame', title: 'Reel/Frame', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}, editable: 'never' },
        { field: 'counter', title: 'Occurences', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}, editable: 'never' },
        { field: 'convey_ty', title: 'Type', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}, editable: 'never' },
        { field: 'updated_convey_ty', title: 'Update', cellStyle:{width: 'auto'}, headerStyle:{width: 'auto'}, lookup: props.transaction_list.assignment_type}        
      ];
      setState({
        columns: columns,
        data: props.transaction_list.list
      });
    }
    

  },[props.searchCompanies, props.entities_list, props.transaction_list]);

  const CopyCell = ({ row, column, ...restProps }) =>
  column.name === "copy" ? (
    <Table.Cell>
      <Button
        onClick={() => {
          handleCopyCompany(1, row);
        }}
      >
        <i className={"fa fa-copy"}></i>
      </Button>
    </Table.Cell>
  ) : column.name === "paste" ? (
    <Table.Cell>
      <Button
        onClick={() => {
          handlePasteCompany(row);
        }}
      >
        <i className={"fa fa-paste"}></i>
      </Button>
    </Table.Cell>
  ) : column.name === "copy1" ? (
    <Table.Cell>
      <Button
        onClick={() => {
          handleCopyCompany(2, row);
        }}
      >
        <i className={"fa fa-copy"}></i>
      </Button>
    </Table.Cell>
  ) : column.name === "delete" ? (
    <Table.Cell>
      <Button
        onClick={() => {
          handleDelete(row);
        }}
      >
        <i className={"far fa-trash"}></i>
      </Button>
    </Table.Cell>
  ) : (
    <Table.Cell row={row} column={column} {...restProps} />
  );

  const [gridColumns] = useState([
    { name: "name", title: "Name" },
    { name: 'copy', title: ' ' },
    { name: "counter", title: "Occurences", align: 'center'},
    { name: "total_occurences", title: "Total Occurences", align: 'center'},
    { name: 'paste', title: ' ' },
    { name: "normalize_name", title: "Normalize"},
    { name: 'copy1', title: ' ' },
    { name: 'delete', title: ' ' },
  ]);

  const [defaultColumnWidths] = useState([
    { columnName: 'name', width: 350 },
    { columnName: 'copy', width: 50 },
    { columnName: 'counter', width: 140},
    { columnName: 'total_occurences', width: 170 },
    { columnName: 'paste', width: 50 },
    { columnName: 'normalize_name', width: 300 },
    { columnName: 'copy1', width: 50 },
    { columnName: 'delete', width: 50 },
  ]);

  const handleSearchCompany = (event) => {    
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setSelection([]);
      if(inputEl.current.querySelector("#search_company").value.length > 2) {
        props.searchCompany(inputEl.current.querySelector("#search_company").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setSearchCompanies( [] );
        props.cancelRequest();
      }      
    }, WAIT_INTERVAL));  
  }

  const getRowId = row => row.id;

  const handleFlag = () => {
    if(props.clientID > 0) {
      if(props.flag < 2) {
        if(entityselectionnames.length > 0) {
          const selectedNames = [...entityselectionnames];
          let formData = new FormData();
          selectedNames.forEach(c => {
            formData.append( 'inventors', c );
          });          
          formData.append( 'flag', props.flag );
          props.updateEntitiesFlag(formData, props.clientID, props.flag);
          setTimeout(() => {
            setEntityRowSelection([]);  
            setEntityRowSelectionNames([]);
          }, 500);
        } else {
          alert("Please select entities from the list.");
        }        
      }
    } else {
      alert("Please select client first.");
    } 
  }

  /*const updateSelection = (d) => {
    if(d.length > 0) {
      const newValue = [d[d.length-1]];
      setSelection(newValue);
      addCompany(newValue[0]);
    } else {
      setSelection(d);
    }    
  };*/

  const updateEntityRowSelection = (event, ID) => {
    let selectedRows = [...entityrowselection];
    let selectedNames = [...entityselectionnames];
    event.stopPropagation();    
    if(entityrowselection.indexOf(ID) < 0) {
      console.log("CHECKED");      
      if (event.ctrlKey) {
        console.log("ctrl key press");
        if(ctrlkey === true) {
          const lastID = selectedRows[selectedRows.length - 1];
          const previousIndex = entitiesrow.findIndex(r => r.id == lastID);
          const currentIndex = entitiesrow.findIndex(r => r.id == ID);
          console.log(previousIndex +","+ currentIndex);
          if(previousIndex > currentIndex) {
            /***Bottom to top */
            console.log("Bottom to top");
            entitiesrow.forEach((r, index) => {
              if(index >= currentIndex && index <= previousIndex) {
                selectedRows.push(r.id);
                selectedNames.push(r.name);
              }
            });
          } else {
            /***Top to bottom */
            console.log("Top to bottom");
            entitiesrow.forEach((r, index) => {
              if(index >= previousIndex && index <= currentIndex) {
                selectedRows.push(r.id);
                selectedNames.push(r.name);
              }
            });
          }
        } else {
          selectedRows.push(ID);
          const currentIndex = entitiesrow.findIndex(r => r.id == ID);
          selectedNames.push(entitiesrow[currentIndex].name);
          setCntrlKey(true);
        }
      } else {
        selectedRows.push(ID);
        const currentIndex = entitiesrow.findIndex(r => r.id == ID);
        console.log(ID, currentIndex);
        selectedNames.push(entitiesrow[currentIndex].name);
        setCntrlKey(false);
      }
    } else {
      console.log("CHECKED FALSE");
      const currentIndex = entitiesrow.findIndex(r => r.id == ID);
      selectedRows.splice(currentIndex, 1);
      selectedNames.splice(currentIndex, 1);
    }
    setEntityRowSelection(selectedRows);  
    setEntityRowSelectionNames(selectedNames);
  }

  const updateSelection = (d) => {
    console.log("setSelectedSearchCompanies", d, typeof d);
    setSelection(d);
    
  }

  const handleCopyCompany = (t, row) => {
    const normalizeName = t == 1 ? row.name : row.normalize_name;
    console.log(normalizeName);
    setCopiedName(normalizeName);
  }

  const handlePasteCompany =  row  => {
    if(normalizename != undefined) {
      
      if(selection == undefined) {
        console.log("No selection", [row.name]);
        setSelection([row.id]);
        setEntityRowSelectionNames([row.name]);
        updateEntityData([row.name], normalizename);
        updateSelectedRows([row.id], normalizename);
      } else {
        let oldSelection = [...selection];
        
        if(oldSelection.indexOf(row.id) < 0) {
          oldSelection.push(row.id);
        }
        console.log(oldSelection);
        setSelection(oldSelection);

        if(oldSelection.length > 0) {          
          let selectedNames = [];
          const promises = oldSelection.map( ID => {
            let name = "";
            rows.some( row => {
              if(row.id == ID) {
                name = row.name;
                return true;
              }
              return false;
            });        
            if(name != "") {
              if(selectedNames.indexOf(name) < 0) {
                selectedNames.push(name);
              }
            }
            return ID;        
          });
          (async () => {
            await Promise.all(promises);
            setEntityRowSelectionNames(selectedNames);
            updateEntityData(selectedNames, normalizename);
            updateSelectedRows(oldSelection, normalizename);
          })();
        }        
      }      
    }
    console.log('handlePaste', normalizename);
  }

  const updateSelectedRows = (IDs, normalizeName) => {
    let oldRows = [...rows];
    const promises = IDs.map( ID => {
      oldRows.some( (c, index) => {
        if(c.id == ID) {
          oldRows[index].normalize_name = normalizeName;
          return true;
        }
        return false;
      });
      return ID;
    });
    (async () => {
      await Promise.all(promises);
      setSelection([]);
      setEntityRowSelectionNames([]);
      setCopiedName("");
      setRows(oldRows);
    })();
  }

  const options = {
    paging: false,
    search: false,
    maxBodyHeight: props.height * 39  / 100,
    addRowPosition: 'first',
    toolbarButtonAlignment: 'left'
  };

  

  function Row(props) {
    const { row } = props;
  
    const [open, setOpen] = React.useState(true);
  
    const classes = useRowStyles();
  
    return (
      <React.Fragment>
        <TableRow className={`${classes.mainTable}`}
          hover        
          role="checkbox"
          aria-checked={props.selected(row.id)}
          tabIndex={-1}
          key={`${row.id}_parent`}
          selected={props.selected(row.id)}
        >
          <TableCell style={{width:'30px'}}>
            {
              row.children.length > 0 
              ?
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
              :
              ''
            }
          </TableCell>
          <TableCell  style={{width:'30px'}}>
            <Checkbox
              checked={props.selected(row.id)}
              onClick={(event) => props.click(event, row.id)}
              value={row.id}
              inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${props.index}` }}
            />
          </TableCell>
          <TableCell align="left" component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell align="right" style={{paddingRight: '20px'}}>{row.counter == null ? row.instances : row.counter}</TableCell>
        </TableRow>
        {
          row.children.length > 0
          ?
          <TableRow className={`${classes.mainTable}`}>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box style={{paddingLeft: '30px'}}>
                  <Table aria-label="representatives" className={classes.childTable}>                
                    <TableBody>
                      {row.children.map((company, idx) => (
                        <TableRow key={company.id} hover
                        tabIndex={-1}
                        key={`${company.id}_child`}
                      >
                        <TableCell style={{width:'30px'}}></TableCell>
                        <TableCell style={{width:'30px'}}></TableCell>
                        <TableCell align="left" component="th" scope="row">
                          {company.name}
                        </TableCell>
                        <TableCell align="right" style={{paddingRight: '20px'}} >{company.counter}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody> 
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>  
          :
          ''
        }              
      </React.Fragment>
    );
  }

  const handleCopy = (t, rowID) => {
    console.log(rowID);
    let findIndex = findRowIndex(rowID);
    if(findIndex >= 0) {
      const selectedRow = entitiesrow[findIndex];
      const normalizeName = t == 1 ? selectedRow.name : selectedRow.normalize_name;
      console.log('asdasd',normalizeName);
      setCopiedName(normalizeName);
    } else {
      setCopiedName('');
    }
  }

  const findRowIndex = (rowID) => {
    let findIndex = -1;
    entitiesrow.forEach((r, index)=> {
      if(r.id === rowID) {
        findIndex = index;
        return;
      }
    });
    return findIndex;
  }

  const handlePaste = (ID) => {
    console.log('handlePaste', ID);
    let selectedNames = [...entityselectionnames];
    let entityTableRows = [...entitiesrow];
    console.log('selectedRows', selectedNames);
    console.log('normalizename', normalizename);
    if(normalizename != "") {
      if(selectedNames.length > 0) {
        updateEntityData(selectedNames, normalizename);
        let selectedRows = [...entityrowselection];
        selectedRows.forEach( id => {
          let findIndex =  findRowIndex(id);
          entityTableRows[findIndex].normalize_name = normalizename;
        })
        setEntitesRow(entityTableRows);        
      } else {
        let findIndex  = findRowIndex(ID);
        console.log("PASTE INDEX", findIndex);
        if(findIndex >= 0) {
          selectedNames.push(entityTableRows[findIndex].name);
          setCntrlKey(false);
          updateEntityData(selectedNames, normalizename);
          entityTableRows[findIndex].normalize_name = normalizename;
          setEntitesRow(entityTableRows);
        }
      }      
    } else {
      alert("Please select normalize company first");
    }
  }

  const updateEntityData = (selectedNames, normalizename) => {
    if(selectedNames.length > 0) {
      selectedNames.forEach( name => {
        let formData = new FormData();
          formData.append('name', name );
          formData.append('normalize_name', normalizename );
          props.updateNormalizeEntites(formData);
      })
    }    
  }

  const handleDelete = (rowID) => {
    console.log("Delete row");
  }

  function Entites (props) {
    const { row } = props;
    return (
      <React.Fragment>
        <TableRow className={props.selected(row.id) ? classes.selected : ''}
          hover    
          role="checkbox"
          tabIndex={-1}
          key={`${row.id}`}
          
        >
          <TableCell 
            aria-checked={props.selected(row.id)}
            onClick = {(event) => {props.entityClick(event, row.id)}}
            selected={props.selected(row.id)}
          >
            {row.name}
          </TableCell>
          <TableCell  style={{width:'30px'}}>
            <IconButton
              color             = "inherit"
              aria-haspopup     = "true"
              onClick           = {() => {handleCopy(1, row.id)}}
            >
              {
                <i className={"fa fa-copy"} title="Copy"></i>
              }
            </IconButton>
          </TableCell>
          <TableCell align="center" style={{width:'70px'}}>
            {
              row.counter
            }
          </TableCell>
          <TableCell align="center" style={{width:'150px'}}>
            {
              row.total_occurences != null && row.total_occurences != 'undefined' ? row.total_occurences : ''
            }
          </TableCell>
          <TableCell  style={{width:'30px'}}>
            <IconButton
              color             = "inherit"
              aria-haspopup     = "true"
              onClick           = {() => {handlePaste(row.id)}}
            >
              {
                <i className={"fa fa-paste"} title="Paste"></i>
              }
            </IconButton>
          </TableCell>
          <TableCell>
            {
              row.normalize_name
            }
          </TableCell>
          <TableCell  style={{width:'30px'}}>
            <IconButton
              color             = "inherit"
              aria-haspopup     = "true"
              onClick           = {() => {handleCopy(2, row.id)}}
            >
              {
                <i className={"fa fa-copy"} title="Copy"></i>
              }
            </IconButton>
          </TableCell>
          <TableCell  style={{width:'30px'}}>            
            <IconButton
              color             = "inherit"
              aria-haspopup     = "true"
              onClick           = {() => {handleDelete(row.id)}}
            >
              {
                <i className={"fad fa-trash"} title="Delete"></i>
              }
            </IconButton>
          </TableCell>
        </TableRow>              
      </React.Fragment>
    );
  }

  const isSelected = (id) => {
    if(selection.length > 0) {
      return selection.indexOf(id) !== -1;
    } else {
      return false;
    }
  }

  const isSelectedEntityRow = (id) => entityrowselection.indexOf(id) !== -1;

  return (
    <div
      className={classes.searchContainer}
    >
      <div
        className={classes.container}
      >
         <div className={classes.context}>
          <Collapse in={open}>
            <Alert severity="warning">
              Please select a parent company first
            </Alert>
          </Collapse>
          <form noValidate autoComplete="off" className={classes.form}>
            <TextField id="search_company" name="search_company" ref={inputEl} label="Enter a Company Name to Search" onChange={handleSearchCompany}/>
            <span className={classes.spanAbsolute}>{props.searchCompanies.length > 0 ? props.searchCompanies.length.toLocaleString() : ''}</span>
            <a onClick={handleFlag} title="Flag" className={`${classes.iconAbsolute}`}><i className={"far fa-layer-plus"}></i> Flag</a> 
          </form>
          <div className={`search-list ${classes.scrollbar}`} >
            {
              props.isLoading
              ?
              <Loader/>
              :
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 20,
                  maxScrollbarLength: 25
                }}
              >
                {
                  props.searchCompanies.length > 0
                  ?  
                  <Paper style={{ height: props.height - 157 }}>
                      <Grid
                        rows={rows}
                        columns={gridColumns}
                        getRowId={getRowId}
                      >
                        <SelectionState
                          selection={selection}
                          onSelectionChange={updateSelection}
                        />
                        <SortingState
                          defaultSorting={[]}
                          sorting={sorting}
                          onSortingChange={getSorting}
                        />          
                        <IntegratedSorting />  
                        <VirtualTable height={props.height - 157} cellComponent={CopyCell}/> 
                        <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                        <TableHeaderRow showSortingControls/>
                        <TableSelection
                          selectByRowClick
                        />
                      </Grid>
                    </Paper>
                  :
                  ''
                }
                {
                  props.entities_list.length > 0
                  ?
                  <Paper style={{ height: props.height - 157 }}>
                    <HTMLTable stickyHeader aria-label="collapsible table" className={classes.mainTable}>
                      <TableHead>
                        <TableRow>                        
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left" className={classes.paddingRight20}>Occurences</TableCell>
                        <TableCell align="left" className={classes.paddingRight20}>Total Occurences</TableCell>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left" className={classes.paddingRight20}>Normalize</TableCell>
                        <TableCell align="left" className={classes.paddingRight20}></TableCell>
                        <TableCell align="left" className={classes.paddingRight20}></TableCell>
                      </TableRow>                   
                      </TableHead>
                      <TableBody>
                        {entitiesrow.map((row, index) => (
                          <Entites key={row.id} row={row} index={index} entityClick={updateEntityRowSelection} selected={isSelectedEntityRow} />
                        ))}
                      </TableBody>
                    </HTMLTable>
                  </Paper>
                  :
                  ''
                }
                {
                  props.transaction_list.list.length > 0
                  ?
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
                      onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        if(oldData) {
                          
                          let conveyText = "";
                          Object.entries(conveyanceType).forEach(key => {
                            if(key[0] == newData.updated_convey_ty){
                              conveyText = key[1];
                            }
                          })
                                                
                          if (conveyText  != "" ) {
                            let formData = new FormData();
                            formData.append("text", oldData.text );
                            formData.append("updated_convey_ty", conveyText);
                            formData.append("rf_id", oldData.id ); 
                            props.assignmentUpdate(formData, props.clientID)
                            setTimeout(() => {
                              resolve();
                              setState((prevState) => {
                                const data = [...prevState.data];
                                const index = oldData.tableData.id;
                                data[index] = newData;
                                console.log("onRowUpdate", newData);
                                return { ...prevState, data };
                              });
                            }, 600);
                          }
                        }                    
                      }),
                    }}
                    />
                  :
                  ''
                }
              </PerfectScrollbar>
            }
          </div>
        </div> 
      </div>
    </div>
  );
}

const mapStateToProps = state => {
    return {
      width: state.patenTrack.screenWidth,
      height: state.patenTrack.screenHeight,
      isLoading: state.patenTrack.searchCompanyLoading,
      clientID: state.patenTrack.clientID,
      flag: state.patenTrack.flag,
      searchCompanies: state.patenTrack.searchCompanies,
      entities_list: state.patenTrack.entities_list,
      transaction_list: state.patenTrack.transaction_list,
      main_company_selected: state.patenTrack.main_company_selected,
      main_company_selected_name: state.patenTrack.main_company_selected_name
    };
  };
  
  const mapDispatchToProps = {
    searchCompany,
    addCompany,
    setSearchCompanyLoading,
    setSearchCompanies,
    setSelectedSearchCompanies,
    setMainCompanyChecked,
    setSelectedCompany,
    updateNormalizeEntites,
    assignmentUpdate,
    updateEntitiesFlag,
    cancelRequest
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchCompanies);