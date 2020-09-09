import React, { useState, useEffect  }  from 'react';
import {connect} from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import useStyles from "./styles";
import Loader from "../Loader";
import { getPortfolioCompanies, getCompanies, setClientID, setMainCompanyChecked, setSelectedCompany, deleteCompany, deleteSameCompany, addCompany, setUsers, setSearchCompanies,setTransactionList, setEntitiesList, setAssets, setClientAssetsList,setCompanyData, getCompanyData } from "../../../actions/patenTrackActions";

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function Row(props) {
  const { row } = props;

  

  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={`${classes.mainTable}`}
        hover        
        role="checkbox"
        aria-checked={props.clientselected(row.id)}
        tabIndex={-1}
        key={`${row.id}_parent`}
        selected={props.clientselected(row.id)}
      >
        <TableCell style={{width:'30px'}}>
          <IconButton aria-label="expand row" size="small" onClick={() => props.expand(!props.open, row.id)}>
            {props.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
          </IconButton>
        </TableCell>
        <TableCell  style={{width:'30px'}}>
          <Checkbox
            checked={props.clientselected(row.id)}
            onClick={(event) => props.clientclick(event, row.id)}
            value={row.id}
            inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${props.index}` }}
          />
        </TableCell>
        <TableCell align="left" component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right" style={{paddingRight: '20px'}}></TableCell>
      </TableRow>
      <TableRow className={`${classes.mainTable}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Box style={{paddingLeft: '30px'}}>
              <Table aria-label="representatives" className={classes.childTable}>                
                <TableBody>
                  {row.children.map((company, idx) => (
                    <>
                    <TableRow key={company.id} hover
                    onClick={(event) => props.click(event, company.id, 'child')}
                    role="checkbox"
                    aria-checked={props.child(company.id)}
                    tabIndex={-1}
                    key={`${company.id}_child`}
                    selected={props.child(company.id)}
                  >
                    <TableCell style={{width:'30px'}}></TableCell>
                    <TableCell style={{width:'30px'}}>
                      <Checkbox
                        checked={props.child(company.id)}
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${idx}` }}
                        parent={row.id}
                        value={company.id}
                      />
                    </TableCell>
                    <TableCell align="left" component="th" scope="row">
                      {company.original_name}
                    </TableCell>
                    <TableCell align="right" style={{paddingRight: '20px'}} >{company.counter == null ? company.instances : company.counter}</TableCell>
                    </TableRow>
                     <TableRow className={`${classes.mainTable}`}>
                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                      <Box>
                        <Table aria-label="representatives" className={classes.childTable}>                
                          <TableBody>
                            {company.children.map((child, idx) => (
                                <TableRow key={child.id} hover                                   
                                key={`${child.id}_child`}
                                >
                                <TableCell style={{width:'30px'}}></TableCell> 
                                <TableCell style={{width:'30px'}}></TableCell>                        
                                <TableCell align="left" component="th" scope="row">
                                  {child.original_name}
                                </TableCell>
                                <TableCell align="right" style={{paddingRight: '20px'}} >{child.counter}</TableCell>
                                </TableRow>
                              ))}                            
                            </TableBody> 
                         </Table>
                      </Box> 
                      </TableCell>
                      </TableRow> 
                    </>                 
                  ))}
                </TableBody> 
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function Companies(props) {
  const calHeight = parseInt(props.height * 48 / 100) - 3;
  const classes = useStyles();
  
  const [order, setOrder] = React.useState('asc');

  const [orderBy, setOrderBy] = React.useState('name');

  const [selectedClient, setSelectedClient] = React.useState(0); 

  const [selected, setSelected] = React.useState([]); 

  const [childselected, setChildSelected] = React.useState([]); 

  const [selection, setSelection] = useState([]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    setSelected([]);
    if(props.companiesList && props.companiesList.length > 0 ){
      setRows(props.companiesList);
    }    
  },[props.companiesList]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const [open, setOpen] = React.useState(false);


  const [expandID, setExpandID] = React.useState(0);

  /**
   * 
   * @param {o} for open or close 
   * @param {clientID} client account 
   */

  const findClientPortfolios = (o, clientID) => {
    setOpen(o);
    
    if(o === true) {
      setExpandID(clientID);
      const companyIndex = rows.findIndex(x => x.id == clientID);
      if(rows[companyIndex].children.length == 0) {
        props.getPortfolioCompanies(clientID);
      }
    } else {
      setExpandID(0);
    }
  }

  

  const updateSelection = (d) => {
    if(d.length > 0) {
      const newValue = [d[d.length-1]];
      setSelection(newValue);
      props.setMainCompanyChecked( true );
      props.setSelectedCompany(newValue[0]);      
    } else {
      setSelection(d);
      props.setMainCompanyChecked( false );
      props.setSelectedCompany( "" );
    }    
  };

  const deleteCompany = () => {
    console.log("selected", selected);
    console.log("childselected", childselected);
    if(childselected.length > 0 || selected.length > 0) {
      if (window.confirm('Are you sure you want to delete')) {
        if(childselected.length > 0) {
          props.deleteSameCompany( childselected.join(',') );
          setChildSelected([]);
        }
        console.log("selection", selection);
        if(selected.length > 0) {
          props.deleteCompany(selection.join(','));
          props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" );
          setSelected([]);
        } 
      } 
    } else {
      alert("Please select company first.");
    }
      
    
    /*
    if(selection.length > 0) {
      if (window.confirm(`Are you sure you want to ${selection[0]}`)) {
        let findCompany = rows.filter(n => (n.name == selection[0] && n.name != n.parent)? n : undefined);
        console.log(selection, findCompany);
        if(findCompany.length == 0) {
          props.deleteCompany(selection[0]);
          props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" );
        } else {
          props.deleteSameCompany( selection[0], findCompany[0].parent );
          props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" );
        }        
      }
    }*/
  }

  const resetAll = () => {
    props.setSearchCompanies([]);
    props.setEntitiesList(1, []);
    props.setTransactionList({list: [], type: [], assignment_type: []});
    props.setAssets({});
    props.setClientAssetsList([]);  
    props.setUsers([]);  
    props.setCompanyData({});
  }

  const handleClientSelect = (event, ID) => {
    if(event.target.checked === false) {
      ID = 0;      
    }
    resetAll();
    props.setClientID(ID);
    setSelectedClient(ID);
    if(ID > 0) {
      props.getCompanyData(ID);
    }
  }



  const handleClick = (event, id, type) => {
    if(type == 'parent'){
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];

      if (selectedIndex === -1) {
        console.log("1");
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        console.log("2");
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        console.log("3");
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        console.log("4");
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }    
      updateSelection([event.target.value]); 
      console.log("asdas", newSelected)    
      setSelected(newSelected);
    } else {
      let newSelected = [];
      const selectedIndex = childselected.indexOf(id);
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(childselected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(childselected.slice(1));
      } else if (selectedIndex === childselected.length - 1) {
        newSelected = newSelected.concat(childselected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          childselected.slice(0, selectedIndex),
          childselected.slice(selectedIndex + 1),
        );
      }
      setChildSelected(newSelected);
    }
    
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSelectedClient = (id) => selectedClient == id;
  const isChildSelected = (id) => childselected.indexOf(id) !== -1;

  const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'counter', numeric: true, disablePadding: false, label: 'Assignments' },
  ];

  return (
    <div
      className     = {classes.nestedTree}
      style={{height: calHeight}}
    >
      <div className={classes.container}>
        <div className={classes.context} >
          <span className={classes.heading}>{'Clients'} </span>
        {
            props.isLoading
            ?
            <Loader/>
            :            
            <TableContainer component={Paper}>
              <Table stickyHeader aria-label="collapsible table" className={classes.mainTable}>
                <TableHead>
                  <TableRow>
                  <TableCell align="center" style={{width:'30px'}}><DeleteOutline onClick={deleteCompany} className={classes.delete}/></TableCell>
                  <TableCell padding="checkbox" style={{width:'30px'}}></TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Assignments</TableCell>
                </TableRow>                   
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <Row key={row.name} row={row} index={index} open={expandID == row.id ? true : false} expand={findClientPortfolios} clientclick={handleClientSelect} click={handleClick} clientselected={isSelectedClient} selected={isSelected} child={isChildSelected} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
    companiesList: state.patenTrack.clientsData,
    isLoading: state.patenTrack.companyListLoading,
    main_company_selected: state.patenTrack.main_company_selected,
    main_company_selected_name: state.patenTrack.main_company_selected_name,
    searchCompaniesSelected: state.patenTrack.search_companies_selected
  };
};

const mapDispatchToProps = {
  getPortfolioCompanies,
  getCompanies,
  setClientID,
  setMainCompanyChecked,
  setSelectedCompany,
  deleteCompany,
  deleteSameCompany,
  addCompany,
  setUsers,
  setSearchCompanies,
  setTransactionList,
  setEntitiesList,
  setAssets,
  setClientAssetsList,
  setCompanyData,
  getCompanyData
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
