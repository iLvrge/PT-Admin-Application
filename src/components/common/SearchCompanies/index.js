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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

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

  const WAIT_INTERVAL = 200;
  
  const [rows, setRows] = useState([]);

  const [entitiesrow, setEntitesRow] = useState([]);

  const [transactionrow, setTransactionRow] = useState([]);

  const [conveyanceType, setConveyanceType] = useState({});

  const [normalizename, setCopiedName] = useState('');

 

  const [entityrowselection, setEntityRowSelection] = useState([]);

  const [entityselectionnames, setEntityRowSelectionNames] = useState([]);

  

  const [open, setOpen] = useState(false);

  const [ctrlkey, setCntrlKey] = useState(false);

  const [state, setState] = useState([]);

  const [sortInventBy, setSortInventBy] = useState('name');
  const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC);

  React.useEffect(() => {
    if(props.searchCompanies && props.searchCompanies.length > 0 ){      
      setEntitesRow([]);
      setTransactionRow([]);
      setRows(props.searchCompanies);
      setSortInventBy('name');
    } 

    if(props.entities_list && props.entities_list.length > 0) {
      setRows([]);
      setTransactionRow([]);
      setEntitesRow(props.entities_list);
      setSortInventBy('name');
    }
    if(props.transaction_list && props.transaction_list.list.length > 0) {
      setRows([]);
      setEntitesRow([]);
      setTransactionRow(props.transaction_list.list);
      setConveyanceType(props.transaction_list.type);
      setSortInventBy('text');
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

  
  const handleSearchCompany = (event) => {    
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setEntityRowSelection([]);
      if(inputEl.current.querySelector("#search_company").value.length > 2) {
        props.searchCompany(inputEl.current.querySelector("#search_company").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setSearchCompanies( [] );
        props.cancelRequest();
      }      
    }, WAIT_INTERVAL));  
  }

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

  const sort = ({ sortBy, sortDirection }) => {
    setSortInventBy(sortBy);
    setSortInventDirection(sortDirection);

    let newItems = entitiesrow.length > 0 ? [...entitiesrow] : transactionrow.length > 0 ? [...transactionrow] : [...rows];
    newItems.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    if(entitiesrow.length > 0) {
      setEntitesRow(newItems);
    } else if(transactionrow.length > 0){
      setTransactionRow(newItems);
    } else {
      setRows(newItems);
    }    
  }

  const selectRows = (event, entityName, rowIndex) => {

    let selectedNames = [...entityselectionnames];
    let oldSelection = [...entityrowselection];  
    const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rows];
    event.stopPropagation();   
    console.log(event.target.checked);
    if(event.target.checked) {
      if(selectedNames.indexOf(entityName) < 0) {
        selectedNames.push(entityName);
        oldSelection.push(oldItems[rowIndex]['id']);
      }
    } else {
      const findIndex = selectedNames.indexOf(entityName);
      if(findIndex >= 0){
        selectedNames.splice(findIndex, 1);
        oldSelection.splice(findIndex, 1);
      } 
    }
    setEntityRowSelectionNames(selectedNames);
    setEntityRowSelection(oldSelection);
  }

  const handleCopy = (event, entityName) => {
    event.stopPropagation();
    setCopiedName(entityName);
  }

  const handlePaste = (entityName, rowIndex) => {
    if(normalizename != undefined) {
      let selectedNames = [...entityselectionnames];
      let oldSelection = [...entityrowselection];
      const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rows];
      if(selectedNames.indexOf(entityName) < 0) {
        selectedNames.push(entityName);
        oldSelection.push(oldItems[rowIndex]['id']);
      }
      setEntityRowSelectionNames(selectedNames);
      setEntityRowSelection(oldSelection);
      updateEntityData(selectedNames, normalizename);
      const type = entitiesrow.length > 0 ? 2 : 1
      updateSelectedRows(oldSelection, type, normalizename);
    } else {
      alert("Please select normalize entity first.");
    }
  }

  const updateSelectedRows = (oldSelection, t, normalizeName) => {
    let oldRows = t == 2 ? [...entitiesrow] : [...rows];
    console.log("oldRows", oldRows, oldSelection);
    const promises = oldSelection.map( ID => {
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
      console.log("oldRows", oldRows, oldSelection);
      await Promise.all(promises);
      setEntityRowSelection([]);
      setEntityRowSelectionNames([]);
      setCopiedName("");
      console.log("T", t);
      if(t == 2){
        setEntitesRow(oldRows)
      } else {
        setRows(oldRows);
      } 
    })();
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

  const handleDelete = (name, rowIndex) => {
    updateEntityData([name], '');
    const type = entitiesrow.length > 0 ? 2 : 1
    const deleteID = entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rows[rowIndex]['id'];
    updateSelectedRows([deleteID], type, normalizename);
  }

  const isRowSelected = rowIndex => entityrowselection.indexOf(entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rows[rowIndex]['id']) !== -1;

  const checkCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
    <Checkbox
    checked={isRowSelected(rowIndex)}
    onClick={(event) => selectRows(event, cellData, rowIndex)}
    value={cellData}
    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
    />
    )
  }

  const copyCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleCopy(event, cellData)}}
    >
      {
        <i className={"fa fa-copy"} title="Copy"></i>
      }
      </IconButton>
    )
  }

  const pasteCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handlePaste(cellData, rowIndex)}}
      >
        {
          <i className={"fa fa-paste"} title="Paste"></i>
        }
      </IconButton>
    )
  }

  const deleteCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handleDelete(cellData, rowIndex)}}
      >
        {
          <i className={"fad fa-trash"} title="Delete"></i>
        }
      </IconButton>
    )
  }

  const handleChange = (event, ID, text, rowIndex) => {
    let formData = new FormData();
    formData.append("text", text );
    formData.append("updated_convey_ty", event.target.value);
    formData.append("rf_id", ID ); 
    props.assignmentUpdate(formData, props.clientID);
    setTimeout(() => {
      let previousState = [...transactionrow];
      previousState[rowIndex].updated_convey_ty = event.target.value;
      setTransactionRow(previousState);
    }, 600);
  }

  const dropdownCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
    <Select
      value={cellData}
      onChange={(event) => handleChange(event, transactionrow[rowIndex]['id'], transactionrow[rowIndex]['text'], rowIndex)}
    >
      {conveyanceType.map((option) => (
        <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
      ))}
    </Select>
    )
  }

  const nameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
    <span className={cellData === normalizename ? classes.activeCopyRow : ''}>{cellData}</span>
    )
  }


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
                    <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={30}
                      sort={sort}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      rowCount={rows.length}           
                      rowGetter={({index}) => rows[index]}>
                      <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                      <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.09} label="Occurences" dataKey="counter" />
                      <Column width={width * 0.13} label="Total Occurences" dataKey="total_occurences" />
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {pasteCellRenderer}/>
                      <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" />
                      <Column width={width * 0.04} label="" dataKey="normalize_name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" cellRenderer= {deleteCellRenderer}/>
                    </Table>
                    )}
                    </AutoSizer>
                  </Paper>
                  :
                  ''
                }
                {
                  entitiesrow.length > 0 && (
                  <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={30}
                      sort={sort}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      rowCount={entitiesrow.length}           
                      rowGetter={({index}) => entitiesrow[index]}>
                      <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                      <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.09} label="Occurences" dataKey="counter" />
                      <Column width={width * 0.13} label="Total Occurences" dataKey="total_occurences" />
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {pasteCellRenderer}/>
                      <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" />
                      <Column width={width * 0.04} label="" dataKey="normalize_name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" cellRenderer= {deleteCellRenderer}/>
                    </Table>
                    )}
                  </AutoSizer>
                  )
                }
                {
                  props.transaction_list.list.length > 0 && (
                    <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={30}
                      sort={sort}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      rowCount={transactionrow.length}           
                      rowGetter={({index}) => transactionrow[index]}>
                      <Column width={width * 0.50} label="Conveyance Text" dataKey="text" />
                      <Column width={width * 0.10} label="Reel/Frame" dataKey="reel_frame"  />
                      <Column width={width * 0.10} label="Occurences" dataKey="counter" />
                      <Column width={width * 0.13} label="Type" dataKey="convey_ty" />
                      <Column width={width * 0.17} label="Update" dataKey="updated_convey_ty" cellRenderer= {dropdownCellRenderer}/>
                    </Table>
                    )}
                    </AutoSizer>
                  )
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