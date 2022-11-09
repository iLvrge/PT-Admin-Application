import React, { useState, useEffect, useCallback  }  from 'react';
import {connect} from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { makeStyles } from '@material-ui/core/styles';
import {
    MenuItem,
    Paper,
    Checkbox,
    TableSortLabel,
    TableRow,
    TableHead,
    TableContainer,
    TableCell,
    TableBody,
    Table,
    IconButton,
    Collapse,
    Box,
    Select,
    Button 
  } from '@material-ui/core'; 

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import useStyles from "./styles";
import Loader from "../Loader";
import { getPortfolioCompanies, getCompanies, setClientID, setMainCompanyChecked, setSelectedCompany, deleteCompany, deleteSameCompany, addCompany, setUsers, setSearchCompanies,setTransactionList, setEntitiesList, setAssets, setClientAssetsList,setCompanyData, getCompanyData, getButtonsStatus, setSearchBar, setSingleSearchBar, setUsersLoading, setPortfolios, setUploadTreeFile, getOriginalCompanyList, getUsers, setAccountUserForm, setAssignmentList, setRawAssignment, setAddCompanyToAccountModal, setAddCompanyToAccountType, setAddCompanyToAccountGroup, setAddCompanyToAccountRepresentatives } from "../../../actions/patenTrackActions";


import PatenTrackApi from "../../../api/patenTrack";
import CompaniesList from './CompaniesList';
import { Add, AirlineSeatLegroomReducedSharp } from '@material-ui/icons';
import AddCompaniesToAccount from '../SearchCompanies/AddCompaniesToAccount';

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



function Companies(props) {
  const calHeight = parseInt( props.height ) - 75;

  const classes = useStyles();
  
  const [order, setOrder] = useState("asc");

  const [orderBy, setOrderBy] = useState("name");

  const [group, setGroup] = useState("");

  const [selectedClient, setSelectedClient] = useState(0); 

  const [selected, setSelected] = useState([]); 

  const [selectedNames, setSelectedNames] = useState([]); 

  const [childselected, setChildSelected] = useState([]); 

  const [selection, setSelection] = useState([]);

  const [rows, setRows] = useState([]);

  const [rowsInitial, setRowsInitial] = useState([]);

  const [requestSend, setRequestSend] = useState(false);

  const [childCompaniesLoading, setChildCompaniesLoading] = useState(false);

  const [headerType, setHeaderType] = useState('');

  const [organisationType, setOrganisationType] = useState([{id: 1, name: 'Company'}, {id: 2, name: 'Bank'}, {id: 3, name: 'Law Firm'}, {id: 4, name: 'University'}, {id: 5, name: 'Goverment'}])

  useEffect(() => {
    setSelected([]);
    setSelectedNames([]);
    if(props.companiesList && props.companiesList.length > 0 ){
      if(headerType != '') {
        filterCompanies(headerType, ['organisation_type'])
      } else {
        setRows(props.companiesList)
      }
      setRowsInitial(props.companiesList)
    }    
  },[props.companiesList]);

  useEffect(() => {
    if(rows.length > 0 && requestSend === false) {
      setRequestSend(true)
      getCompanyReports()
    }
  }, [rows])

  useEffect(() => {
    if((selectedClient.length == 0 || props.clientID !== selectedClient[0]) && props.clientID > 0) {
      props.setClientID(props.clientID);
      setSelectedClient(props.clientID);
      props.getCompanyData(props.clientID);
      props.getButtonsStatus(props.clientID);
      props.getUsers(props.clientID);
      props.setSearchBar(false);
      props.setSingleSearchBar(true);
    }
  }, [props.clientID])
  
  const getCompanyReports = async() => {
    const items =  [...rows]

    await Promise.all(
      items.map(async (item, index) => {
        const { data } = await PatenTrackApi.getCompanyReport(items[index].id)
        if( data != null && Object.keys(data).length > 0) {
          items[index].assets = data.assets !== null ? data.assets : 0
          items[index].share_url = (typeof data.share_url !== 'undefined' && data.share_url === 1) ? 1 : items[index].share_url
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
      setChildCompaniesLoading(true)
      setExpandID(clientID);
      const companyIndex = rows.findIndex(x => x.id == clientID);
      if(rows[companyIndex].children.length == 0) {
        props.getPortfolioCompanies(clientID, setChildCompaniesLoading);
      } else {
        setChildCompaniesLoading(false)
      }
    } else {
      setExpandID(0);
      setChildCompaniesLoading(false)
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
        console.log("selection", selected);
        if(selected.length > 0) {
          props.deleteCompany(expandID, selected);
          /* props.setMainCompanyChecked( false );
          props.setSelectedCompany( "" ); */
          setSelected([]);
          setSelectedNames([]);
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

  const addRepresentativeToAccount = () => { 
    console.log("REP")
    let groupName = "";
    if(props.clientID > 0) {
      const findIndex = rows.findIndex( item => item.id == props.clientID)
      if(findIndex !== -1) {
        groupName = rows[findIndex].name
      }
    }
    props.setAddCompanyToAccountType(groupName != '' ? 2 : 1)
    props.setAddCompanyToAccountGroup(groupName)
    props.setAddCompanyToAccountRepresentatives(selectedNames)
    props.setAddCompanyToAccountModal(true)
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
    props.setAssignmentList([])
    props.setRawAssignment(false)
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



  const handleClick = (event, clientID, companyID, list) => {    
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
      if(typeof companyID == 'object') {
        oldSelection =  [...companyID]
      } else {
        oldSelection.push(companyID);
      }
    } else {
      if(typeof companyID == 'object') {
        oldSelection = companyID.length > 0 ? [...companyID] : []
      } else {
        if(oldSelection.indexOf(companyID) >= 0){
          oldSelection.splice(oldSelection.indexOf(companyID), 1);
        }
      }
    }
    let findNames = [];
    if(oldSelection.length > 0) {
      const promise = oldSelection.map( item => {
        const findIndex = list.findIndex( row => row.representative_id == item)
        if(findIndex !== -1) {
          findNames.push(list[findIndex].original_name)
        }
      })
    }
    console.log(findNames, oldSelection)
    setSelected(oldSelection);
    setSelectedNames(findNames);
    props.setPortfolios(oldSelection); 
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;
  const isSelectedClient = (id) => selectedClient == id;
  const isChildSelected = (id) => childselected.indexOf(id) !== -1;

  function descendingComparator(a, b, orderBy) {
    const sortA = !isNaN(Number(a[orderBy])) ? Number(a[orderBy]) :  orderBy == 'date' ? new Date(a[orderBy]).getTime() : a[orderBy]
    const sortB = !isNaN(Number(b[orderBy])) ? Number(b[orderBy]) :  orderBy == 'date' ? new Date(b[orderBy]).getTime() : b[orderBy]
    if (sortB < sortA) {
      return -1;
    }
    if (sortB > sortA) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) { 
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

  const handleTypeChange = (event) => {
    setHeaderType(event.target.value)
    if(event.target.value == '') {
      setRows(rowsInitial)
    } else {
      filterCompanies(event.target.value, ['organisation_type'])
    }
  }

  const filterCompanies = (value, dataKey) => {
    setRows(findListWithKeys(dataKey, rowsInitial, value))
  }

  const findListWithKeys = (keys, list, searchText) => {
    let findList = [];
    try{
      if(list.length > 0 && keys.length > 0) {
        (async () => {
          const promises = keys.map( key => {
            const searchItems = list.filter( e => e[key] != null && e[key] == searchText);
            if(searchItems.length > 0){
              findList = [...findList, ...searchItems];
            }
            return searchItems;
          })
          await Promise.all(promises);
        })();
      }
    } catch(e) {
      console.log(e);
    }
    return findList;
  }

  const removeURL = async(ID) => {
    console.log('Remove share url')
    if(window.confirm('Are your sure?')) {
      const { data } = await PatenTrackApi.removeSharingUrl(ID)
  
      if(data !== null) {
        const items =  [...rows]
        const findIndex = items.findIndex( row => row.id === ID)
        if(findIndex !== -1) {
          items[findIndex].share_url = 0
          setRows(items)
        }
      }
    }    
  }
  
  const ShowButton = (props) => {
    return (
      <Button onClick={() => removeURL(props.org)} style={{padding: 0, minWidth: 20}}><span className={classes.indication}></span></Button>
    )
  }

  const onHandleChangeCompanyStatus = useCallback(async(check, ID, representativeIDs) => {
    const items =  [...rows]
    
    const findIndex = items.findIndex( item => item.id == ID) 
    console.log('onHandleChangeCompanyStatus', check )
    if(findIndex !== -1) {
      const promise =  items[findIndex].children.map( (item, index) => {
        if(representativeIDs.includes(item.representative_id)){
          items[findIndex].children[index].status = check
        } 
      })
      await Promise.all(promise)     
      setRows([...items])
      setRowsInitial([...items])
    }
    const form = new FormData()   
    form.append("status",  check)
    form.append("representative_id", JSON.stringify(representativeIDs))
    const {data} = await PatenTrackApi.updateCompanySelection(form, ID)
  },[rows])
  
  function Row(props) {
    const { row } = props;
  
    
  
    const classes = useRowStyles();
  
    const getType = (type) => {
      return type == 1 ? 'Company' : type == 2 ? 'Bank' : type == 3 ? 'Law Firm' : type == 4 ? 'University' : type == 5 ? 'Goverment' : ' '
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
          <TableCell style={{width: 30}}>
            <IconButton aria-label="expand row" size="small" onClick={() => props.expand(!props.open, row.id)}>
              {props.open ? <ExpandMoreIcon /> : <ChevronRightIcon />}
            </IconButton>
          </TableCell>
          <TableCell  style={{width: 30}}>
            <Checkbox
              checked={props.clientselected(row.id)}
              onClick={(event) => props.clientclick(event, row.id)}
              value={row.id}
              inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${props.index}` }}
            />
          </TableCell>
          <TableCell align="left" /* component="th" */ scope="row" style={{width: 500}}>
            {row.name}
          </TableCell>
          <TableCell align="right" style={{paddingRight: '20px', width: 110}}>{getType(row.organisation_type)}</TableCell>
          <TableCell align="center" style={{width: 40}}>{row.share_url !== 0 ? <ShowButton org={row.id}/> : ''}</TableCell>
          <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.assets}</TableCell>
          <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.no_of_transactions}</TableCell>
          <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.no_of_parties}</TableCell>
          <TableCell align="right" style={{paddingRight: '20px', width: 100}}>{row.product}</TableCell>
        </TableRow>
        <TableRow className={`${classes.mainTable}`}>
          <TableCell style={{ padding: 0}} colSpan={9}>
            <Collapse in={props.open} timeout="auto" unmountOnExit>
              <CompaniesList list={row.children} loading={childCompaniesLoading} defaultOrderBy={orderBy} defaultOrderDirection={order} clientID={row.id} onHandleSelectCompany={props.click} onHandleChangeCompanyStatus={onHandleChangeCompanyStatus} selected={selected}/>
            </Collapse> 
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
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
                  <TableCell padding="checkbox" style={{width:'30px'}}><Add onClick={addRepresentativeToAccount} className={classes.delete}/> </TableCell>
                  <TableCell 
                    align="left"
                    sortDirection={orderBy === 'name' ? order : false}
                    style={{width: 500}}
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
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'organisation_type' ? order : false}
                    style={{width: 110}}
                  >
                    <TableSortLabel
                        active={orderBy === 'organisation_type'}
                        direction={orderBy === 'organisation_type' ? order : "asc"}
                        onClick={createSortHandler('organisation_type')}
                    >
                      Type
                      {orderBy === 'organisation_type' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>                    
                    <Select
                        value={headerType}
                        onChange={handleTypeChange}
                      >
                        <MenuItem key= {'0'} value={''}>{'Unselect'}</MenuItem>
                        {organisationType.map(option => (
                          <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                        ))}
                    </Select>
                  </TableCell>
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'share_url' ? order : false}
                    style={{width: 40}}
                  >                    
                    <TableSortLabel
                        active={orderBy === 'share_url'}
                        direction={orderBy === 'share_url' ? order : "asc"}
                        onClick={createSortHandler('share_url')}
                    >
                      Share
                      {orderBy === 'share_url' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>  
                  </TableCell>
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'assets' ? order : false}
                    style={{width: 100}}
                  >                    
                    <TableSortLabel
                        active={orderBy === 'assets'}
                        direction={orderBy === 'assets' ? order : "asc"}
                        onClick={createSortHandler('assets')}
                    >
                      Assets
                      {orderBy === 'assets' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>  
                  </TableCell>
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'no_of_transactions' ? order : false}
                    style={{width: 100}}
                  >                    
                    <TableSortLabel
                        active={orderBy === 'no_of_transactions'}
                        direction={orderBy === 'no_of_transactions' ? order : "asc"}
                        onClick={createSortHandler('no_of_transactions')}
                    >
                      Transactions
                      {orderBy === 'no_of_transactions' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel>   
                  </TableCell>
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'no_of_parties' ? order : false}
                    style={{width: 100}}
                  >
                    <TableSortLabel
                        active={orderBy === 'no_of_parties'}
                        direction={orderBy === 'no_of_parties' ? order : "asc"}
                        onClick={createSortHandler('no_of_parties')}
                    >
                      Parties
                      {orderBy === 'no_of_parties' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel> 
                  </TableCell>
                  <TableCell 
                    align="right" 
                    className={classes.paddingRight20}
                    sortDirection={orderBy === 'product' ? order : false}
                    style={{width: 100}}
                  >
                    <TableSortLabel
                        active={orderBy === 'product'}
                        direction={orderBy === 'product' ? order : "asc"}
                        onClick={createSortHandler('product')}
                    >
                      Arrows
                      {orderBy === 'product' ? (
                        <span className={classes.visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </span>
                      ) : null}
                    </TableSortLabel> 
                  </TableCell>
                </TableRow>                   
                </TableHead>
                <TableBody>
                {stableSort(rows, getComparator(order, orderBy)).map(
                  (row, index) => {
                    return (
                    <Row key={row.name} row={row} index={index}  open={expandID == row.id ? true : false} expand={findClientPortfolios} clientclick={handleClientSelect} click={handleClick} clientselected={isSelectedClient} selected={isSelected} child={isChildSelected} onHandleChangeCompanyStatus={onHandleChangeCompanyStatus}/>
                    );
                  },
                )}
                </TableBody>
              </Table>
            </TableContainer>
          }
        </div>
        </div>
        <AddCompaniesToAccount/>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    companiesList: state.patenTrack.clientsData,
    clientID: state.patenTrack.clientID,
    isLoading: state.patenTrack.companyListLoading,
    main_company_selected: state.patenTrack.main_company_selected,
    main_company_selected_name: state.patenTrack.main_company_selected_name,
    searchCompaniesSelected: state.patenTrack.search_companies_selected,
    portfolioList: state.patenTrack.portfolioList,
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
  setAccountUserForm,
  setAssignmentList,
  setRawAssignment,
  setAddCompanyToAccountModal,
  setAddCompanyToAccountType,
  setAddCompanyToAccountGroup,
  setAddCompanyToAccountRepresentatives
};

export default connect(mapStateToProps, mapDispatchToProps)(Companies);
