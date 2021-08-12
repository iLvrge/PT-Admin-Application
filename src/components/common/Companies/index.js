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
import { getPortfolioCompanies, getCompanies, setClientID, setMainCompanyChecked, setSelectedCompany, deleteCompany, deleteSameCompany, addCompany, setUsers, setSearchCompanies,setTransactionList, setEntitiesList, setAssets, setClientAssetsList,setCompanyData, getCompanyData, getButtonsStatus, setSearchBar, setSingleSearchBar, setUsersLoading, setPortfolios, setUploadTreeFile, getOriginalCompanyList, getUsers, setAccountUserForm } from "../../../actions/patenTrackActions";


import PatenTrackApi from "../../../api/patenTrack";

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

  const getType = (type) => {
    return type == 1 ? 'Company' : type == 2 ? 'Bank' : type == 3 ? 'Law Firm' : ''
  }

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
        <TableCell align="left" component="th" scope="row" style={{width: 500}}>
          {row.name}
        </TableCell>
        <TableCell align="right" style={{paddingRight: '20px', width: 70}}>{getType(row.organisation_type)}</TableCell>
        <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.assets}</TableCell>
        <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.no_of_transactions}</TableCell>
        <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.no_of_parties}</TableCell>
        <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.product}</TableCell>
      </TableRow>
      <TableRow className={`${classes.mainTable}`}>
        <TableCell style={{ padding: 0}} colSpan={7}>
          <Collapse in={props.open} timeout="auto" unmountOnExit>
            <Box>
              <Table aria-label="representatives" className={classes.childTable}>                
                <TableBody>
                  {row.children.map((company, idx) => (
                    
                    <TableRow key={company.representative_id} hover
                    
                    role="checkbox"
                    aria-checked={props.child(company.representative_id)}
                    tabIndex={-1}
                    key={`${company.representative_id}_child`}
                    selected={props.child(company.representative_id)}
                  >
                    <TableCell style={{width:'30px'}}></TableCell>
                    <TableCell style={{width:'30px'}}>
                      <Checkbox
                        checked={props.selected(company.representative_id)}
                        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${idx}` }}
                        parent={row.id}
                        value={company.representative_id}
                        onClick={(event) => props.click(event, row.id, company.representative_id)}
                      />
                    </TableCell>
                    <TableCell align="left" component="th" scope="row" style={{width: 500}}>
                      {company.original_name}
                    </TableCell>
                    <TableCell align="right" style={{paddingRight: '20px', width: 70}}></TableCell>
                    <TableCell align="right" style={{paddingRight: '20px', width: 100}} >{company.assets}</TableCell>
                    <TableCell align="right" style={{paddingRight: '20px', width: 100}} >{company.no_of_transactions}</TableCell>
                    <TableCell align="right" style={{paddingRight: '20px', width: 100}} >{company.no_of_parties}</TableCell>
                    <TableCell align="right" style={{paddingRight: '20px', width: 100}} >{company.product}</TableCell>
                    </TableRow>   
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
  const calHeight = parseInt( props.height ) - 75;
  const classes = useStyles();
  
  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("name");

  const [selectedClient, setSelectedClient] = useState(0); 

  const [selected, setSelected] = useState([]); 

  const [childselected, setChildSelected] = useState([]); 

  const [selection, setSelection] = useState([]);

  const [rows, setRows] = useState([]);

  const [requestSend, setRequestSend] = useState(false);

  useEffect(() => {
    setSelected([]);
    if(props.companiesList && props.companiesList.length > 0 ){
      setRows(props.companiesList)
    }    
  },[props.companiesList]);

  useEffect(() => {
    if(rows.length > 0 && requestSend === false) {
      setRequestSend(true)
      getCompanyReports()
    }
  }, [rows])
  
  const getCompanyReports = async() => {
    const items =  [...rows]

    await Promise.all(
      items.map(async (item, index) => {
        const { data } = await PatenTrackApi.getCompanyReport(items[index].id)
        if( data != null && Object.keys(data).length > 0) {
          items[index].assets = data.assets !== null ? data.assets : 0
          items[index].no_of_parties = data.no_of_parties !== null ? data.no_of_parties : 0
          items[index].no_of_transactions = data.no_of_transactions !== null ? data.no_of_transactions : 0
          items[index].product = data.product !== null ? data.product : 0
        }
      })
    )
    setRows(items)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = property => event => {
    handleRequestSort(event, property);
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
    props.setPortfolios([]);
    props.setSearchBar(true);
    props.setSingleSearchBar(false);
    props.setUploadTreeFile(false);
    props.setUsersLoading(true);
    
    
  }

  const handleClientSelect = (event, ID) => {
    if(event.target.checked === false) {
      ID = 0;      
      props.setAccountUserForm(false)
    }
    resetAll();
    props.setClientID(ID);
    setSelectedClient(ID);
    if(ID > 0) {
      props.getCompanyData(ID);
      props.getButtonsStatus(ID);
      props.getUsers(ID);
      props.setSearchBar(false);
      props.setSingleSearchBar(true);
    } 
  }



  const handleClick = (event, clientID, companyID) => {    
    console.log("handleClick", event, clientID, companyID);
    if(props.clientID != clientID) {
      props.setClientID(clientID);
      setSelectedClient(clientID);
      props.getCompanyData(clientID);
      props.getButtonsStatus(clientID);
      props.getUsers(clientID);
      props.setSearchBar(false);
      props.setSingleSearchBar(true);
    }
    let oldSelection = [...selected];
    if(event.target.checked === true) {
      oldSelection.push(companyID);
    } else if(oldSelection.indexOf(companyID) >= 0){
      oldSelection.splice(oldSelection.indexOf(companyID), 1);
    }
    
    setSelected(oldSelection);
    props.setPortfolios(oldSelection); 
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSelectedClient = (id) => selectedClient == id;
  const isChildSelected = (id) => childselected.indexOf(id) !== -1;

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
    console.log(order, orderBy);
    return order === "desc"
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
    
    return stabilizedThis.map(el => el[0]);
  }

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
                  <TableCell 
                    align="left"
                    sortDirection={orderBy === 'name' ? order : false}
                  >
                    <TableSortLabel
                          active={orderBy === 'name'}
                          direction={orderBy === 'name' ? order : "asc"}
                          onClick={createSortHandler('name')}
                    >
                      Name
                      {orderBy === 'name' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Type</TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Assets</TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Transactions</TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Parties</TableCell>
                  <TableCell align="right" className={classes.paddingRight20}>Arrows</TableCell>
                </TableRow>                   
                </TableHead>
                <TableBody>
                {stableSort(rows, getComparator(order, orderBy)).map(
                  (row, index) => {
                    return (
                    <Row key={row.name} row={row} index={index} open={expandID == row.id ? true : false} expand={findClientPortfolios} clientclick={handleClientSelect} click={handleClick} clientselected={isSelectedClient} selected={isSelected} child={isChildSelected} />
                    );
                  },
                )}
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
  setPortfolios,
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
  getCompanyData,
  getButtonsStatus,
  getOriginalCompanyList,
  setSearchBar,
  setSingleSearchBar,
  setUploadTreeFile,
  setUsersLoading,
  getUsers,
  setAccountUserForm
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
