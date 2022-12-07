import React, { useState, useRef, forwardRef, useEffect, useCallback  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";
import Alert from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Draggable from "react-draggable"
import {ResizableBox} from "react-resizable"
import Loader from "../Loader";
import { makeStyles } from '@material-ui/core/styles';
import {IconButton, Button, Checkbox, Select, MenuItem, Switch, Grid, Paper, TextField, Collapse, Menu, FormControl, Box, Modal, InputLabel, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions} from '@material-ui/core';

import Users from "../Users";  
import AdminUsers from '../AdminUsers'
import PatentrackDiagram from "../PatentrackDiagram";
import CitedPatent from '../CitedPatent'

import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import {setSearchModalType, setSearchedCompanyAddress, setSearchCompanyAddressModal, setSearchByCompanyIDAddress, getCompanyListByAddress, setSearchedAddressLawfirm, setSearchAddressModal, setSearchByIDLawfirmAddress, getLawfirmListByAddress, searchCompany, searchCompanyByAddress, searchAssigneeByCountry, addCompany, setSearchCompanies, setSearchCompanyLoading, cancelRequest, setSelectedSearchCompanies, setMainCompanyChecked, setSelectedCompany, updateNormalizeEntites, updateNormalizeLawFirms, updateNormalizeLawyers, transactionUpdate, updateEntitiesFlag, getAssets, setAssets, searchTransaction, setTransactionList, updateFlagAutomatic, updateFlagMissingTransaction, missingInventor, findInventor, treeFileUpload,setEntityAssets, getEntityAssets, setLawyerList, assignmentUpdate, searchLenders, setLenderList, searchLawFirm, findCompaniesByLawFirm, findLenderCompaniesByID, setLawFirmList, cleanAddress, setAdminUsers, setUsers, setAdminUsersLoading, setUsersLoading, findLawfirmsCompaniesByID, setRecentTransactions, getClientAssetsList, setClientAssetsList, setAddCompanyToAccountModal, setAddCompanyToAccountType, setAddCompanyToAccountGroup, setAddCompanyToAccountRepresentatives, refreshReclassify  } from "../../../actions/patenTrackActions"; 


import PatenTrackApi from '../../../api/patenTrack';
import clsx from "clsx";
import NormalizeLawFirms from "./NormalizeLawFirms";
import NormalizeCompany from "./NormalizeCompany";
import AddCompaniesToAccount from "./AddCompaniesToAccount";
import Reclassify from "./Reclassify";
import { Close } from "@material-ui/icons";

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
  const inputSearchCompany = useRef(null);
  const inputSearchCompanyTable = useRef(null);
  const inputSearchAssigneeByAddress = useRef(null);
  const inputSearchAssigneeByCountry = useRef(null);
  const inputSearchLawFirm = useRef(null);
  const inputSearchTransaction = useRef(null);
  const inputSearchLawFirms = useRef(null);
  const inputSearchLender = useRef(null);
  const logRef = useRef(null);
  const staticWidth = 500
  const targetRef = useRef();
  const [headerColumnWidth, setHeaderColumnWidth] = useState( null )

  const [checked, setChecked] = useState([]);

  const [timeInterval, setTimeInterval] =  useState( null ); 
  const [ resizableWidthHeight, setResizableWidthHeight ] = useState([350, 450])
  const [ filterDrag, setFilterDrag ] =  useState([0, 80])
  const WAIT_INTERVAL = 200;
  const [showButton, setSwitchButton] = useState(false);
  const [defaultSearchItemOpen, setDefaultSearchItemOpen] = useState(true)
  const [columnClickable, setColumnClickable] = useState(false)
  const [openReClasifyModal, setOpenReClassifyModal] = useState(false)
  const [reClassifyData, setReClassifyLogData] = useState([]);
  const [recent_transactions, setRecentTransactions] = useState([]);
  const [originalItems, setOriginalItem] = useState([]);
  const [rows, setRows] = useState([]);
  const [rowsInitial, setRowsInitial] = useState([]);

  const [entitiesrow, setEntitesRow] = useState([]);
  const [entitiesrowIntial, setEntityIntialRows] = useState([]);

  const [transactionrow, setTransactionRow] = useState([]);
  const [transactionrowIntial, setTransactionIntialRow] = useState([]);

  const [assignmentrow, setAssignmentRow] = useState([]);
  const [assignmentrowIntial, setAssignmentIntialRow] = useState([]);

  const [lawFirms, setLawFirms] = useState([]);
  const [lawFirmsInitial, setLawFirmsInitial] = useState([]);
  const [lawfirmrowselection, setLawFirmRowSelection] = useState([]);
  const [lawFirmNormalizeName, setCopiedLawFirmName] = useState('');
  const [lawFirmScrollTop, setLawFirmScrollTop] = useState(0)
  const [companyScrollTop, setCompanyScrollTop] = useState(0)
  const [entityScrollTop, setEntityScrollTop] = useState(0)
  const [transactionScrollTop, setTransactionScrollTop] = useState(0)

  const [lawyers, setLawyers] = useState([]);
  const [lawyersInitial, setLawyerInitial] = useState([]);
  const [lawyerrowselection, setLawyerRowSelection] = useState([]);
  const [lawyerNormalizeName, setLawyerNameCopy] = useState('');


  const [conveyanceType, setConveyanceType] = useState({})

  const [modifierConveyanceType, setModifierConveyanceType] = useState({})

  const [originalConveyanceType, setOriginalConveyanceType] = useState([])

  const [normalizename, setCopiedName] = useState('')

  const [copiedFlag, setCopiedFlag] = useState(-1)

  const [assetList, setAssetList] = useState([])

  const [activeReel, setActiveReel] = useState(null)

  const [entityrowselection, setEntityRowSelection] = useState([])

  const [selectEntityRow, setSelectEntityRow] = useState([])

  const [entityselectionnames, setEntityRowSelectionNames] = useState([])

  const [headerType, setHeaderType] = useState('')

  const [updateHeaderType, setUpdateHeaderType] = useState('')
  

  const [open, setOpen] = useState(false)
  const [openAccountModal, setOpenAccountModal] = useState(false)
  const [normalizedLawfirmModal, setNormalisedLawfirmsModal] = useState(false)
  const [normalizedCompanyModal, setNormalisedCompanysModal] = useState(false)
  const [account, setAccount] = React.useState(''); 
  const [selectedAsset, setSelectedAsset] = useState("")
  const [clickedActiveCompany, setClickedActiveCompany] = useState("")
  const [sortInventBy, setSortInventBy] = useState('name');
  const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC)

  const [sortLawFirmBy, setLawFirmBy] = useState('name')
  const [sortLawFirmDirection, setSortLawFirmDirection] = useState(SortDirection.ASC)

  const [sortLawyerBy, setLawyerBy] = useState('name')
  const [sortLawyerDirection, setSortLawyerDirection] = useState(SortDirection.ASC)

  const [sortRecentTransactionBy, setSortRecentTransactionBy] = useState('assets')
  const [sortRecentTransactionDirection, setSortRecentTransactionDirection] = useState(SortDirection.DESC)

  const [sortAssetBy, setSortAssetBy] = useState('number')
  const [sortAssetDirection, setSortAssetDirection] = useState(SortDirection.ASC)

  const [cleanAddressStatus, setCleanAddressStatus] = useState("")
  const [flagUpdateText, setFlagUpdateText] = useState("")

  const [parent_width, setParentWidth] = useState(0)

  const [bottomToolbarPosition, setBottomToolbarPosition] = useState(0)

  const [topPosition, setTopPosition] = useState(0)

  const [checkedSwitch, setCheckedSwitch] = useState( false ) 

  const resetAll = () => {
    setRecentTransactions([])
    setRows([])
    setRowsInitial([])
    setEntitesRow([])
    setEntityIntialRows([])
    setTransactionRow([])
    setTransactionIntialRow([])
    setAssignmentRow([])
    setAssignmentIntialRow([])
    setLawFirms([])
    setLawFirmsInitial([])
    setLawyers([])
    setLawyerInitial([])
    setConveyanceType([])
    setOriginalConveyanceType([])
    setModifierConveyanceType([])
    setAssetList([])
    setSelectEntityRow([])
    setEntityRowSelection([])
    setEntityRowSelectionNames([])
    setLawFirmRowSelection([])
    setLawFirmScrollTop(0)
    setTransactionScrollTop(0)
    setEntityScrollTop(0)
    setCompanyScrollTop(0)
    setLawyerNameCopy('')
    setCopiedLawFirmName('')
    setCopiedName('')
    props.setAdminUsers([])
    props.setUsers([])
    props.setUsersLoading(true)
    props.setAdminUsersLoading(true) 
  }

  useEffect(() => {
    console.log('DDD recent_transactions', recent_transactions)
  }, [recent_transactions])
  useEffect(() => {    
    resetAll();
    if(props.recentTransactions && props.recentTransactions.length > 0) {
      console.log('PROPS', props.recentTransactions)
      setRecentTransactions(props.recentTransactions)
    }
    if(props.searchCompanies && props.searchCompanies.length > 0 ){      
      setRows(props.searchCompanies);
      setRowsInitial(props.searchCompanies);
      setSortInventBy('name');
    } 

    if(props.lenders_list && props.lenders_list.length > 0) {
      setRows(props.lenders_list);
      setRowsInitial(props.lenders_list);
      setSortInventBy('name');
    } 

    if(props.entities_list && props.entities_list.length > 0) {
      setEntitesRow(props.entities_list);
      setEntityIntialRows(props.entities_list);
      setSortInventBy('name');
    }
    if(props.transaction_list && props.transaction_list.list.length > 0) { 
      console.log("Refresh Transaction Table")     
      setTransactionRow(props.transaction_list.list);
      setTransactionIntialRow(props.transaction_list.list);
      setConveyanceType(props.transaction_list.type);
      setOriginalConveyanceType(props.transaction_list.conveyance);
      setModifierConveyanceType(props.transaction_list.update_conveyance);
      setSortInventBy('text');
      setHeaderType('')
      setUpdateHeaderType('')
    }

    if(props.assignment_list && props.assignment_list.length > 0) {      
      setAssignmentRow(props.assignment_list);
      setAssignmentIntialRow(props.assignment_list);
      setSortInventBy('cname');
    }

    if(props.law_firm_list.length > 0) {      
      setLawFirms(props.law_firm_list);
      setLawFirmsInitial(props.law_firm_list);
    }

    if(props.lawyer_list.length > 0) {
      setLawyers(props.lawyer_list);
      setLawyerInitial(props.lawyer_list);
    }
    
    if(props.asset_list && props.asset_list.length > 0) {
      setSortInventBy('number');
      setAssetList(props.asset_list);
    }
    
    if (targetRef.current) { 
      updateContainerWidth();
    }
    
    /*if(props.flag_update_text) {
      setFlagUpdateText(props.flag_update_text);
      setTimeout(() => {
        setFlagUpdateText("");
      },4000);
    }*/

    if(props.clean_address_status) {
      setCleanAddressStatus(props.clean_address_status);
      setTimeout(() => {
        setCleanAddressStatus("");
      },4000);
    }

    if(props.entity_assets.length > 0) {
      if(rows.length > 0) {
        const oldRows = [...rows];
        (async () => {
          const promises = props.entity_assets.map( entity => {
            const findIndex = rows.findIndex(row => {
              return row.assignor_and_assignee_id == entity.entity_id;
            });
            if(findIndex >=0) {
              oldRows[findIndex].count_assets = entity.count;
            }
            return entity;
          });

          await Promise.all(promises);
          setRows(oldRows);
        })();
      }
    }
  },[props.searchCompanies, props.entities_list, props.transaction_list, props.assignment_list, props.asset_list, props.assetJSON, props.flag_update_text, props.entity_assets, props.law_firm_list, props.lawyer_list, props.clean_address_status, props.lenders_list, props.recentTransactions ]);

  useEffect(() => {  
    if(props.refresh_reclassify  > 0 ) {
      if(logRef.current !== null && openReClasifyModal === true) {
        logRef.current.click()
        props.refreshReclassify(0)
      }
    }
  }, [props.refresh_reclassify])

  const numberWithCommas = (x) => {
    return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  }

  const applicationFormat = (x) => {
    return x != undefined ? x.toString().substr(0,2) +'/'+ x.toString().substr(2, x.toString().length - 1).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  }

  const handleTextboxWithInTable = useCallback(() => {
    setCheckedSwitch(!checkedSwitch)
  })

  const onDropContent = useCallback( event => {
    event.preventDefault()
    inputSearchCompany.current.querySelector("#search_company").value = event.dataTransfer.getData('text')
    props.searchCompany( event.dataTransfer.getData('text') );
  }, []);

  useEffect(()=>{
    console.log(inputSearchCompany.current);
    if(inputSearchCompany.current != null) {
      inputSearchCompany.current.addEventListener('drop', onDropContent);
    }
  }, [])

  const updateContainerWidth = () => {
    if (targetRef.current) {
      const patentelement = targetRef.current.parentElement.parentElement;
      setBottomToolbarPosition(props.screenHeight - patentelement.offsetHeight - 40);
      const clientRect = patentelement.getBoundingClientRect();      
      setTopPosition(clientRect.top  + 26);
      setParentWidth(parseInt(targetRef.current.offsetWidth));
    }
  }

  const findWordWithKeysWithSearchItems = (keys, list, searchText) => {
    let filterList = []
    console.log('findWordWithKeysWithSearchItems')
    try{
      if(list.length > 0 && keys.length > 0 && searchText.length > 0) {
        filterList =  list.filter( e => e[keys[0]] != null && e[keys[0]].includes(searchText[0]));
        if(filterList.length > 0) {
          filterList =  filterList.filter( e => e[keys[1]] != null && e[keys[1]].includes(searchText[1]));
        }
      }
    } catch(e) {
      console.log(e);
    }
    return filterList;
  }

  const findWordWithKeys = (keys, list, searchText) => {
    let findList = [];
    try{
      if(list.length > 0 && keys.length > 0) {
        (async () => {
          const promises = keys.map( key => {
            const searchItems = list.filter( e => e[key] != null && e[key].includes(searchText));
            if(searchItems.length > 0){
              findList = [...findList, ...searchItems];
            }
            return searchItems;
          })
          await Promise.all(promises);
        })();
      }
    }catch(e){
      console.log(e);
    }
    return findList;
  }

  const filterWordWithKeys = (keys, list, searchText) => {
    let findList = [];
    try{
      if(list.length > 0 && keys.length > 0) {
        (async () => {
          const promises = keys.map( key => {
            const searchItems = list.filter( e => e[key] != null && !e[key].includes(searchText) && !e[key].includes(searchText.toLowerCase()));
            console.log("searchItems",searchText, searchItems, list);
            if(searchItems.length > 0){
              findList = [...findList, ...searchItems];
            }
            return searchItems;
          })
          await Promise.all(promises);
        })();
      }
    }catch(e){
      console.log(e);
    }
    return findList;
  }

  const handleSearchCompanyFromData =  () => {
     /**event.target.value giving old value in setimeout */
      clearTimeout(timeInterval);
      setTimeInterval(setTimeout(() => {
        let getList = [];
        if(inputSearchCompanyTable.current.querySelector("#search_company") != null && inputSearchCompanyTable.current.querySelector("#search_company").value.length >= 1) {
          const searchValue = inputSearchCompanyTable.current.querySelector("#search_company").value;
          if(searchValue.indexOf(' -') >= 0) {
            /**
             * split(/[-]+/);
             */
            (async() => {
              let splitToFilter = searchValue.split(' -');

              if(searchValue.trim()[0] == '-') {
                console.log("splitToFilter", splitToFilter);
                const promise = splitToFilter.map( (s) => {
                  if(s != "") {
                    s = s.substring(0,1).toUpperCase()+ s.substring(1);
                    console.log("search", s);
                    getList = filterWordWithKeys(['name'], getList.length > 0 ? getList : rows, s);
                    console.log("setRowsInitial", getList.length);
                  }
                })
                await Promise.all(promise);
                setRowsInitial(getList) ;  
              } else {
                let splitWord = splitToFilter[0].split(' ');
                  splitWord = splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
                  getList = findWordWithKeys(['name'], rows, splitWord);

                  const promise = splitToFilter.map( (s, index) => {
                    if(index > 0) {
                      s = s.trim().substring(0,1).toUpperCase()+ s.substring(1)
                      getList = filterWordWithKeys(['name'], getList, s);
                      console.log("setRowsInitial", getList.length);
                    }
                  })
                  await Promise.all(promise);
                  setRowsInitial(getList) ;  
              }
            })();
            
          } else {
            let splitWord = inputSearchCompanyTable.current.querySelector("#search_company").value.toLowerCase().split(' ');
            splitWord = splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
            getList = findWordWithKeys(['name'], rows, splitWord);
            console.log("setRowsInitial", getList.length);
            setRowsInitial(getList) ;    
          }
        } else {
          getList = rows;
          setRowsInitial(getList) ;     
        }        
     }, WAIT_INTERVAL));  
  }

  const handleSearchAssigneeByAddress = ( event ) => {
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      if(inputSearchAssigneeByAddress.current.querySelector("#search_asignee_by_address").value.length > 2) {
        props.searchCompanyByAddress(inputSearchAssigneeByAddress.current.querySelector("#search_asignee_by_address").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setSearchCompanies( [] );
        props.cancelRequest();
      }
    }, WAIT_INTERVAL));    
  }

  const handleSearchAssigneeByCountry = ( event ) => {
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      if(inputSearchAssigneeByCountry.current.querySelector("#search_assignee_by_country").value.length > 2) {
        props.searchAssigneeByCountry(inputSearchAssigneeByCountry.current.querySelector("#search_assignee_by_country").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setSearchCompanies( [] );
        props.cancelRequest();
      }
    }, WAIT_INTERVAL));    
  }
  
  const handleSearchCompany = (event) => {    
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setEntityRowSelection([]);
      setSelectEntityRow([])
      if(entitiesrowIntial.length > 0 && props.clientID > 0) {
        let getList = [];
        if(inputSearchCompany.current.querySelector("#search_company").value.length > 0) {
          let splitWord = inputSearchCompany.current.querySelector("#search_company").value.toLowerCase().split(' ');
          splitWord = splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
          getList = findWordWithKeys(['name', 'normalize_name'], entitiesrowIntial, splitWord);
        } else {
          getList = entitiesrowIntial;
        }
        setEntitesRow(getList) ;
      } else {        
        props.setLawFirmList([]);
        setLawFirms([]);
        setLawFirmsInitial([]);
        if(inputSearchCompany.current.querySelector("#search_company").value.length > 0) {
          props.setSearchModalType(0)
          props.searchCompany(inputSearchCompany.current.querySelector("#search_company").value );
        } else {
          props.setSearchCompanyLoading( false );
          props.setSearchCompanies( [] );
          props.cancelRequest();
        }
      }      
    }, WAIT_INTERVAL));  
  }

  const handleLawFirms = () => {
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setRows([]);
      setRowsInitial([]);
      setLawFirms([]);
      setLawFirmsInitial([]);
      setEntityRowSelection([]);
      setSelectEntityRow([])
      props.setLenderList([]);
      if(inputSearchLawFirm.current.querySelector("#search_lawfirm").value.length > 2) {
        props.searchLawFirm(inputSearchLawFirm.current.querySelector("#search_lawfirm").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setLawFirmList([]);  
        props.cancelRequest();
      }
    }, WAIT_INTERVAL));  
  }

  const handleLenders = () => {
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setRows([]);
      setRowsInitial([]);
      props.setLawFirmList([]);  
      if(inputSearchLender.current.querySelector("#search_lender").value.length > 2) {
        props.setSearchModalType(1)
        props.searchLenders(inputSearchLender.current.querySelector("#search_lender").value );        
      } else {
        props.setSearchCompanyLoading( false );
        props.setLenderList([]);
        props.cancelRequest();
      }
    }, WAIT_INTERVAL));
  }

  const handlingFindLenderClient = (event) => {
    event.preventDefault()
    let selectedFirm = [...entityrowselection];
    if( props.lenders_list.length > 0 && selectedFirm.length == 1 ) {
      setRows([]);
      setRowsInitial([]);
      props.setLenderList([]);
      setEntityRowSelection([]);
      setSelectEntityRow([])
      props.findLenderCompaniesByID(selectedFirm[0])
    } else {
      alert('Please select a lender first.')
    }
  }

  const handlingFindClientLawfirms = (event) => {
    event.preventDefault()
    if( props.searchCompanies.length > 0 && entityrowselection.length == 1 ) {   
      setRows([]);
      setRowsInitial([]);   
      setLawFirms([])
      setLawFirmsInitial([])
      setLawFirmRowSelection([])      
      props.setSearchCompanyLoading( false );
      props.setSearchCompanies( [] );
      props.findLawfirmsCompaniesByID(entityrowselection[0])
    } else {
      alert('Please select a company first.')
    }
  }

  const handlingFindLawfirmClient = (event) => {
    event.preventDefault()
    setLawFirms([]);
    setLawFirmsInitial([]);
    setTransactionRow([])
    setTransactionIntialRow([])
    let selectedFirm = [...lawfirmrowselection];

    if( selectedFirm.length == 1 ) { 
      props.findCompaniesByLawFirm(selectedFirm[0])
    } else {
      alert('Please select a lawfirm first.')
    }
  }

  const handlingFindNormalizedLawfirm = (event) => {
    event.preventDefault()
    let selectedFirm = [...lawfirmrowselection];

    if( selectedFirm.length == 1 ) { 
      setNormalisedLawfirmsModal(!normalizedLawfirmModal)
    } else {
      alert('Please select a lawfirm first.')
    }
  }

  const handlingFindNormalizedCompany = (event) => {
    event.preventDefault()
    let selectedCompany = [...entityrowselection];

    if( selectedCompany.length == 1 ) { 
      setNormalisedCompanysModal(!normalizedCompanyModal)
    } else {
      alert('Please select a entity first.')
    }
  }
  

  const searchFromTransaction = async (keys, searchText) =>{
    let getList = [];
    if(Array.isArray(searchText)) {
      getList = findWordWithKeysWithSearchItems(keys, transactionrowIntial, searchText);
    } else {
      if(searchText.length > 0) {
        getList = findWordWithKeys(keys, transactionrowIntial, searchText);
      } else {
        getList = transactionrowIntial;
      }
    }
    console.log(getList);
    setTransactionRow(getList) ;
  }

  const handleSearchTransaction = (t, searchString, dataKey) => {
    /**event.target.value giving old value in setimeout */
    console.log("handleSearchTransaction", dataKey)
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setEntityRowSelection([]);
      setSelectEntityRow([])
      if(transactionrowIntial.length > 0 && props.clientID > 0) {
        const search = typeof searchString != 'undefined' && searchString != '' ? searchString : inputSearchTransaction.current.querySelector("#search_transaction").value.toString();
        searchFromTransaction(t == 1 ? dataKey : ['text'], t == 1 ? search : search.toUpperCase());
      } else {
        /**
         * Search from database
         */
        if(inputSearchTransaction.current.querySelector("#search_transaction").value.length > 2) {
          props.searchTransaction(inputSearchTransaction.current.querySelector("#search_transaction").value );
        } else {
          props.setSearchCompanyLoading( false );
          props.setTransactionList({list: [], type: [], assignment_type: []});
          setTransactionRow([]);
          setTransactionIntialRow([]);
          props.cancelRequest();
        }
      }      
    }, WAIT_INTERVAL));  
  }

  const handleSearchLawFirms = () => {

  }

  const hanldeMissingInventor = () =>{
    if(props.clientID > 0) {
      props.missingInventor(props.clientID, props.portfolioList.length > 0 ? props.portfolioList[props.portfolioList.length - 1] : 0);
    }
  } 

  const handleFindInventor = () => {
    if(props.clientID > 0) {
      props.findInventor(props.clientID, props.portfolioList.length > 0 ? props.portfolioList[props.portfolioList.length - 1] :  0);
    }
  }

  const handleFlagAutomatic = () => {
    if(props.clientID > 0) {
      props.updateFlagAutomatic(props.clientID, props.portfolioList.length > 0 ? props.portfolioList[props.portfolioList.length - 1] :  "");
    }
  }

  const handleFlagMissingTransaction = () => {
    if(props.clientID > 0) {
      props.updateFlagMissingTransaction(props.clientID, props.portfolioList.length > 0 ? props.portfolioList[props.portfolioList.length - 1] :  "");
    }
  }

  const handleFlag = () => {
    if(props.clientID > 0) {
      if(props.flag < 2) {
        if(entityrowselection.length > 0) {
          const selectedIDs = [...entityrowselection];
          const selectedNames = [...entityselectionnames];
          let formData = new FormData();
          formData.append( 'flag', props.flag );
          formData.append( 'inventors', JSON.stringify(selectedIDs));
          props.updateEntitiesFlag(formData, props.clientID, props.flag);

          /* const selectedNames = [...entityselectionnames];
          let formData = new FormData();
          selectedNames.forEach(c => {
            formData.append( 'inventors', c );
          });          
          formData.append( 'flag', props.flag );
          props.updateEntitiesFlag(formData, props.clientID, props.flag); */
          setTimeout(() => {
            (async () => {
              const oldItems = [...entitiesrowIntial];
              const promises = selectedNames.map(e => {
                oldItems.forEach((r, idx) => {
                  if(r.name === e) {
                    oldItems.splice(idx, 1);
                    return false;
                  }
                });
                return e;
              })
              await Promise.all(promises);  
              setEntityIntialRows(oldItems);
              setEntitesRow(oldItems);
              setEntityRowSelection([]);  
              setSelectEntityRow([])
              setEntityRowSelectionNames([]);
            })();
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
    let newItems = entitiesrow.length > 0 ? [...entitiesrow] : transactionrow.length > 0 ? [...transactionrow] : [...rowsInitial];
    newItems.sort((a, b) => {
      const itemFirst = a[sortBy] === null ? "" : !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) :  a[sortBy].toLowerCase(), itemSecond =  b[sortBy] === null ? "" :  !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) :  b[sortBy].toLowerCase()
       
      if (itemFirst < itemSecond) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (itemFirst > itemSecond) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });

    if(entitiesrow.length > 0) {
      setEntitesRow(newItems);
    } else if(transactionrow.length > 0){
      setTransactionRow(newItems);
    } else {
      setRowsInitial(newItems);
    }    
  }

  const sortAssignment = ({ sortBy, sortDirection }) => {
    setSortInventBy(sortBy);
    setSortInventDirection(sortDirection);

    let newItems = [...assignmentrow] ;
    newItems.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    setAssignmentRow(newItems);    
    setAssignmentIntialRow(newItems);
  }

  const sortLawFirm = ({ sortBy, sortDirection }) => {
    setLawFirmBy(sortBy);
    setSortLawFirmDirection(sortDirection);
    let newItems = [...lawFirms] ;
    newItems.sort((a, b) => {
      let firstIndex = sortBy != 'normalize_name' ? !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) : a[sortBy].toLowerCase() : a.representative_name != null ? a.representative_name.toLowerCase() : '';
      let secondIndex = sortBy != 'normalize_name'? !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) : b[sortBy].toLowerCase() : b.representative_name != null ? b.representative_name.toLowerCase() : '';
      if (firstIndex < secondIndex) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (firstIndex > secondIndex) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    setLawFirms(newItems);  
    setLawFirmsInitial(newItems)
  }

  const sortLawyer = ({ sortBy, sortDirection }) => {
    setLawyerBy(sortBy);
    setSortLawyerDirection(sortDirection);

    let newItems = [...lawyers] ;
    newItems.sort((a, b) => {
      let firstIndex = sortBy != 'normalize_name' && sortBy != 'law_firm_name' ? a[sortBy] : sortBy == 'law_firm_name' ? a.lawfirms.law_firm_name :  sortBy == 'normalize_name' && a.representativelawfirm != null ? a.representativelawfirm.representative_name : '';
      let secondIndex = sortBy != 'normalize_name' && sortBy != 'law_firm_name' ? b[sortBy] : sortBy == 'law_firm_name' ? b.lawfirms.law_firm_name :  sortBy == 'normalize_name' && b.representativelawfirm != null ? b.representativelawfirm.representative_name : '';

      firstIndex = !isNaN(Number(firstIndex)) ? Number(firstIndex) : firstIndex.toLowerCase()
      secondIndex = !isNaN(Number(secondIndex)) ? Number(secondIndex) : secondIndex.toLowerCase()
      
      if (firstIndex < secondIndex) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (firstIndex > secondIndex) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    setLawyers(newItems);    
  }

  const sortRecentTransaction = ({sortBy, sortDirection}) => {
    setSortRecentTransactionBy(sortBy);
    setSortRecentTransactionDirection(sortDirection);
    let newItems = [...recent_transactions] ;
    newItems.sort((a, b) => {
      const firstIndex = sortBy == 'exec_dt' || sortBy == 'record_dt' ? new Date(`${a[sortBy]} 00:00:00`).getTime() : a[sortBy], secondIndex = sortBy == 'exec_dt' || sortBy == 'record_dt' ? new Date(b[sortBy]).getTime() : b[sortBy];

      console.log("sortRecentTransaction", sortBy, sortDirection, firstIndex, secondIndex)
      
      if (firstIndex < secondIndex) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }

      if (firstIndex > secondIndex) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }

      return 0;
    });
    setRecentTransactions(newItems);
  }

  const sortAsset = ({sortBy, sortDirection}) => {
    setSortAssetBy(sortBy);
    setSortAssetDirection(sortDirection);
    /* props.setClientAssetsList([]) */
    props.getClientAssetsList(props.clientID, props.portfolioList, sortDirection);
  }

  const selectLawFirmRow = (event, lawFirmID, rowIndex) => {
    event.stopPropagation();  
    let oldSelection = [...lawfirmrowselection];
    const findIndex = oldSelection.indexOf(lawFirmID);
    /* if(event.target.checked) {
      if(findIndex < 0) {
        oldSelection.push(lawFirmID);
      }
    } else {
      if(findIndex >= 0) {
        oldSelection.splice(findIndex, 1);
      }
    }
    setLawFirmRowSelection(oldSelection); */


    const oldItems =   [...lawFirms]

    if(event.target.checked) {
      let cntrlKey = event.ctrlKey ? event.ctrlKey : false;
      let previousIndex = -1;
      
      if (cntrlKey && oldSelection.length > 0) {
        previousIndex = oldItems.findIndex(item => item.law_firm_id == oldSelection[oldSelection.length - 1]);
      }
      if(previousIndex >= 0) {
        if(previousIndex > rowIndex) {
          oldItems.forEach((r, index) => {
            if(index >= rowIndex && index <= previousIndex) {
              if(oldSelection.indexOf(r.law_firm_id) == -1) {
                oldSelection.push(r.law_firm_id);
              }
            }
          });
        } else {
          oldItems.forEach((r, index) => {
            if(index >= previousIndex && index <= rowIndex) {
              if(oldSelection.indexOf(r.name) == -1) {
                oldSelection.push(r.law_firm_id);
              }
            }
          });
        }
      } else {
        if(oldSelection.indexOf(lawFirmID) == -1) {
          oldSelection.push(oldItems[rowIndex]['law_firm_id']);
        }
      }  
    } else {
      if(findIndex >= 0){
        oldSelection.splice(findIndex, 1);
      } 
    }
    setLawFirmRowSelection(oldSelection);
  }

  const selectLawyerRow = (event, lawyerID, rowIndex) => {
    event.stopPropagation();  
    let oldSelection = [...lawyerrowselection];
    const findIndex = oldSelection.indexOf(lawyerID);
    if(event.target.checked) {
      if(findIndex < 0) {
        oldSelection.push(lawyerID);
      }
    } else {
      if(findIndex >= 0) {
        oldSelection.splice(findIndex, 1);
      }
    }
    setLawyerRowSelection(oldSelection);
  }

  const selectRows = async(event, entityName, rowIndex) => {    
    let selectedNames = [...entityselectionnames], oldSelection = [...entityrowselection], rowSelections = [...selectEntityRow]
    const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
    event.stopPropagation();   
    console.log(event.target.checked);
    if(event.target.checked) {
      let cntrlKey = event.ctrlKey ? event.ctrlKey : false;
      let previousIndex = -1;
      
      if (cntrlKey && oldSelection.length > 0) {
        previousIndex = oldItems.findIndex(item => item.id == oldSelection[oldSelection.length - 1]);
      }
      console.log("SELECT INDEXING", previousIndex, rowIndex)
      if(previousIndex >= 0) {
        if(previousIndex > rowIndex) {
          oldItems.forEach((r, index) => {
            if(index >= rowIndex && index <= previousIndex) {
              if(selectedNames.indexOf(r.name) < 0) {
                oldSelection.push(r.id);
                rowSelections.push(r);
                selectedNames.push(r.name);
              } else if(selectedNames.indexOf(r.name) >= 0 && !oldSelection.includes(r.id)){
                oldSelection.push(r.id);
                rowSelections.push(r);
              }
            }
          });
        } else {
          oldItems.forEach((r, index) => {
            if(index >= previousIndex && index <= rowIndex) {
              if(selectedNames.indexOf(r.name) < 0) {
                oldSelection.push(r.id);
                rowSelections.push(r);
                selectedNames.push(r.name);
              } else if(selectedNames.indexOf(r.name) >= 0 && !oldSelection.includes(r.id)){
                oldSelection.push(r.id);
                rowSelections.push(r);
              }
            }
          });
        }
      } else {
        if(selectedNames.indexOf(entityName) < 0) {
          selectedNames.push(entityName);
          oldSelection.push(oldItems[rowIndex]['id']);
          rowSelections.push(oldItems[rowIndex]);
        } else if(selectedNames.indexOf(entityName) >= 0 && !oldSelection.includes(oldItems[rowIndex]['id'])){
          oldSelection.push(oldItems[rowIndex]['id']);
          rowSelections.push(oldItems[rowIndex]);
        }
      }
    } else {
      const findIndex = selectedNames.indexOf(entityName);
      if(findIndex >= 0){
        selectedNames.splice(findIndex, 1);
        const rowIds = [], rowIndexs = [];
        const promises = rowSelections.map( (item, itemIdx) => {
          if(item.name == entityName) {
            rowIds.push(item.id)
            rowIndexs.push(itemIdx)
          }
        })
        await Promise.all(promises)
        rowSelections = rowSelections.filter((element, idx) => !rowIndexs.includes(idx))
        oldSelection = oldSelection.filter(element =>  !rowIds.includes(element))
      } 
    }

    console.log(selectedNames, oldSelection);
    setEntityRowSelectionNames(selectedNames);
    setEntityRowSelection(oldSelection);
    setSelectEntityRow(rowSelections);
  }

  const handleCopy = (event, entityName, rowIndex) => {
    event.stopPropagation();
    /*entityName = normalizename != entityName ? entityName : '';*/
    const oldItems = entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
    setCopiedName(entityName);
    if(typeof oldItems[rowIndex]['flag'] != 'undefined') {
      setCopiedFlag(parseInt(oldItems[rowIndex]['flag']))
    } else {
      setCopiedFlag(-1)
    } 
  }

  const handleCopyLawFirm = (event, lawfirmName) => {
    event.stopPropagation();
    setCopiedLawFirmName(lawfirmName);
  }

  const handleCopyNormalizeLawFirm = (event, cellData, rowIndex) => {
    event.stopPropagation();
    const oldItems = [...lawFirms];
    setCopiedLawFirmName(oldItems[rowIndex].representative_name != null ? oldItems[rowIndex].representative_name : '');
  }
  

  const handleCopyLawyer = (event, lawyerName) => {
    event.stopPropagation();
    setLawyerNameCopy(lawyerName);
  }

  const handleLawyerNormalizeCopy = (event, cellData, rowIndex) => {
    event.stopPropagation();
    const oldItems = [...lawyers];
    setLawyerNameCopy(oldItems[rowIndex].representativelawyers != null ? oldItems[rowIndex].representativelawyers.representative_name : '');
  }

  const handlePaste = (entityName, rowIndex) => {
    if(normalizename != undefined) {
      let selectedNames = [...entityselectionnames], oldSelection = [...entityrowselection], rowSelection = [...selectEntityRow]
      const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
      if(selectedNames.indexOf(entityName) < 0) {
        selectedNames.push(entityName);
        oldSelection.push(oldItems[rowIndex]['id']);
        rowSelection.push(oldItems[rowIndex])
      }

      setEntityRowSelectionNames(selectedNames);
      setEntityRowSelection(oldSelection);
      updateEntityData(selectedNames, oldSelection, rowSelection, normalizename);
      
    } else {
      alert("Please select normalize entity first.");
    }
  }

  const handlePasteLawFirm = (lawFirmID, rowIndex) => {
    if(lawFirmNormalizeName != '') {
      let oldSelection = [...lawfirmrowselection];
      if(oldSelection.indexOf(lawFirmID) < 0) {
        oldSelection.push(lawFirmID);
      }
      setLawFirmRowSelection(oldSelection);
      updateLawFirmData(oldSelection, lawFirmNormalizeName);
      //updateLawFirmSelectedRows(oldSelection, lawFirmNormalizeName);
    } else {
      alert('Please select normalize law firm first.')
    }
  }

  const handlePasteLawyer = (lawyerID, rowIndex) => {
    if(lawyerNormalizeName != '') {
      let oldSelection = [...lawyerrowselection];
      if(oldSelection.indexOf(lawyerID) < 0) {
        oldSelection.push(lawyerID);
      }
      setLawyerRowSelection(oldSelection);
      updateLawyerData(oldSelection, lawyerNormalizeName);
      updateLawyerSelectedRows(oldSelection, lawyerNormalizeName);
    } else {
      alert('Please select lawyer normalize name first.')
    }
  }


  const findEntityAssets = (entityID) => {
    props.setEntityAssets({entity_id: entityID, count: 0});
    props.getEntityAssets(entityID);
  }

  const updateLawyerSelectedRows = (oldSelection, normalizeName) => {
    let oldItems = [...lawyers];
    (async () => { 
      const promises = oldSelection.map( ID => {
        oldItems.some( (c, index) => {
          if(c.lawyer_id == ID) {
            oldItems[index].representativelawyers =  normalizeName == '' ? null : {representative_id: 0, representative_name: normalizeName};
            return true;
          }
          return false;
        });
        return ID;
      });

      await Promise.all(promises);
      setLawyerRowSelection([]);
      setLawyers(oldItems);
      setLawyerInitial(oldItems);
    })();
  }
  
  const updateLawFirmSelectedRows = (oldSelection, normalizeName) => {
    let oldItems = [...lawFirms];
    (async () => { 
      const promises = oldSelection.map( ID => {
        oldItems.some( (c, index) => {
          if(c.law_firm_id == ID) {
            oldItems[index].representativelawfirm =  normalizeName == '' ? null : {representative_id: 0, representative_name: normalizeName};
            return true;
          }
          return false;
        });
        return ID;
      });

      await Promise.all(promises);
      setLawFirmRowSelection([]);
      setLawFirms(oldItems);
      setLawFirmsInitial(oldItems);
    })();
  }

  const lawFirmScroll = ({clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
    setLawFirmScrollTop(scrollTop)
  }

  const handleCompanyScroll = ({clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
    setCompanyScrollTop(scrollTop)
  }

  const handleEntityScroll = ({clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
    setEntityScrollTop(scrollTop)
  }

  const handleTransactionScroll = ({clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
    setTransactionScrollTop(scrollTop)
  }

  const updateLawFirmData = (selectedIDs, normalizename) => {
    if(selectedIDs.length > 0) {
      const  promise = []; let allUpdates = [];
      let formData = new FormData();
      formData.append('law_firm_ids', JSON.stringify(selectedIDs));
      formData.append('normalize_name', normalizename );
      formData.append('client_id', props.clientID);
      promise.push(
        PatenTrackApi
        .updateNormalizeLawFirms(formData)
        .then(res => {
          if(res.data.length > 0) {
            allUpdates = res.data;
          }
        })
        .catch(err => {
          throw(err);
        })
      );
      Promise
      .all(promise)
      .then(() => {
        setLawFirmRowSelection([]);
        setLawFirms([]);
        if(allUpdates.length > 0) {
          updateLawFirmRows(allUpdates);
        }
      })  
    }
  }

  const updateLawFirmRows = ( data ) => {
    const oldRows = [...lawFirms];
    (async () => {
      const promise = data.map(d => {
        const rowIndex = oldRows.findIndex( r => r.law_firm_id == d.law_firm_id);
        if( rowIndex !== -1 ) {          
          //oldRows[rowIndex] = d;
          if(d.representativelawfirm != null) {
            oldRows[rowIndex].representative_id = d.representativelawfirm.representative_id;
            oldRows[rowIndex].representative_name = d.representativelawfirm.representative_name;
          } else if(d.representativelawfirm == null &&  oldRows[rowIndex].representative_name != ''){
            delete oldRows[rowIndex].representative_id
            delete oldRows[rowIndex].representative_name
          }         
        }        
        return d;
      });
      await Promise.all(promise);
      setLawFirms(oldRows);
      setLawFirmsInitial(oldRows);
    })(); 
  }

  const updateEntityData = (selectedNames, oldSelection, rowSelection, normalizename) => {
    if(selectedNames.length > 0) {
      const  promise = []; let allUpdates = [];
      let formData = new FormData();
      formData.append('IDs', JSON.stringify(oldSelection));
      formData.append('normalize_name', normalizename );
      formData.append('selected_rows', JSON.stringify(rowSelection))
      promise.push(
        PatenTrackApi
        .updateNormalizeEntites(formData)
        .then(res => {
          if(res.data.length > 0) {
            allUpdates = res.data;
          }
        })
        .catch(err => {
          throw(err);
        })
      );
      Promise
      .all(promise)
      .then(() => {
        setEntityRowSelection([]);
        setEntityRowSelectionNames([]);
        setSelectEntityRow([]);
        if(allUpdates.length > 0) {
          updateRows(allUpdates);
        }
      })
      /* selectedNames.forEach( name => {
        let formData = new FormData();
          formData.append('name', name );
          formData.append('normalize_name', normalizename );
          //props.updateNormalizeEntites(formData);
          promise.push(
            PatenTrackApi
            .updateNormalizeEntites(formData)
            .then(res => {
              try{
                if(Object.keys(res.data).length > 0) {
                  allUpdates.push({
                    name: name,
                    normalizename: normalizename,
                    data: res.data
                  })                
                }
              } catch (e) {
                console.log(e);
              }
            })
            .catch(err => {
              throw(err);
            })
          );
      }) */
      Promise
      .all(promise)
      .then(() => {
        setEntityRowSelection([]);
        setEntityRowSelectionNames([]);
        setSelectEntityRow([]);
        if(allUpdates.length > 0) {
          updateRows(allUpdates);
        }
      })
    }    
  }

  const updateRows = ( data ) => {
    const oldRows = entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
    (async () => {
      const promise = data.map(d => {
        const rowIndex = oldRows.findIndex( r => r.id == d.id);
        if( rowIndex >= 0 ) {
          oldRows[rowIndex].normalize_name = d.normalize_name;
          oldRows[rowIndex].representative_company = d.representative_company;
        }        
        return d;
      });
      await Promise.all(promise);
      if(entitiesrow.length > 0){
        setEntitesRow(oldRows)
      } else {
        setRowsInitial(oldRows);   
        let oldData = [...rows];
        const promise = data.map(d => {
          const findIndex = oldData.findIndex( r => r.id == d.id);
          if(findIndex >= 0) {
            oldData[findIndex].normalize_name = d.normalize_name;
            oldData[findIndex].representative_company = d.representative_company;
          }
          if(d.normalizeName != "") {          
            const findIndex = oldData.findIndex( row => {
              return row.name == d.normalizeName;
            });
            if(findIndex >= 0) {
              oldData[findIndex].representative_company = d.normalizeName;
            }
          }
          return d;
        })
        await Promise.all(promise);
        setRows(oldData);
      }
    })();
  }

  const updateLawyerData = (selectedIDs, normalizename) => {
    if(selectedIDs.length > 0) {
      let formData = new FormData();
      formData.append('lawyer_ids', JSON.stringify(selectedIDs));
      formData.append('normalize_name', normalizename );
      props.updateNormalizeLawyers(formData);
    }
  }

  const handleClearAddress = () => {
    let formData = new FormData();
    props.cleanAddress(props.clientID, props.portfolioList, formData);
  };

  const handleManualAddress = () => {
    setColumnClickable(!columnClickable)
  }

  const handleDelete = (name, rowIndex) => {
    const deleteID = entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rowsInitial[rowIndex]['id'];
    const row = entitiesrow.length > 0 ? entitiesrow[rowIndex] : rowsInitial[rowIndex];
    updateEntityData([name], [deleteID], [row], '');
    /* const type = entitiesrow.length > 0 ? 2 : 1
    const deleteID = entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rowsInitial[rowIndex]['id'];
    updateSelectedRows([deleteID], [name], type, ''); */
  }

  const handleDeleteLawFirm = (ID, rowIndex) => {
    updateLawFirmData([ID], '');
    //updateLawFirmSelectedRows([ID], '');
  }

  const handleDeleteLawyer = (ID, rowIndex) => {
    updateLawyerData([ID], '');
    updateLawyerSelectedRows([ID], '');
  }

  const isRowSelected = rowIndex => entityrowselection.indexOf(entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rowsInitial[rowIndex]['id']) !== -1;

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

  const isLawFirmRowSelected = rowIndex => lawfirmrowselection.indexOf(lawFirms[rowIndex]['law_firm_id']) !== -1;

  const checkLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
    <Checkbox
    checked={isLawFirmRowSelected(rowIndex)}
    onClick={(event) => selectLawFirmRow(event, cellData, rowIndex)}
    value={cellData}
    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
    />
    )
  }

  const copyLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleCopyLawFirm(event, cellData, rowIndex)}}
    >
      {
        <i className={"fa fa-copy"} title="Copy"></i>
      }
      </IconButton>
    )
  }

  const pasteLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handlePasteLawFirm(cellData, rowIndex)}}
      >
        {
          <i className={"fa fa-paste"} title="Paste"></i>
        }
      </IconButton>
    )
  }

  const deleteLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handleDeleteLawFirm(cellData, rowIndex)}}
      >
        {
          <i className={"fa fa-trash"} title="Delete"></i>
        }
      </IconButton>
    )
  }

  const normalizeLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return lawFirms[rowIndex].representative_name != null ? lawFirms[rowIndex].representative_name : '';
  }

  const copyNormalizeLawFirmCellRenderer = ({dataKey, cellData, columnIndex = null, rowIndex}) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleCopyNormalizeLawFirm(event, cellData, rowIndex)}}
    >
      {
        <i className={"fa fa-copy"} title="Copy"></i>
      }
      </IconButton>
    )
  }


  const isLawyerRowSelected = rowIndex => lawyerrowselection.indexOf(lawyers[rowIndex]['lawyer_id']) !== -1;

  const checkLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
    <Checkbox
    checked={isLawyerRowSelected(rowIndex)}
    onClick={(event) => selectLawyerRow(event, cellData, rowIndex)}
    value={cellData}
    inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
    />
    )
  }

  const copyLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleCopyLawyer(event, cellData, rowIndex)}}
    >
      {
        <i className={"fa fa-copy"} title="Copy"></i>
      }
      </IconButton>
    )
  }

  const pasteLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handlePasteLawyer(cellData, rowIndex)}}
      >
        {
          <i className={"fa fa-paste"} title="Paste"></i>
        }
      </IconButton>
    )
  }

  const deleteLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
        color             = "inherit"
        aria-haspopup     = "true"
        onClick           = {() => {handleDeleteLawyer(cellData, rowIndex)}}
      >
        {
          <i className={"fa fa-trash"} title="Delete"></i>
        }
      </IconButton>
    )
  }

  const normalizeLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return lawyers[rowIndex].representativelawyers != null ? lawyers[rowIndex].representativelawyers.representative_name : '';
  }


  const copyNormalizeLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleLawyerNormalizeCopy(event, cellData, rowIndex)}}
    >
      {
        <i className={"fa fa-copy"} title="Copy"></i>
      }
      </IconButton>
    )
  }

  const normalizeLawyerLawFirmNameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=corrName:%22${encodeURIComponent(lawyers[rowIndex].lawfirms.law_firm_name)}%22&qc=1`;
    const name = lawyers[rowIndex].lawfirms.representativelawfirm != null  ? lawyers[rowIndex].lawfirms.representativelawfirm.representative_name : lawyers[rowIndex].lawfirms.law_firm_name;
    return (
      <a href={urlString} target='_blank'>{name}</a>
    );
  }

  
  const copyCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return (
      <IconButton
      color             = "inherit"
      aria-haspopup     = "true"
      onClick           = {(event) => {handleCopy(event, cellData, rowIndex)}}
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
          <i className={"fa fa-trash"} title="Delete"></i>
        }
      </IconButton>
    )
  }

  const handleChange = (event, ID, text, rowIndex) => {
    let formData = new FormData();
    formData.append("text", text );
    formData.append("updated_convey_ty", event.target.value);
    formData.append("rf_id", ID ); 
    props.transactionUpdate(formData, props.clientID);
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

  const handleTypeChange = (type, event, dataKey) => {
    const value = event.target.value
    if(type === 0) {
      setHeaderType(value);
    } else {
      setUpdateHeaderType(value);
    }

    if(value == '' && (headerType != '' || updateHeaderType != '')) {
      if(type === 0 && updateHeaderType != '') {
        handleSearchTransaction(1, updateHeaderType, ['updated_convey_ty'])
      } else if(type === 1 && headerType != '') {
        handleSearchTransaction(1, headerType, ['convey_ty'])
      } else {
        handleSearchTransaction(1, value, [dataKey])
      }
    } else {
      if(type === 0 && updateHeaderType != '') {
        handleSearchTransaction(1, [value, updateHeaderType], [dataKey, 'updated_convey_ty'])
      } else if(type === 1 && headerType != '') {
        handleSearchTransaction(1, [headerType, value], ['convey_ty', dataKey])
      } else {
        handleSearchTransaction(1, value, [dataKey]) 
      }
    }
    
    /* if(inputSearchTransaction.current.querySelector("#search_transaction") != null) {
      inputSearchTransaction.current.querySelector("#search_transaction").value = event.target.value;
    } */
    /*handleSearchTransaction(1, value != '' ? value : type === 0 ? updateHeaderType != '' ? updateHeaderType : headerType : '', type === 0 && updateHeaderType != '' && value != '' ? [dataKey, 'updated_convey_ty'] : type === 1 && headerType !== '' && value != '' ? ['convey_ty', dataKey] : value == '' && t== ? : [dataKey] );*/
    /*searchFromTransaction(['convey_ty'], event.target.value);  */  
  }

  const resizeColumnsWidth = useCallback((dataKey, data) => {
    setHeaderColumnWidth(headerColumnWidth != null ? headerColumnWidth : staticWidth + data.x)
  }, [ headerColumnWidth, staticWidth ] )

  const renderWithDrag = ({ dataKey, label, sortBy, sortDirection }) => {
    return (
      <div>
        <Draggable
          axis="x"
          defaultClassName="DragHandle"
          defaultClassNameDragging="DragHandleActive"
          onDrag={(event, data) => 
            resizeColumnsWidth(
              dataKey,
              data
            )
          } 
          position={{ x: 0 }}
          zIndex={999}
        >
          <span className="DragHandleIcon">⋮</span>
        </Draggable>
        {label}
        {sortBy === dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>
    );
  }

  const typeHeaderRenderer = ({ dataKey, sortBy, sortDirection }) => {
    return (
      <div>
        <Select
          value={headerType}
          onChange={(event) => handleTypeChange(0, event, dataKey )}
          style={{width: '65%', marginRight: 15}}
        >
          <MenuItem key= {'0'} value={''}>{'Unselect'}</MenuItem>
          {originalConveyanceType.map((option) => (
            <MenuItem key={option.name} value={option.name}>{option.name}</MenuItem>
          ))}
        </Select>
        {sortBy === dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>  
    );
  }

  const modifierConveyanceTypeHeaderRenderer = ({ label, dataKey, sortBy, sortDirection }) => {
    return (
      <div>
        <Select
          value={updateHeaderType}
          onChange={(event) => handleTypeChange(1, event, dataKey )}
          style={{width: '65%', marginRight: 15}}
        >
          <MenuItem key= {'0'} value={''}>{'Unselect'}</MenuItem>
          {modifierConveyanceType.map((option) => (
            <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
          ))}
        </Select> 
        {label}
        {sortBy === dataKey &&
          <SortIndicator sortDirection={sortDirection} />
        }
      </div>
    );
  }

  const handleReelFrame = ID => {
    setActiveReel(ID);
  }

  const reelframeCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    if(cellData != ''){
      const oldItems = assignmentrow.length > 0 ? [...assignmentrow] : [...transactionrow];
      const reelNo = oldItems[rowIndex]['reel_no'], frameNo = oldItems[rowIndex]['frame_no'];
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return (<a href={urlString} target='_blank' onClick={() => handleReelFrame(oldItems[rowIndex]['id'])} className={activeReel == oldItems[rowIndex]['id'] ? classes.selected : ''}>{oldItems[rowIndex]['reel_frame']}</a>)
    } else {
      return '';
    }    
  }

  const assetsCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    if(cellData != '') {
      const oldItems = [...recent_transactions]
      console.log("oldItems", oldItems[rowIndex], cellData)
      const reelNo = oldItems[rowIndex]['reel_no'], frameNo = oldItems[rowIndex]['frame_no'];
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return (<a href={urlString} target='_blank' onClick={() => handleReelFrame(oldItems[rowIndex]['id'])} className={activeReel == oldItems[rowIndex]['id'] ? classes.selected : ''}>{cellData}</a>)
    } else {
      return '';
    } 
  }

  const buttonsCellRenderer = ({dataKey, cellData, columnIndex = null, rowIndex}) => {
    if(cellData != ''){ 
      return (
        <>          
          <a onClick={() => {handleUpdateAssignment(cellData, 1)}} className={`${classes.btnAssignment}`}>Caddress1</a>
          <a onClick={() => {handleUpdateAssignment(cellData, 2)}} className={`${classes.btnAssignment} ${classes.last}`}>caddress_2</a>
          <a onClick={() => {handleUpdateAssignment(cellData, 3)}} className={`${classes.btnAssignment} ${classes.last}`}>Both</a>
        </>
      )
    } else {
      return '';
    } 
  }

  const swapButtons = ({dataKey, cellData, columnIndex = null, rowIndex}) => {
    if(cellData != ''){ 
      return (
        <React.Fragment>          
          <a onClick={() => {handleSwapAddressData(rowIndex, 1)}} className={`${classes.btnAssignment}`}>Lawyer/Firm</a>
          <a onClick={() => {handleSwapAddressData(rowIndex, 2)}} className={`${classes.btnAssignment} ${classes.last}`}>Firm/Excess</a>
          <a onClick={() => {handleSwapAddressData(rowIndex, 3)}} className={`${classes.btnAssignment} ${classes.last}`}>Lawyer/Excess</a>
        </React.Fragment>
      )
    } else {
      return '';
    } 
  }

  const handleSwapAddressData = (rowIndex, type) => {
    const rowAddress = assignmentrow[rowIndex]
    if(type == 1) {
      const oldData = rowAddress['caddress_1']
      rowAddress['caddress_1'] = rowAddress['cname']
      rowAddress['cname'] = oldData
    } else if(type == 2) {
      const oldData = rowAddress['caddress_2']
      rowAddress['caddress_2'] = rowAddress['cname']
      rowAddress['cname'] = oldData
    } else if(type == 3) {
      const oldData = rowAddress['caddress_2']
      rowAddress['caddress_2'] = rowAddress['caddress_1']
      rowAddress['caddress_1'] = oldData
    }
    /**
     * Update Data
     */
    updateAddressRowData(rowAddress, rowIndex, 1, type)
  }

  const handleColumnClickable = ({dataKey, cellData, columnIndex, rowIndex}) => {
    if(columnClickable){
      return (
        <span className={classes.anchorButton} onClick={() => renderNewData(dataKey, cellData, columnIndex, rowIndex)}>{cellData}</span>
      )
    } else {
      const oldItems = [...assignmentrow];
      const reelNo = oldItems[rowIndex]['reel_no'], frameNo = oldItems[rowIndex]['frame_no'];
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return dataKey == 'cname' || dataKey == 'caddress_1' ? (<a href={urlString} target='_blank' onClick={() => handleReelFrame(oldItems[rowIndex]['id'])} className={activeReel == oldItems[rowIndex]['id'] ? classes.selected : ''}>{cellData}</a>) : cellData
    }
  }

  const renderNewData = (dataKey, cellData, columnIndex, rowIndex) => {
    /**
     * Move column data
     */
    let update = false, rowAddress = assignmentrow[rowIndex]
    if(dataKey == 'caddress_4' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.cname == "") {
        rowAddress.cname = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.caddress_6 == "") {
        rowAddress.caddress_6 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      } else if(rowAddress.caddress_3 == "") {
        rowAddress.caddress_3 = cellData;
        rowAddress.caddress_4 = ''
        update = true
      }
    } else if(dataKey == 'caddress_3' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.caddress_3 = ''
        update = true
      }  else if(rowAddress.cname == "") {
        rowAddress.cname = cellData;
        rowAddress.caddress_3 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_3 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_3 = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.caddress_3 = ''
        update = true
      } else if(rowAddress.caddress_6 == "") {
        rowAddress.caddress_6 = cellData;
        rowAddress.caddress_3 = ''
        update = true
      }
    } else if(dataKey == 'caddress_6' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.caddress_6 = ''
        update = true
      } else if(rowAddress.cname == "") {
        rowAddress.cname = cellData;
        rowAddress.caddress_6 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_6 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_6 = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.caddress_6 = ''
        update = true
      }
    } else if(dataKey == 'caddress_5' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.caddress_5 = ''
        update = true
      } else if(rowAddress.cname == "") {
        rowAddress.cname = cellData;
        rowAddress.caddress_5 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_5 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_5 = ''
        update = true
      }
    } else if(dataKey == 'caddress_7' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.caddress_7 = ''
        update = true
      } else if(rowAddress.cname == "") {
        rowAddress.cname = cellData;
        rowAddress.caddress_7 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_7 = ''
        update = true
      }
    } else if(dataKey == 'caddress_2' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_4 == "") {
        rowAddress.caddress_4 = cellData;
        rowAddress.caddress_2 = ''
        update = true
      } else if(rowAddress.caddress_3 == "") {
        rowAddress.caddress_3 = cellData;
        rowAddress.caddress_2 = ''
        update = true
      } else if(rowAddress.caddress_6 == "") {
        rowAddress.caddress_6 = cellData;
        rowAddress.caddress_2 = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.caddress_2 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_2 = ''
        update = true
      }
    } else if(dataKey == 'caddress_1' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_4 == "") {
        rowAddress.caddress_4 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      } else if(rowAddress.caddress_3 == "") {
        rowAddress.caddress_3 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      } else if(rowAddress.caddress_6 == "") {
        rowAddress.caddress_6 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.caddress_1 = ''
        update = true
      }
    } else if(dataKey == 'cname' && cellData !== '' && cellData != null) {
      if(rowAddress.caddress_4 == "") {
        rowAddress.caddress_4 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_3 == "") {
        rowAddress.caddress_3 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_6 == "") {
        rowAddress.caddress_6 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_5 == "") {
        rowAddress.caddress_5 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_7 == "") {
        rowAddress.caddress_7 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_2 == "") {
        rowAddress.caddress_2 = cellData;
        rowAddress.cname = ''
        update = true
      } else if(rowAddress.caddress_1 == "") {
        rowAddress.caddress_1 = cellData;
        rowAddress.cname = ''
        update = true
      }
    }
   
    if(update === true) {
      /**
       * Update Data
       */
      updateAddressRowData(rowAddress, rowIndex, 0)
    }
  }

  const updateAddressRowData = (rowAddress, rowIndex, type = 0, flag) => {
    let form = new FormData();
    Object.keys(rowAddress).forEach( item => {
      if(item != 'id' && item != 'frame_no' && item != 'reel_no') {
        form.append(item, rowAddress[item]);
      }
    })
    form.append('type', type)
    form.append('flag', flag)
    form.append('client_id', props.clientID);
    console.log(form)
    const oldItem = [...assignmentrow]
    props.assignmentUpdate(form);
    oldItem[rowIndex] = rowAddress

    if(typeof flag != 'undefined') { 
      let cname = '', caddress_1 = '', caddress_2 = '', temp = '';
      console.log(rowAddress)
      switch(flag) {
        case 1:
          cname = oldItem[rowIndex]['cname']
            oldItem.forEach((r, index) => {
              if(index != rowIndex){
                if(r.caddress_1.toLowerCase() == cname.toLowerCase() /*|| cname.toLowerCase() == r.caddress_1.toLowerCase()*/){
                  temp = oldItem[index]['cname']
                  oldItem[index]['cname'] = oldItem[index]['caddress_1']
                  oldItem[index]['caddress_1'] = temp
                }
              }
            })
          break;
        case 2:
          cname = oldItem[rowIndex]['cname']
          oldItem.forEach((r, index) => {
            if(index != rowIndex){
              if(r.caddress_2.toLowerCase() == cname.toLowerCase() /* || caddress_2.toLowerCase() == r.caddress_1.toLowerCase() */){
                temp = oldItem[index]['caddress_2']
                oldItem[index]['caddress_2'] = oldItem[index]['cname']
                oldItem[index]['cname'] = temp
              }
            }
          })
          break;
        case 3:
          caddress_2 = oldItem[rowIndex]['caddress_2']
          oldItem.forEach((r, index) => {
            if(index != rowIndex){
              if(r.caddress_1.toLowerCase() == caddress_2.toLowerCase() /* || caddress_2.toLowerCase() == r.cname.toLowerCase() */){
                temp = oldItem[index]['caddress_2']
                oldItem[index]['caddress_2'] = oldItem[index]['caddress_1']
                oldItem[index]['caddress_1'] = temp
              }
            }
          })
          break;
      }
    }
    setAssignmentRow(oldItem)
    setAssignmentIntialRow(oldItem)
  }

  const nameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const oldItems = entitiesrow.length > 0 ? entitiesrow : rowsInitial;
    if(entitiesrow.length > 0) {
      const rfID = entitiesrow[rowIndex]['rf_id'] != null ? entitiesrow[rowIndex]['rf_id'].toString() : entitiesrow[rowIndex]['assigneeRFID'] != null ? entitiesrow[rowIndex]['assigneeRFID'].toString() : entitiesrow[rowIndex]['assignorRFID'] != null ? entitiesrow[rowIndex]['assignorRFID'].toString() : '';
      let reelNo = rfID.substring(0,5), frameNo = parseInt(rfID.substring(5, rfID.length));
      if(reelNo.substring(reelNo.length - 1 , reelNo.length) == '0') {
        reelNo = reelNo.substring(0, reelNo.length - 1);
      }

      const {flag} = oldItems[rowIndex]
    
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return (
        <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : oldItems[rowIndex]['normalize_name'] != '' && oldItems[rowIndex]['normalize_name'] != null ? classes.normalizedRow : flag != undefined && parseInt(flag) === 4 ? classes.inventorRow : classes.white} title={cellData}><span className={classes.searchIcon}>
        <SearchIcon onClick={() => openCompanyAddressInModal(oldItems[rowIndex]['id'], cellData)}/></span><a href={urlString}  target='_blank' onClick={() => setClickedActiveCompany(cellData)} className={clickedActiveCompany == cellData ? classes.selected : ""}>{cellData}</a></span>
      )

    } else {
      const findAssets = oldItems[rowIndex]['count_assets'] != undefined ? <a style={{marginLeft:'10px'}} className={classes.pointer} onClick={() => findEntityAssets(oldItems[rowIndex]['assignor_and_assignee_id'])}>({oldItems[rowIndex]['count_assets']})</a> : '';
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/result?id=${cellData}&type=patAssigneeName`;
      return (
      <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : oldItems[rowIndex]['normalize_name'] != '' && oldItems[rowIndex]['normalize_name'] != null ? classes.normalizedRow : ''} title={cellData}><a href={urlString} target='_blank' onClick={() => setClickedActiveCompany(cellData)} className={clickedActiveCompany == cellData ? classes.rowBold : ""}>{cellData}</a>{findAssets}</span>
      )
    }    
  }

  const openCompanyAddressInModal = (assignorAndAssigneeID, cellData, flag) => {
    setClickedActiveCompany(cellData)
    props.setSearchedCompanyAddress(assignorAndAssigneeID)
    props.setSearchCompanyAddressModal(true)
    props.setSearchByCompanyIDAddress([]);
    props.getCompanyListByAddress(assignorAndAssigneeID, props.company_modal,flag)
  }

  const nameRFIDCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const oldItems = [...rowsInitial];
    const {flag} = oldItems[rowIndex]
    const rfID =  oldItems[rowIndex]['assigneeRFID'] != null ? oldItems[rowIndex]['assigneeRFID'].toString() : oldItems[rowIndex]['assignorRFID'] != null ? oldItems[rowIndex]['assignorRFID'].toString() : '';
    let reelNo = flag != undefined && (parseInt(flag) === 2 ||  parseInt(flag) === 3) ? [] : rfID.split('-');    
    const findAssets = oldItems[rowIndex]['count_assets'] != undefined ? <a style={{marginLeft:'10px'}} className={classes.pointer} onClick={() => findEntityAssets(oldItems[rowIndex]['assignor_and_assignee_id'])}>({oldItems[rowIndex]['count_assets']})</a> : '';
    
    let urlString = flag != undefined && parseInt(flag) === 2 ? `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAbstract?id=${rfID}&type=applNum` : `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=reelNo:${reelNo[0]}%7CframeNo:${reelNo[1]}&qc=1&reelNo=${reelNo[0]}&frameNo=${reelNo[1]}`;

      return (
        <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : oldItems[rowIndex]['normalize_name'] != '' && oldItems[rowIndex]['normalize_name'] != null ? classes.normalizedRow : flag != undefined && parseInt(flag) === 2 ? classes.applicantRow : flag != undefined && parseInt(flag) === 3 ? classes.partiesRow : ''} title={cellData}><span className={classes.searchIcon}><SearchIcon onClick={() => openCompanyAddressInModal(oldItems[rowIndex]['assignor_and_assignee_id'], cellData, flag)}/></span><a href={urlString} target='_blank' className={cellData == clickedActiveCompany ? classes.rowBold : ''} onClick={() => setClickedActiveCompany(cellData)}>{cellData}</a>{findAssets}</span>
      )
  }

  const openLawfirmAddressInModal = (lawFirmID, cellData) => {
    setClickedActiveCompany(cellData)
    props.setSearchedAddressLawfirm(lawFirmID)
    props.setSearchAddressModal(true)
    props.setSearchByIDLawfirmAddress([]);
    props.getLawfirmListByAddress(lawFirmID)
  }

  const nameLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {  
    const oldItems = [...lawFirms];
    const urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=corrName:%22${encodeURIComponent(cellData)}%22&qc=1`;
    
    return (
      <span className={cellData === lawFirmNormalizeName ? classes.activeCopyRow : oldItems[rowIndex].representative_name == cellData ? classes.activeRepresentative : oldItems[rowIndex].representative_name != null ? classes.normalizedRow : classes.white} title={cellData}><span className={classes.searchIcon}><SearchIcon onClick={() => openLawfirmAddressInModal(oldItems[rowIndex]['law_firm_id'], cellData)}/></span><a href={urlString} className={cellData == clickedActiveCompany ? classes.rowBold : ''} onClick={() => setClickedActiveCompany(cellData)} target='_blank'>{cellData}</a></span>
    )
  }

  const nameLawyerCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const oldItems = [...lawyers]
    return (
      <span className={cellData === lawyerNormalizeName ? classes.activeCopyRow : oldItems[rowIndex].representativelawyers != null && oldItems[rowIndex].representativelawyers.representative_name == cellData ? classes.activeRepresentative : classes.white} title={cellData}>{cellData}</span>
    )
  }

  const assetCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    let  asset = cellData;
    let activeClass = "";
    if(asset == ''){
      asset = assetList[rowIndex]['application'].toString()
      activeClass = asset == selectedAsset ? classes.activeCopyRow : ''
      asset = applicationFormat(asset)
    } else {
      asset = numberWithCommas(asset)
    }
    if(activeClass == '' && (cellData == selectedAsset || assetList[rowIndex]['application'] == selectedAsset)) {
      activeClass = classes.activeCopyRow;
    }
    return (
      <Button variant="text" className={` ${activeClass}`} onClick={(event) => openAssetIllustration(event, assetList[rowIndex])}>{asset}</Button>
    )
  }

  const openAssetIllustration = (event, row) => {
    let selectedAssets = row.number != '' ? row.number : row.application
    setSelectedAsset(selectedAssets);
    props.getAssets(selectedAssets, row.number !== '' ? 1 : 0 );
  } 

  const downloadJSON = () => {
    console.log("downloadJSON");
    if(selectedAsset != "" && Object.keys(props.assetJSON).length > 0) {
      let filename = selectedAsset+".json";
      let blob = new Blob([JSON.stringify(props.assetJSON)], {
        type: "application/json;charset=utf-8"
      });
      var element = document.createElement('a');
      var url = URL.createObjectURL(blob);
      element.href = url;
      element.setAttribute('download', filename);
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);
    } else {
      alert("Please select asset first");
    }
  }

  const handlePdfView = (obj) => {
    console.log("handlePdfView", obj);
    if(typeof obj.document_file != "undefined") {
      props.setPDFFile({document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement}); 
      props.setPDFView(true);
      props.setPdfTabIndex(0); 
    } else {
      alert("No document found!");
    }
  }

  const handleUpdateAssignment = (rfID, type) => {
    let form = new FormData();
    form.append("rf_id", rfID);
    form.append("type", type);
    props.assignmentUpdate(form);
    
    let oldItems = [...assignmentrow];
    const findIndex = oldItems.findIndex( r => r.rf_id == rfID);

    if(findIndex >= 0) {
      if(type == 1) {
        const {caddress_2} = oldItems[findIndex];
        oldItems[findIndex].caddress_1 = caddress_2;
        oldItems[findIndex].caddress_2 = '';
      } else {
        oldItems[findIndex].caddress_2 = '';
        oldItems[findIndex].caddress_1 = type == 3 ? '' : oldItems[findIndex].caddress_1;
      }
    }
    setAssignmentRow(oldItems);
    setAssignmentIntialRow(oldItems);
  }

  const handleShare = (obj) => {
    console.log("handleShare", obj);
    if(obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      let form = new FormData();
      form.append("assets", obj.original_number);
      form.append("type", 2);
      props.share(form);
    }
  }
  
  const handleComment = (obj) => {
    console.log("handleComment", obj);
  }

  const handleConnectionBox = (obj) => {
    console.log("handleConnectionBox", obj);
    if(typeof obj.popup != "undefined"){
      props.setConnectionData(obj);
      props.setConnectionBoxView(true);
    }
  }

  const handleFocus = () => {
    /*inputSearchCompany.current.querySelector("#search_company").value = '';
    inputSearchTransaction.current.querySelector("#search_transaction").value = '';
    inputSearchLawyer.current.querySelector("#search_lawyer").value = '';
    resetAll();*/
  }

  const handlingAssetsCounterHolding = () => {
    const oldItems = [...rows];
    const noOfRequests = oldItems.length, parallelRequest = 20, /*loopCount = parseInt(noOfRequests / parallelRequest)*/ loopCount = 1;
    let requestCount = 0, promiseBuffer = [];
    (async () => {
      for(let i = 0; i < loopCount; i++) {
        for(let j = 0; j < parallelRequest; j++) {
          requestCount++;
          promiseBuffer.push(PatenTrackApi.getEntityAsset(oldItems[j].assignor_and_assignee_id));
        }

        //loop is paused untill all promises in buffered are resolved
        const result = await Promise.all(promiseBuffer);

        let lastRequestStart = requestCount - parallelRequest;
       
        const resultPromise = result.map( r => {
          oldItems[lastRequestStart].count_assets = r.data.count;
          lastRequestStart++;
          return r;


          /*const findIndex = oldItems.findIndex(row => {
            return row.assignor_and_assignee_id == r.data.entity_id;
          });
          if(findIndex >=0) {
            oldItems[findIndex].count_assets = r.data.count;
          }
          return r;*/
        });

        await Promise.all(resultPromise);

        

        setRows(oldItems);
        //reset buffer once done and continue with nest set of parallel requests.
        promiseBuffer.splice(0, promiseBuffer.length);
      }
    })();
  }

  const onHandleAddSelectedCompaniesToAccount = () => {
    console.log("to account", props.accountList);
    if(entityrowselection.length > 0) {
      console.log(JSON.stringify(entityrowselection))
      props.setAddCompanyToAccountType(1)
      props.setAddCompanyToAccountGroup('')
      props.setAddCompanyToAccountRepresentatives(entityselectionnames)
      props.setAddCompanyToAccountModal(true)
    } else {
      alert("Please select rows from table first.")
    }
  }

  const onHandleSelectAccount = async(event) => { 
    setAccount(parseInt(event.target.value))    
  }

  const onHandleCloseNormalizeLawfirm = () => {
    setNormalisedLawfirmsModal(!normalizedLawfirmModal)
  }

  const onHandleCloseNormalizeCompanyModal = () => {
    setNormalisedCompanysModal(!normalizedCompanyModal)
  }


  const handleChangeDefaultSeachItem = (event) => {
    setDefaultSearchItemOpen(event.target.checked)
  }

  const preg_match_all = (str) => {
    const regex = /\b(?:inc|llc|corporation|corp|systems|system|llp|industries|gmbh|lp|agent|sas|na|bank|co|states|ltd|kk|a\/s|aktiebolag|kigyo|kaisha|university|kabushiki|company|plc|gesellschaft|gesmbh|société|societe|mbh|aktiengesellschaft|haftung|vennootschap|bv|bvba|aktien|limitata|srl|sarl|kommanditgesellschaft|kg|gesellschaft|gbr|ohg|handelsgesellschaft|compagnie|privatstiftung|foundation|technologies|technology|solutions|solution|networks|network|holding|holdings|health|animal|scientific|chemical|chemicals|pharmaceutical|trust|the|resources|government|college|support|pharma|pharmalink|labs|lab|pyramid|analytics|analytic|therapeutics|tigenix|nexstim|voluntis|elobix|nxp|ab|sa|acies|wakefield)\b/i

    return [...str.matchAll(new RegExp(regex, 'g'))].reduce((acc, group) => {
      group.filter((element) => typeof element === 'string').forEach((element, i) => {
        if (!acc[i]) acc[i] = [];
        acc[i].push(element);
      });
  
      return acc;
    }, []);
  }

  const getOccurrence = (list, findString) => {
    return list.reduce((counter, value) => { 
      let searchString = findString.trim().toLowerCase()
      if(searchString.indexOf('(') !== -1) {
        if(searchString.indexOf(')') == -1) {
          searchString = searchString.replace(/\(/g, '')
        }
      }
      const regex = new RegExp('\\b' + searchString + '\\b');
      if(value.toLowerCase().search(regex) !== -1) {
        counter += 1
      }
      return counter
    }, 0)
  }

  const onBringOldList = useCallback(() => {
    setSwitchButton(!showButton)
    setOriginalItem([])
    if(entitiesrow.length > 0 ){
      setEntitesRow(originalItems)
      setEntityIntialRows(originalItems)
    } else {
      setRowsInitial(originalItems)
      setRows(originalItems)
    }
  }, [entitiesrow, rows, originalItems, showButton])

  const onHandleUniqueEntities = useCallback(async(event) => {
    const items = entitiesrow.length > 0 ? [...entitiesrow] : [...rows]
    setOriginalItem(items)
    let newList = []
    if(items.length > 0) {   
      setSwitchButton(!showButton)
      const allName = [...items].reduce((acc, item) => {
        if (!acc) acc = [];  
        acc.push(item.name)
        return acc
      }, []);
      const promiseAllItem = items.map( (item, index) => {
        let {name} = item, replace = '' 
        name = name.toLowerCase()
        const findCoporateWords = preg_match_all(name)
        if(findCoporateWords.length > 0) {
          for(let i = 0; i < findCoporateWords[0].length; i++) {
            let regexCorporate = new RegExp(findCoporateWords[0][i], "gi");
            name = name.replace(regexCorporate, replace)
          }
        }
        name = name.trim()
        if(name != '' && name !== null && name != undefined) {
          const wordSplit = name.trim().split(' ')
          
          if(wordSplit.length == 1) {
            const singleItemCount = getOccurrence(allName, wordSplit[0])
            if(singleItemCount > 1) {
              newList = [...newList, item]
            }
          } else {
            for(let x = 0; x < wordSplit.length; x++) {
              if(!/\d/.test(wordSplit[x]) && wordSplit[x].length > 2) {
                const countItem = getOccurrence(allName, wordSplit[x])
                if(countItem > 1) {
                  newList = [...newList, item]
                  return false
                }
              }
            }
          }
        }
      })
      await Promise.all(promiseAllItem)
      if(entitiesrow.length > 0) {
        setEntitesRow(newList)
        setEntityIntialRows(newList)
      } else {
        setRows(newList)
        setRowsInitial(newList)
      }
    }
  }, [rows, entitiesrow, showButton] )

  const onHandleReclassifyPopup = async() => {
    if(props.clientID > 0 && props.portfolioList.length == 1) {
      setReClassifyLogData([])
      setOpenReClassifyModal(true)
      const {data} = await PatenTrackApi.getReClassifyData(props.clientID, props.portfolioList[0])
      if(data != null) {
        setReClassifyLogData(data) 
      }
    } else {
      alert("Please select account first.")
    } 
  }

  const onHandleCloseReClassifyModal = () => { 
    setOpenReClassifyModal(false)
  }

  const PaperComponent = (props) => {
    return (
      <Draggable
        handle="#draggable-dialog-title"
        cancel={'[class*="MuiDialogContent-root"]'}
      >
        <ResizableBox
          height={resizableWidthHeight[1]}
          width={resizableWidthHeight[0]}
          className={classes.resizable}
          onResizeStop={handleResize}
        > 
          <Box {...props} style={{height: '100%', width: '100%', background: '#424242', margin: 0}}/>
        </ResizableBox>
      </Draggable>
    );
  } 

  const handleResize = (event, {element, size, handle}) => {
    setResizableWidthHeight([size.width, size.height])
  }

  const handleDragStop = (e, position) => {
      const {x, y} = position;
      const {availWidth, availHeight} = window.screen
      const calcHeight = ((availHeight - 105) - resizableWidthHeight[1]) 
      setFilterDrag([x < 0 ? 0 : x > availWidth - resizableWidthHeight[0] ? availWidth - resizableWidthHeight[0] : x, y < 0 ? 0 : y > calcHeight ? calcHeight : y])
      //setFilterDrag([x < 0 ? 0 : availWidth - resizableWidthHeight[0] < x ? availWidth - resizableWidthHeight[0] : x, y > 0 ? 0 : calcHeight > y ? calcHeight : y])
  }

  /* const PaperComponent = (props) => {
    return (
        <Draggable 
          handle="#draggable-dialog-title"
          cancel={'[class*="MuiDialogContent-root"]'}
          defaultPosition={{x: filterDrag[0], y: filterDrag[1]}}  
          onStop={handleDragStop}
        >
            <ResizableBox
                height={resizableWidthHeight[1]}
                width={resizableWidthHeight[0]}
                className={classes.resizable}
                onResizeStop={handleResize}
            ><Paper square={true} {...props} style={{ margin: 0, height: '100%', background: '#424242'}}/></ResizableBox>                
        </Draggable>
    );
} */


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
          {
            props.retreive_company_assets_holding === true
            ?
            <Button onClick={handlingAssetsCounterHolding} className={classes.btn}>Assets Counter</Button>
            :
            ''

          }      
          {
            props.searchBar === true && props.account_user_form === false
            ?
              <Grid
                container
                style={{border: 0, justifyContent: 'space-between', alignItems: 'flex-start'}}
                /* spacing={1} */
                justify="space-between"  alignItems="flex-start"
              >
                <Grid
                  item
                  xs={12}
                  className={classes.flexColumn}              
                >
                  <div className={classes.floatContainer}>
                    <Switch
                      checked={defaultSearchItemOpen}
                      onChange={handleChangeDefaultSeachItem}
                      color="primary"
                      name="enable_default_search_box"
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                    />  
                    { 
                      rowsInitial.length > 0 || entitiesrow.length > 0 || transactionrow.length > 0 || lawFirms.length > 0 || lawyers.length > 0 
                      ?
                        showButton === true
                        ?
                          <Button 
                          className={classes.floatBtn}
                          onClick={onBringOldList} 
                          >
                            Bring Old List  
                          </Button>
                        :
                          <Button 
                            className={classes.floatBtn}
                            onClick={onHandleUniqueEntities}
                          >
                            Remove Unique  
                          </Button>
                      :
                        ''
                    }                  
                  </div>  
                </Grid>
                {
                  defaultSearchItemOpen === true 
                    ?
                      <React.Fragment>
                        <Grid
                          item
                          xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                            <TextField id="search_company" name="search_company" ref={inputSearchCompany}  onFocus={handleFocus} label="Company" onChange={handleSearchCompany}/>             
                          </form>                
                        </Grid>
                        <Grid
                          item xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                            <TextField id="search_asignee_by_address" name="search_asignee_by_address" ref={inputSearchAssigneeByAddress}  onFocus={handleFocus} label="Assignee by address" onChange={handleSearchAssigneeByAddress}/>   
                          </form>
                        </Grid>
                        <Grid
                          item xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>                               
                            <TextField id="search_assignee_by_country" name="search_assignee_by_country" ref={inputSearchAssigneeByCountry}  onFocus={handleFocus} label="Country" onChange={handleSearchAssigneeByCountry}/> 
                          </form>
                        </Grid>
                        <Grid 
                          item xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                            <TextField id="search_lender" name="search_lender" ref={inputSearchLender} onFocus={handleFocus} label="Lender" onChange={handleLenders} />
                          </form>
                        </Grid>
                        <Grid
                          item xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                            <TextField id="search_lawfirm" name="search_lawfirm" ref={inputSearchLawFirm} onFocus={handleFocus} label="Correspondence" onChange={handleLawFirms} />
                          </form>
                        </Grid>
                        <Grid
                          item xs={2}
                          className={classes.flexColumn}              
                        >
                          <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                            <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} onFocus={handleFocus} label="Conveyance Text" onChange={() => handleSearchTransaction(0)}/>
                          </form>
                        </Grid>
                        <Grid
                          container
                          item  
                          xs={12}
                          className={classes.flexColumn}  
                          style={{marginTop: 20}}            
                        >
                          <Button 
                            variant="text" 
                            onClick={handlingFindClientLawfirms} 
                          >
                            Law Firms
                          </Button> 

                          <Button 
                            variant="text" 
                            onClick={handlingFindLenderClient}  
                            style={{width: 100}}
                          >
                            Lender Clients
                          </Button>
                          <Button 
                            variant="text" 
                            onClick={handlingFindLawfirmClient} 
                            style={{width: 140}}
                          >
                            Correspondence Clients
                          </Button>
                          <Button 
                            variant="text" 
                            onClick={handlingFindNormalizedLawfirm} 
                            style={{width: 110}}
                          >
                            Normalised Lawfirms
                          </Button>
                          <Button 
                            variant="text" 
                            onClick={handlingFindNormalizedCompany} 
                            style={{width: 110}}
                          >
                            Normalised Companies
                          </Button>
                          <Button 
                            variant="text" 
                            onClick={onHandleAddSelectedCompaniesToAccount}
                            style={{width: 200}}
                          >
                            Add selected companies to an account
                          </Button>
                          <Grid
                            container
                            item  
                            xs={2}
                            className={classes.flexColumn}  
                            style={{marginTop: 20}}            
                          >
                            <span className={classes.spanAbsolute}>
                              {
                                rows.length > 0 ? 
                                  rows.length.toLocaleString() 
                                  : 
                                    lawFirms.length > 0 ?
                                      lawFirms.length.toLocaleString()
                                      :
                                        transactionrow.length > 0 ?
                                          transactionrow.length.toLocaleString()
                                          :
                                            ''
                              }
                            </span> 
                          </Grid>
                        </Grid> 
                      </React.Fragment>
                      :
                        ''
                }
              </Grid>
            :
            ''
          }
          {
            props.singleSearchBar === true && props.account_user_form === false
            ?
            <Grid
              container
              className={classes.container}
              style={{maxHeight: '50px', border: 0}}
            >
              <Grid
                item lg={12} md={12} sm={12} xs={12}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <div className={classes.floatContainer}>
                    <span className={classes.displayFlex}>
                      {
                        entitiesrow.length > 0 
                        ? 
                          entitiesrow.length.toLocaleString() 
                        : 
                          transactionrow.length > 0 
                          ? 
                            transactionrow.length.toLocaleString() 
                          : 
                            lawFirms.length > 0
                            ? 
                              lawFirms.length.toLocaleString() 
                            : 
                              lawyers.length > 0 
                              ? 
                                lawyers.length.toLocaleString() 
                              : 
                                assignmentrow.length > 0 
                                ? 
                                  assignmentrow.length.toLocaleString() 
                                : 
                                  rowsInitial.length > 0 
                                  ? 
                                    rowsInitial.length.toLocaleString() 
                                  : 
                                    ''
                      }
                    </span>
                    {
                      rowsInitial.length > 0 || entitiesrow.length > 0 || transactionrow.length > 0 || lawFirms.length > 0 || lawyers.length > 0 
                      ?
                        originalItems.length > 0
                        ?
                          <Button 
                          className={classes.floatBtn}
                          onClick={onBringOldList} 
                          >
                            Bring Original
                          </Button>
                        :
                          <Button 
                            className={classes.floatBtn}
                            onClick={onHandleUniqueEntities}
                          >
                            Remove Unique  
                          </Button>
                      :
                        ''
                    }
                    {
                      entitiesrowIntial.length > 0 && (
                        <React.Fragment>
                          <TextField id="search_company" name="search_company" ref={inputSearchCompany} label="Search within" onChange={handleSearchCompany}/>    
                          <Button onClick={handleFlag} title="Update flag manually for the selected row">{`Move to ${props.flag === 1 ? 'inventors' : 'entities'}`} list</Button>
                          <span>{flagUpdateText}</span>
                        </React.Fragment>
                      )
                    }  
                    {
                      transactionrowIntial.length > 0 && (
                        <React.Fragment>
                          <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} label="Search within" onChange={() => handleSearchTransaction(0)}/>
                          <Button onClick={handleFlagAutomatic} title="Update the flag automatically for all inventors for selected portfolios" >Re-Classify</Button> 
                          <Button
                            ref={logRef}
                            onClick={onHandleReclassifyPopup}
                          >
                            Log Popup
                          </Button>
                        </React.Fragment>
                      )
                    }  
                    {
                      lawFirmsInitial.length > 0 && (
                        <React.Fragment>
                          <TextField id="search_lawfirm" name="search_lawfirm" ref={inputSearchLawFirms} label="Search within" onChange={() => handleSearchLawFirms(0)}/>
                        </React.Fragment>
                      )
                    }
                    {
                      lawyersInitial.length > 0 && (
                        <React.Fragment>
                          <TextField id="search_transaction" name="search_transaction" ref={inputSearchLawFirms} label="Search within" onChange={() => handleSearchLawFirms(0)}/>
                        </React.Fragment>
                      )
                    }
                    {
                      props.raw_assignment === true && (
                        <React.Fragment>
                          <Button onClick={handleClearAddress}>Auto Normalize Address</Button>
                          <Button onClick={handleManualAddress} className={clsx({[classes.activateButton]: columnClickable})}>Manual Normalize Address</Button>
                          <span className={classes.displayFlex}>{cleanAddressStatus}</span>
                        </React.Fragment>
                      )
                    }
                    {
                      rows.length > 0 
                      ?
                        <div className={classes.switchButton}>
                          {
                            checkedSwitch 
                            ?
                            <div style={{position: 'absolute',right: '65px',top: '-24px',width: '200px',background: '#222',height: '43px'}}>                      
                              <TextField id="search_company" name="search_company" ref={inputSearchCompanyTable}  onFocus={handleFocus} label="Search with in company table" onChange={handleSearchCompanyFromData}/>
                            </div>
                              :
                              ''
                          }                    
                          <Switch
                            checked={checkedSwitch}
                            onChange={handleTextboxWithInTable}
                            color="default"
                            inputProps={{ 'aria-label': 'checkbox with default color' }}
                            className={classes.spanAbsolute}
                          />
                        </div>             
                      :
                      ''
                    }
                  </div>                  
                </form>
              </Grid>
            </Grid>
            :
            ''
          }          
          
          <div className={`search-list ${classes.scrollbar}`} >
            {
              props.isLoading
              ?
              <Loader/>
              :
              <>
                
                {
                  rowsInitial.length > 0
                  ?  
                  
                  <AutoSizer>
                  {({ width, height}) => (           
                    <Table
                    width={width}
                    height={height}
                    headerHeight={30}            
                    rowHeight={60}
                    sort={sort}
                    sortBy={sortInventBy}
                    sortDirection={sortInventDirection}
                    scrollTop={companyScrollTop} 
                    onScroll={handleCompanyScroll}       
                    rowCount={rowsInitial.length}           
                    rowGetter={({index}) => rowsInitial[index]}>
                    <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                    <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameRFIDCellRenderer}/>
                    <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                    <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {pasteCellRenderer}/>
                    <Column width={width * 0.09} label="Occu." dataKey="counter" />
                    <Column width={width * 0.13} label="Total" dataKey="total_occurences" />                      
                    <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" />
                    <Column width={width * 0.04} label="" dataKey="normalize_name"  cellRenderer= {copyCellRenderer}/>
                    <Column width={width * 0.04} label="" dataKey="name" cellRenderer= {deleteCellRenderer}/>
                  </Table>
                  )}
                  </AutoSizer>
                  :
                  ''
                }
                {
                  entitiesrow.length > 0 
                  ?
                  <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={60}
                      sort={sort}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      scrollTop={entityScrollTop} 
                      onScroll={handleEntityScroll}
                      rowCount={entitiesrow.length}           
                      rowGetter={({index}) => entitiesrow[index]}>
                      <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                      <Column width={width * 0.40} label="Name" dataKey="name" cellRenderer= {nameCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {pasteCellRenderer}/>
                      <Column width={width * 0.05} label="Occu." dataKey="counter" />
                      <Column width={width * 0.06} label="Total" dataKey="total_occurences" />                      
                      <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" />
                      <Column width={width * 0.04} label="" dataKey="normalize_name"  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" cellRenderer= {deleteCellRenderer}/>
                    </Table>
                    )}
                  </AutoSizer>
                  :
                  ''
                }
                {
                  transactionrowIntial.length > 0 
                  ?
                    <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={sort}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      scrollTop={transactionScrollTop} 
                      onScroll={handleTransactionScroll}     
                      rowCount={transactionrow.length}           
                      rowGetter={({index}) => transactionrow[index]}>
                      <Column width={headerColumnWidth !== null ? headerColumnWidth : width * 0.40} label="Conveyance Text" dataKey="text" headerRenderer={renderWithDrag}/>
                      <Column width={width * 0.14} label="Assignor" dataKey="assingor" />
                      <Column width={width * 0.14} label="Assignee" dataKey="assingee" />
                      <Column width={width * 0.09} label="Reel/Frame" dataKey="id"  cellRenderer = {reelframeCellRenderer} />
                      {/* <Column width={width * 0.07} label="Occu." dataKey="counter" /> */}
                      <Column width={width * 0.12} label=""  dataKey="convey_ty" headerRenderer={typeHeaderRenderer}/>
                      <Column width={width * 0.12} label=""  dataKey="updated_convey_ty" cellRenderer= {dropdownCellRenderer} headerRenderer={modifierConveyanceTypeHeaderRenderer}/>
                    </Table> 
                    )}
                    </AutoSizer> 
                  :
                  ''
                }
                {
                  assignmentrow.length > 0 && props.raw_assignment === true
                  ?
                    <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={sortAssignment}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      rowCount={assignmentrow.length}           
                      rowGetter={({index}) => assignmentrow[index]}>
                      <Column width={width * 0.60} label="#"         dataKey="rf_id"       cellRenderer= {swapButtons}/>
                      <Column width={width * 0.34} label="LawFirm"   dataKey="cname"       cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.34} label="Lawyer"    dataKey="caddress_1"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.34} label="Excess"    dataKey="caddress_2"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.20} label="Caddress3" dataKey="caddress_7"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.20} label="Caddress4" dataKey="caddress_5"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.20} label="Caddress5" dataKey="caddress_6"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.20} label="Caddress6" dataKey="caddress_3"  cellRenderer = {handleColumnClickable}/>
                      <Column width={width * 0.20} label="Caddress7" dataKey="caddress_4"  cellRenderer = {handleColumnClickable}/>
                    </Table>
                    )}
                    </AutoSizer> 
                  :
                  ''
                }
                {
                  assignmentrow.length > 0 && props.raw_assignment === false
                  ?
                    <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={sortAssignment}
                      sortBy={sortInventBy}
                      sortDirection={sortInventDirection}
                      rowCount={assignmentrow.length}           
                      rowGetter={({index}) => assignmentrow[index]}>
                      <Column width={width * 0.33} label="#" dataKey="rf_id" cellRenderer= {buttonsCellRenderer}/>
                      <Column width={width * 0.34} label="Caddress1" dataKey="caddress_1" />
                      <Column width={width * 0.33} label="Caddress2" dataKey="caddress_2" />
                    </Table>
                    )}
                    </AutoSizer> 
                  :
                  ''
                }
                {
                  lawFirms.length > 0
                  ?
                  <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={(properties) => {sortLawFirm(properties)}}
                      sortBy={sortLawFirmBy}
                      sortDirection={sortLawFirmDirection}
                      rowCount={lawFirms.length} 
                      scrollTop={lawFirmScrollTop} 
                      onScroll={lawFirmScroll}         
                      rowGetter={({index}) => lawFirms[index]}>
                      <Column width={width * 0.04} label="#" dataKey="law_firm_id" cellRenderer= {checkLawFirmCellRenderer}/>
                      <Column width={width * 0.40} label="Name" dataKey="name" cellRenderer={nameLawFirmCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyLawFirmCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="law_firm_id"  cellRenderer= {pasteLawFirmCellRenderer}/>
                      <Column width={width * 0.05} label="Occu." dataKey="counter" />
                      <Column width={width * 0.06} label="Total" dataKey="total_occurences" />                      
                      <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" cellRenderer={normalizeLawFirmCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyNormalizeLawFirmCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="law_firm_id" cellRenderer= {deleteLawFirmCellRenderer}/>
                    </Table>
                    )}
                  </AutoSizer> 
                  :
                  ''
                }
                {
                  lawyers.length > 0
                  ?
                  <AutoSizer>
                    {({ width, height}) => (           
                      <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={sortLawyer}
                      sortBy={sortLawyerBy}
                      sortDirection={sortLawyerDirection}
                      rowCount={lawyers.length}           
                      rowGetter={({index}) => lawyers[index]}>
                      <Column width={width * 0.04} label="#" dataKey="lawyer_id" cellRenderer= {checkLawyerCellRenderer}/>
                      <Column width={width * 0.18} label="Cname" dataKey="law_firm_name" cellRenderer={normalizeLawyerLawFirmNameCellRenderer}/>
                      <Column width={width * 0.28} label="Caddress1" dataKey="name" cellRenderer={nameLawyerCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyLawyerCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="lawyer_id"  cellRenderer= {pasteLawyerCellRenderer}/>
                      <Column width={width * 0.05} label="Occu." dataKey="counter" />                  
                      <Column width={width * 0.05} label="Total" dataKey="total_occurences" />
                      <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" cellRenderer={normalizeLawyerCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyNormalizeLawyerCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="lawyer_id" cellRenderer= {deleteLawyerCellRenderer}/>
                    </Table>
                    )}
                  </AutoSizer> 
                  :
                  ''
                }
                {
                  recent_transactions.length > 0
                  ?
                  <AutoSizer>
                    {({ width, height}) => (           
                     <Table
                      width={width}
                      height={height}
                      headerHeight={30}            
                      rowHeight={70}
                      sort={sortRecentTransaction}
                      sortBy={sortRecentTransactionBy}
                      sortDirection={sortRecentTransactionDirection} 
                      rowCount={recent_transactions.length}           
                      rowGetter={({index}) => recent_transactions[index]}>
                      <Column width={width * 0.10} label="No. of Assets" dataKey="assets" />
                      <Column width={width * 0.10} label="Execution Date" dataKey="exec_dt" />
                      <Column width={width * 0.10} label="Recording Date" dataKey="record_dt" />
                      <Column width={width * 0.10} label="Diff. in Days" dataKey="date_difference" /> 
                      <Column width={width * 0.10} label="Conveyance"  dataKey="convey_ty"/>
                      <Column width={width * 0.25} label="Assignor" dataKey="assingor" />
                      <Column width={width * 0.25} label="Assignee" dataKey="assingee" />
                    </Table> 
                    )}
                  </AutoSizer> 
                  :
                  ''
                }
                {
                  assetList.length > 0 
                  ?
                    <Grid
                      container
                      className={classes.container}
                    >
                      <Grid
                        item lg={2} md={2} sm={2} xs={2}
                        className={classes.flexColumn}
                        style={{height: props.height - 150}}
                      >
                        <AutoSizer>
                        {({ width, height}) => ( 
                        <Table
                          width={width}
                          height={height}
                          headerHeight={30}            
                          rowHeight={30}
                          sort={sortAsset}
                          sortBy={sortAssetBy}
                          sortDirection={sortAssetDirection}
                          rowCount={assetList.length}           
                          rowGetter={({index}) => assetList[index]}>
                          <Column width={width} label="Asset" dataKey="number" cellRenderer = {assetCellRenderer}/>
                        </Table>
                        )}
                        </AutoSizer>
                      </Grid>
                      <Grid
                      item lg={10} md={10} sm={10} xs={10}
                      className={classes.flexColumn}
                      style={{height: props.height - 150}}
                      >
                      <IconButton
                        color             = "inherit"
                        aria-haspopup     = "true"
                        onClick           = {() => {downloadJSON()}}
                      >
                        {
                          <i className={"fa fa-download"} title="Download JSON"></i>
                        }
                      </IconButton>
                        {
                          Object.keys(props.assetJSON).length > 0 && (
                            <div
                              className={classes.outSourceWrapper} ref={targetRef}
                            >
                              <div className={classes.padding} >
                                <PatentrackDiagram data={props.assetJSON} connectionBox={handleConnectionBox} comment={handleComment} share={handleShare} pdfView={handlePdfView} titleTop={topPosition} toolbarBottom={bottomToolbarPosition} parentWidth={parseInt(parent_width)} key={props.assetJSON + "_" + Math.random()} />             
                              </div>
                            </div>
                          )}
                      </Grid>
                    </Grid>
                  :
                  ''
                }
                {
                  props.cited_panel === true 
                  ?
                    <CitedPatent />
                  :
                  ''
                }                
                {
                  /* !props.isUserLoading || */ props.account_user_form === true
                  ?
                  <Users />
                  :
                  ''  
                }
                {
                  !props.isAdminUserLoading
                  ?
                  <AdminUsers />
                  :
                  ''
                }
              </>
            }
          </div>
        </div> 
      </div>
      <AddCompaniesToAccount type={1} representatives={entityselectionnames} rows={selectEntityRow}/>
      {
        lawfirmrowselection.length == 1
        ?
          <Modal
            open={normalizedLawfirmModal}
            onClose={onHandleCloseNormalizeLawfirm}
            aria-labelledby="modal-normalize-lawfirm"
            aria-describedby="modal-normalize-description"
          >
            <Box style={{
              width: 1000,
              margin: '50px auto',
              background: '#424242',
              height: 700,
              padding: 20,
            }}>
              <NormalizeLawFirms lawFirmID={lawfirmrowselection[0]}/>
            </Box>
          </Modal>
        :
          ''
      }

      {
        entityrowselection.length == 1
        ?
          <Modal
            open={normalizedCompanyModal}
            onClose={onHandleCloseNormalizeCompanyModal}
            aria-labelledby="modal-normalize-company"
            aria-describedby="modal-normalize-company-description"
          >
            <Box style={{
              width: 1000,
              margin: '50px auto',
              background: '#424242',
              height: 700,
              padding: 20,
            }}>
              <NormalizeCompany companyID={entityrowselection[0]}/>
            </Box>
          </Modal>
        :
          ''
      }
      <Dialog
        open={openReClasifyModal} 
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        disableEscapeKeyDown={true}
      >
        <DialogTitle style={{ cursor: 'move', padding: 5, color: '#fff' }} id="draggable-dialog-title">
          Log Messages
        </DialogTitle>
        <DialogContent dividers={true} style={{padding: 5}}> 
          <Reclassify data={reClassifyData}/>
        </DialogContent>
        <DialogActions style={{padding: 5, color: '#fff'}}>
          <Button autoFocus onClick={onHandleCloseReClassifyModal} style={{marginRight: 20}}>
            Close
          </Button> 
        </DialogActions>
      </Dialog> 
    </div>
  );
}

const mapStateToProps = state => {
    return {
      width: state.patenTrack.screenWidth,
      height: state.patenTrack.screenHeight,
      isLoading: state.patenTrack.searchCompanyLoading,
      clientID: state.patenTrack.clientID,
      company_modal: state.patenTrack.company_modal,
      portfolioList: state.patenTrack.portfolioList,
      clean_address_status: state.patenTrack.clean_address_status,
      searchBar: state.patenTrack.searchBar,
      singleSearchBar: state.patenTrack.singleSearchBar,
      raw_assignment: state.patenTrack.raw_assignment,
      entity_assets: state.patenTrack.entity_assets,
      retreive_company_assets_holding: state.patenTrack.retreive_company_assets_holding,
      flag: state.patenTrack.flag,
      flag_update_text: state.patenTrack.flag_update_text,
      searchCompanies: state.patenTrack.searchCompanies,
      entities_list: state.patenTrack.entities_list,
      assignment_list: state.patenTrack.assignment_list,
      transaction_list: state.patenTrack.transaction_list,
      asset_list: state.patenTrack.asset_list,
      law_firm_list: state.patenTrack.law_firm_list,
      lawyer_list: state.patenTrack.lawyer_list,
      lenders_list: state.patenTrack.lenders_list,
      assetJSON: state.patenTrack.assets,
      main_company_selected: state.patenTrack.main_company_selected,
      main_company_selected_name: state.patenTrack.main_company_selected_name,
      isAdminUserLoading: state.patenTrack.adminUserListLoading,
      inventorButtons: state.patenTrack.inventorButtons,
      account_user_form: state.patenTrack.account_user_form,
      recentTransactions: state.patenTrack.recentTransactions,
      cited_panel: state.patenTrack.cited_panel,
      accountList: state.patenTrack.clientsData,
      refresh_reclassify: state.patenTrack.refresh_reclassify,
    };
  };
  
  const mapDispatchToProps = {
    setSearchedAddressLawfirm,
    setSearchedCompanyAddress,
    setSearchAddressModal,
    setSearchCompanyAddressModal,
    setSearchByIDLawfirmAddress,
    setSearchByCompanyIDAddress,
    getLawfirmListByAddress,
    getCompanyListByAddress,
    setSearchModalType,
    searchCompany,
    searchCompanyByAddress,
    searchAssigneeByCountry,
    addCompany,
    setSearchCompanyLoading,
    setSearchCompanies,
    setSelectedSearchCompanies,
    setMainCompanyChecked,
    setSelectedCompany,
    updateNormalizeEntites,
    updateNormalizeLawFirms,
    updateNormalizeLawyers,
    assignmentUpdate,
    transactionUpdate,
    updateEntitiesFlag,
    getAssets,
    setAssets,
    searchLenders,
    setLenderList,
    searchLawFirm,
    findCompaniesByLawFirm,
    findLenderCompaniesByID,
    searchTransaction,
    setTransactionList,
    updateFlagAutomatic,
    updateFlagMissingTransaction,
    missingInventor,
    findInventor,
    treeFileUpload,
    setEntityAssets, 
    getEntityAssets,
    setLawFirmList,
    cleanAddress,
    cancelRequest,
    setAdminUsers,
    setUsers,
    setUsersLoading,
    setAdminUsersLoading,
    findLawfirmsCompaniesByID,
    setRecentTransactions,
    getClientAssetsList,
    setClientAssetsList,
    setAddCompanyToAccountModal,
    setAddCompanyToAccountType,
    setAddCompanyToAccountGroup,
    setAddCompanyToAccountRepresentatives,
    refreshReclassify
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchCompanies);