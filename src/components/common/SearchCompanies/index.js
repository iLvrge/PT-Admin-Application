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
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Users from "../Users";
import PatentrackDiagram from "../PatentrackDiagram";

import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import { searchCompany, addCompany, setSearchCompanies, setSearchCompanyLoading, cancelRequest, setSelectedSearchCompanies, setMainCompanyChecked, setSelectedCompany, updateNormalizeEntites, updateNormalizeLawFirms, updateNormalizeLawyers, transactionUpdate, updateEntitiesFlag, getAssets, setAssets, searchTransaction, setTransactionList, updateFlagAutomatic, missingInventor, findInventor, treeFileUpload,setEntityAssets, getEntityAssets, setLawyerList, assignmentUpdate, searchLawFirm, setLawFirmList, cleanAddress  } from "../../../actions/patenTrackActions";


import PatenTrackApi from '../../../api/patenTrack';

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
  const inputSearchLawFirm = useRef(null);
  const inputSearchTransaction = useRef(null);
  const inputSearchLawFirms = useRef(null);

  const targetRef = useRef();
  

  const [checked, setChecked] = useState([]);

  const [timeInterval, setTimeInterval] =  useState( null );

  const WAIT_INTERVAL = 200;
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

  const [lawyers, setLawyers] = useState([]);
  const [lawyersInitial, setLawyerInitial] = useState([]);
  const [lawyerrowselection, setLawyerRowSelection] = useState([]);
  const [lawyerNormalizeName, setLawyerNameCopy] = useState('');


  const [conveyanceType, setConveyanceType] = useState({})

  const [normalizename, setCopiedName] = useState('')

  const [assetList, setAssetList] = useState([])

  const [activeReel, setActiveReel] = useState(null)

  const [entityrowselection, setEntityRowSelection] = useState([])

  const [entityselectionnames, setEntityRowSelectionNames] = useState([])

  const [headerType, setHeaderType] = useState('')

  const [open, setOpen] = useState(false)

  const [selectedAsset, setSelectedAsset] = useState("")

  const [sortInventBy, setSortInventBy] = useState('name');
  const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC)

  const [sortLawFirmBy, setLawFirmBy] = useState('name')
  const [sortLawFirmDirection, setSortLawFirmDirection] = useState(SortDirection.ASC)

  const [sortLawyerBy, setLawyerBy] = useState('name')
  const [sortLawyerDirection, setSortLawyerDirection] = useState(SortDirection.ASC)

  const [cleanAddressStatus, setCleanAddressStatus] = useState("")
  const [flagUpdateText, setFlagUpdateText] = useState("")

  const [parent_width, setParentWidth] = useState(0)

  const [bottomToolbarPosition, setBottomToolbarPosition] = useState(0)

  const [topPosition, setTopPosition] = useState(0)

  const resetAll = () => {
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
    setAssetList([])
  }

  React.useEffect(() => {    
    resetAll();
    if(props.searchCompanies && props.searchCompanies.length > 0 ){      
      setRows(props.searchCompanies);
      setRowsInitial(props.searchCompanies);
      setSortInventBy('name');
    } 

    if(props.entities_list && props.entities_list.length > 0) {
      setEntitesRow(props.entities_list);
      setEntityIntialRows(props.entities_list);
      setSortInventBy('name');
    }
    if(props.transaction_list && props.transaction_list.list.length > 0) {      
      setTransactionRow(props.transaction_list.list);
      setTransactionIntialRow(props.transaction_list.list);
      setConveyanceType(props.transaction_list.type);
      setSortInventBy('text');
    }

    if(props.assignment_list && props.assignment_list.length > 0) {      
      setAssignmentRow(props.assignment_list);
      setAssignmentIntialRow(props.assignment_list);
      setSortInventBy('cname');
    }

    if(props.law_firm_list.length > 0) {
      const list = [];
      (async () => {

      })();
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
    
    if(props.flag_update_text) {
      setFlagUpdateText(props.flag_update_text);
      setTimeout(() => {
        setFlagUpdateText("");
      },4000);
    }

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
  },[props.searchCompanies, props.entities_list, props.transaction_list, props.assignment_list, props.asset_list, props.assetJSON, props.flag_update_text, props.entity_assets, props.law_firm_list, props.lawyer_list, props.clean_address_status]);


  const updateContainerWidth = () => {
    if (targetRef.current) {
      const patentelement = targetRef.current.parentElement.parentElement;
      setBottomToolbarPosition(props.screenHeight - patentelement.offsetHeight - 40);
      const clientRect = patentelement.getBoundingClientRect();      
      setTopPosition(clientRect.top  + 26);
      setParentWidth(parseInt(targetRef.current.offsetWidth));
    }
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

  const handleSearchCompanyFromData = () => {
     /**event.target.value giving old value in setimeout */
      clearTimeout(timeInterval);
      setTimeInterval(setTimeout(() => {
        let getList = [];
        if(inputSearchCompanyTable.current.querySelector("#search_company").value.length > 2) {
          let splitWord = inputSearchCompanyTable.current.querySelector("#search_company").value.toLowerCase().split(' ');
          splitWord = splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
          getList = findWordWithKeys(['name'], rows, splitWord);
          console.log("setRowsInitial", getList.length);
          setRowsInitial(getList) ;     
        } else {
          console.log("handleSearchCompanyFromData", rows.length);
          getList = rows;
          setRowsInitial(getList) ;     
        }        
     }, WAIT_INTERVAL));  
  }
  
  const handleSearchCompany = (event) => {    
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setEntityRowSelection([]);
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
        if(inputSearchCompany.current.querySelector("#search_company").value.length > 2) {
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
      setLawFirms([]);
      setLawFirmsInitial([]);
      if(inputSearchLawFirm.current.querySelector("#search_lawfirm").value.length > 2) {
        props.searchLawFirm(inputSearchLawFirm.current.querySelector("#search_lawfirm").value );
      } else {
        props.setSearchCompanyLoading( false );
        props.setLawFirmList([]);
        setLawFirms([]);
        setLawFirmsInitial([]);
        props.cancelRequest();
      }
    }, WAIT_INTERVAL));  
  }

  const searchFromTransaction = (keys, searchText) =>{
    let getList = [];
    if(searchText.length > 0) {
      console.log("Search", keys,searchText);
      getList = findWordWithKeys(keys, transactionrowIntial, searchText);
      console.log(getList);
    } else {
      getList = transactionrowIntial;
    }
    setTransactionRow(getList) ;
  }

  const handleSearchTransaction = (t) => {
    /**event.target.value giving old value in setimeout */
    clearTimeout(timeInterval);
    setTimeInterval(setTimeout(() => {
      setEntityRowSelection([]);
      if(transactionrowIntial.length > 0 && props.clientID > 0) {
        const search = inputSearchTransaction.current.querySelector("#search_transaction").value.toString();
        searchFromTransaction(t == 1 ? ['convey_ty'] : ['text'], t == 1 ? search : search.toUpperCase());
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
      props.missingInventor(props.clientID);
    }
  }

  const handleFindInventor = () => {
    if(props.clientID > 0) {
      props.findInventor(props.clientID);
    }
  }

  const handleFlagAutomatic = () => {
    if(props.clientID > 0) {
      props.updateFlagAutomatic(props.clientID);
    }
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

    let newItems = entitiesrow.length > 0 ? [...entitiesrow] : transactionrow.length > 0 ? [...transactionrow] : assetList.length > 0 ? [...assetList] : [...rowsInitial];
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
    } else if(assetList.length > 0){
      setAssetList(newItems);
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
      let firstIndex = sortBy != 'normalize_name' ? a[sortBy] : a.representativelawfirm != null ? a.representativelawfirm.representative_name : '';
      let secondIndex = sortBy != 'normalize_name' ? b[sortBy] : b.representativelawfirm != null ? b.representativelawfirm.representative_name : '';
      if (firstIndex < secondIndex) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (firstIndex > secondIndex) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    setLawFirms(newItems);    
  }

  const sortLawyer = ({ sortBy, sortDirection }) => {
    setLawyerBy(sortBy);
    setSortLawyerDirection(sortDirection);

    let newItems = [...lawyers] ;
    newItems.sort((a, b) => {
      let firstIndex = sortBy != 'normalize_name' && sortBy != 'law_firm_name' ? a[sortBy] : sortBy == 'law_firm_name' ? a.lawfirms.law_firm_name :  sortBy == 'normalize_name' && a.representativelawfirm != null ? a.representativelawfirm.representative_name : '';
      let secondIndex = sortBy != 'normalize_name' && sortBy != 'law_firm_name' ? b[sortBy] : sortBy == 'law_firm_name' ? b.lawfirms.law_firm_name :  sortBy == 'normalize_name' && b.representativelawfirm != null ? b.representativelawfirm.representative_name : '';
      
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

  const selectLawFirmRow = (event, lawFirmID, rowIndex) => {
    event.stopPropagation();  
    let oldSelection = [...lawfirmrowselection];
    const findIndex = oldSelection.indexOf(lawFirmID);
    if(event.target.checked) {
      if(findIndex < 0) {
        oldSelection.push(lawFirmID);
      }
    } else {
      if(findIndex >= 0) {
        oldSelection.push(lawFirmID);
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
        oldSelection.push(lawyerID);
        oldSelection.splice(findIndex, 1);
      }
    }
    setLawyerRowSelection(oldSelection);
  }

  const selectRows = (event, entityName, rowIndex) => {    
    let selectedNames = [...entityselectionnames];
    let oldSelection = [...entityrowselection];  
    const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
    event.stopPropagation();   
    console.log(event.target.checked);
    if(event.target.checked) {
      let cntrlKey = event.ctrlKey ? event.ctrlKey : false;
      let previousIndex = -1;
      
      if (cntrlKey && oldSelection.length > 0) {
        previousIndex = oldItems.findIndex(item => item.id == oldSelection[oldSelection.length - 1]);
      }
      if(previousIndex >= 0) {
        if(previousIndex > rowIndex) {
          oldItems.forEach((r, index) => {
            if(index >= rowIndex && index <= previousIndex) {
              if(selectedNames.indexOf(r.name) < 0) {
                oldSelection.push(r.id);
                selectedNames.push(r.name);
              }
            }
          });
        } else {
          oldItems.forEach((r, index) => {
            if(index >= previousIndex && index <= rowIndex) {
              if(selectedNames.indexOf(r.name) < 0) {
                oldSelection.push(r.id);
                selectedNames.push(r.name);
              }
            }
          });
        }
      } else {
        if(selectedNames.indexOf(entityName) < 0) {
          selectedNames.push(entityName);
          oldSelection.push(oldItems[rowIndex]['id']);
        }
      }      
    } else {
      const findIndex = selectedNames.indexOf(entityName);
      if(findIndex >= 0){
        selectedNames.splice(findIndex, 1);
        oldSelection.splice(findIndex, 1);
      } 
    }

    console.log(selectedNames, oldSelection);
    setEntityRowSelectionNames(selectedNames);
    setEntityRowSelection(oldSelection);
  }

  const handleCopy = (event, entityName) => {
    event.stopPropagation();
    entityName = normalizename != entityName ? entityName : '';
    setCopiedName(entityName);
  }

  const handleCopyLawFirm = (event, lawfirmName) => {
    event.stopPropagation();
    setCopiedLawFirmName(lawfirmName);
  }

  const handleCopyNormalizeLawFirm = (event, cellData, rowIndex) => {
    event.stopPropagation();
    const oldItems = [...lawFirms];
    setCopiedLawFirmName(oldItems[rowIndex].representativelawfirm != null ? oldItems[rowIndex].representativelawfirm.representative_name : '');
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
      let selectedNames = [...entityselectionnames];
      let oldSelection = [...entityrowselection];
      const oldItems =   entitiesrow.length > 0 ? [...entitiesrow] : [...rowsInitial];
      if(selectedNames.indexOf(entityName) < 0) {
        selectedNames.push(entityName);
        oldSelection.push(oldItems[rowIndex]['id']);
      }
      setEntityRowSelectionNames(selectedNames);
      setEntityRowSelection(oldSelection);
      updateEntityData(selectedNames, normalizename);
      const type = entitiesrow.length > 0 ? 2 : 1
      updateSelectedRows(oldSelection, selectedNames, type, normalizename);
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
      updateLawFirmSelectedRows(oldSelection, lawFirmNormalizeName);
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

  const updateSelectedRows = (oldSelection, selectedNames, t, normalizeName) => {
   
    let oldRows = t == 2 ? [...entitiesrow] : [...rowsInitial];
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
      await Promise.all(promises);
      if(normalizeName != "") {
        
        const findIndex = await oldRows.findIndex( row => {
          return row.name == normalizeName;
        });
        if(findIndex >= 0) {
          oldRows[findIndex].representative_company = normalizeName;
        }
      }
      setEntityRowSelection([]);
      setEntityRowSelectionNames([]);
      /*setCopiedName("");*/
      if(t == 2){
        setEntitesRow(oldRows)
      } else {
        setRowsInitial(oldRows);
        if(inputSearchCompanyTable.current.querySelector("#search_company").value.length > 2) {
          handleSearchCompanyFromData();
        }
      } 
    })();

    if(t != 2) {
      oldRows = [...rows];
      const promiseNames = selectedNames.map( name => {
        oldRows.some( (c, index) => {
          if(c.name == name) {
            oldRows[index].normalize_name = normalizeName;
            return true;
          }
          return false;
        });
        return name;
      });

      (async () => {      
        await Promise.all(promiseNames);
        if(normalizeName != "") {
          
          const findIndex = await oldRows.findIndex( row => {
            return row.name == normalizeName;
          });
          if(findIndex >= 0) {
            oldRows[findIndex].representative_company = normalizeName;
          }
        }
        setEntityRowSelection([]);
        setEntityRowSelectionNames([]);
        /*setCopiedName("");*/
        setRows(oldRows);
      })();
    }
  }

  const updateLawFirmData = (selectedIDs, normalizename) => {
    if(selectedIDs.length > 0) {
      let formData = new FormData();
      formData.append('law_firm_ids', JSON.stringify(selectedIDs));
      formData.append('normalize_name', normalizename );
      props.updateNormalizeLawFirms(formData);
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

  const handleDelete = (name, rowIndex) => {
    updateEntityData([name], '');
    const type = entitiesrow.length > 0 ? 2 : 1
    const deleteID = entitiesrow.length > 0 ? entitiesrow[rowIndex]['id'] : rowsInitial[rowIndex]['id'];
    updateSelectedRows([deleteID], [name], type, '');
  }

  const handleDeleteLawFirm = (ID, rowIndex) => {
    updateLawFirmData([ID], '');
    updateLawFirmSelectedRows([ID], '');
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
          <i className={"fad fa-trash"} title="Delete"></i>
        }
      </IconButton>
    )
  }

  const normalizeLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    return lawFirms[rowIndex].representativelawfirm != null ? lawFirms[rowIndex].representativelawfirm.representative_name : '';
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
          <i className={"fad fa-trash"} title="Delete"></i>
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

  const handleTypeChange = event => {
    console.log("handleTypeChange", event.target.value);    
    setHeaderType(event.target.value);
    inputSearchTransaction.current.querySelector("#search_transaction").value = event.target.value;
    handleSearchTransaction(1);
    /*searchFromTransaction(['convey_ty'], event.target.value);  */  
  }

  const typeHeaderRenderer = ({ dataKey, sortBy, sortDirection }) => {
    return (
      <div>
        <Select
          value={headerType}
          onChange={(event) => handleTypeChange(event)}
        >
          <MenuItem key= {'0'} value={''}>{''}</MenuItem>
          {conveyanceType.map((option) => (
            <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
          ))}
        </Select>
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

  const nameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const oldItems = entitiesrow.length > 0 ? entitiesrow : rowsInitial;
    if(entitiesrow.length > 0) {
      const rfID = entitiesrow[rowIndex]['rf_id'].toString();
      let reelNo = rfID.substring(0,5), frameNo = parseInt(rfID.substring(5, rfID.length));
      if(reelNo.substring(reelNo.length - 1 , 1) == '0') {
        reelNo = reelNo.substring(0, reelNo.length - 1);
      }
    
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return (
        <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : classes.white} title={cellData}><a href={urlString} target='_blank'>{cellData}</a></span>
      )
    } else {
      const findAssets = oldItems[rowIndex]['count_assets'] != undefined ? <a style={{marginLeft:'10px'}} className={classes.pointer} onClick={() => findEntityAssets(oldItems[rowIndex]['assignor_and_assignee_id'])}>({oldItems[rowIndex]['count_assets']})</a> : '';
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/result?id=${cellData}&type=patAssigneeName`;
      return (
      <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative:''} title={cellData}><a href={urlString} target='_blank'>{cellData}</a>{findAssets}</span>
      )
    }    
  }

  const nameLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {  
    const oldItems = [...lawFirms];
    const urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=corrName:%22${encodeURIComponent(cellData)}%22&qc=1`;
    return (
      <span className={cellData === lawFirmNormalizeName ? classes.activeCopyRow : oldItems[rowIndex].representativelawfirm != null && oldItems[rowIndex].representativelawfirm.representative_name == cellData ? classes.activeRepresentative : classes.white} title={cellData}><a href={urlString} target='_blank'>{cellData}</a></span>
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
      asset = assetList[rowIndex]['application'];
      activeClass = asset == selectedAsset ? classes.activeCopyRow : '';
      asset = asset.substring(0,2) + "/" + asset.substring(2, asset.length);
    } 
    if(activeClass == '' && asset == selectedAsset) {
      activeClass = classes.activeCopyRow;
    }
    return (
      <a className={activeClass} onClick={(event) => openAssetIllustration(event)}>{asset}</a>
    )
  }

  const openAssetIllustration = (event) => {
    let selectedAssets = event.target.innerText;
    selectedAssets = selectedAssets.replace("/", "");
    setSelectedAsset(selectedAssets);
    props.getAssets(selectedAssets);
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
            props.searchBar === true
            ?
            <Grid
              container
              className={classes.container}
              style={{maxHeight: '50px', border: 0}}
            >
              <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_company" name="search_company" ref={inputSearchCompany}  onFocus={handleFocus} label="Search a company name" onChange={handleSearchCompany}/>                  
                  <span className={classes.spanAbsolute}>{rows.length > 0 ? rows.length.toLocaleString() : ''}</span>                  
                </form>
              </Grid>
              <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_lawfirm" name="search_lawfirm" ref={inputSearchLawFirm} onFocus={handleFocus} label="Search a lawfirm" onChange={handleLawFirms}/>
                  <span className={classes.spanAbsolute}>{lawFirms.length > 0 ? lawFirms.length.toLocaleString() : ''}</span>
                </form>
              </Grid>
              <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} onFocus={handleFocus} label="Search a transaction" onChange={() => handleSearchTransaction(0)}/>
                  <span className={classes.spanAbsolute}>{transactionrow.length > 0 ? transactionrow.length.toLocaleString() : ''}</span>
                </form>
              </Grid>
            </Grid>
            :
            ''
          }
          {
            props.singleSearchBar === true
            ?
            <Grid
              container
              className={classes.container}
              style={{maxHeight: '50px', border: 0}}
            >
              {
                entitiesrowIntial.length > 0 
                ?
                <Grid
                  item lg={12} md={12} sm={12} xs={12}
                  className={classes.flexColumn}              
                >
                  <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                    <TextField id="search_company" name="search_company" ref={inputSearchCompany} label="Search a company name" onChange={handleSearchCompany}/>                  
                    <span className={`${classes.spanAbsolute} ${classes.marginRight} ${classes.marginTop}`}>{entitiesrow.length > 0 ? entitiesrow.length.toLocaleString() : ''}</span>
                    <a onClick={handleFlag} title="Update flag manually for the selected row" className={`${classes.iconAbsolute}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fas fa-yin-yang"}></i> Flag</a>
                    <a onClick={handleFlagAutomatic} title="Update the flag automatically for all inventors for selected portfolios" className={`${classes.iconAbsolute} ${classes.rightManualFlag}  ${classes.marginRight} ${classes.marginTop}`}><i className={"far fa-layer-plus"}></i> Auto. Flag</a>
                    <a onClick={hanldeMissingInventor} title="Find missing Inventors for selected portfolios" className={`${classes.iconAbsolute} ${classes.rightMissingInven}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fad fa-long-arrow-down"}></i> Missing Inven.</a>
                    <a onClick={handleFindInventor} title="Find the Inventors from 2000-04 years" className={`${classes.iconAbsolute} ${classes.rightBtn}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fad fa-long-arrow-down"}></i> 2000-04</a>
                    <span>{flagUpdateText}</span>
                  </form>
                </Grid>
                :
                transactionrowIntial.length > 0 
                ?
                <Grid
                item lg={12} md={12} sm={12} xs={12}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} label="Search a transaction" onChange={() => handleSearchTransaction(0)}/>
                  <span className={classes.spanAbsolute}>{transactionrow.length > 0 ? transactionrow.length.toLocaleString() : ''}</span>
                </form>
              </Grid>
                :
                lawFirmsInitial.length > 0
                ?
                <Grid
                item lg={12} md={12} sm={12} xs={12}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_transaction" name="search_transaction" ref={inputSearchLawFirms} label="Search a lawfirm" onChange={() => handleSearchLawFirms(0)}/>
                  <span className={classes.spanAbsolute}>{lawFirms.length > 0 ? lawFirms.length.toLocaleString() : ''}</span>
                </form>
              </Grid>
                :
                lawyersInitial.length > 0
                ?
                <Grid
                  item lg={12} md={12} sm={12} xs={12}
                  className={classes.flexColumn}              
                >
                  <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                    <TextField id="search_transaction" name="search_transaction" ref={inputSearchLawFirms} label="Search a lawyer" onChange={() => handleSearchLawFirms(0)}/>
                    <span className={classes.spanAbsolute}>{lawyers.length > 0 ? lawyers.length.toLocaleString() : ''}</span>
                  </form>
                </Grid>
                :
                props.raw_assignment === true
                ?
                <Grid
                  item lg={12} md={12} sm={12} xs={12}
                  className={classes.flexColumn}              
                >
                  <Button onClick={handleClearAddress}>Clear Address</Button>
                  <span className={`${classes.spanAbsolute} ${classes.marginRight} ${classes.marginTop}`}>{assignmentrow.length > 0 ? assignmentrow.length.toLocaleString() : ''}</span>
                  <span>{cleanAddressStatus}</span>
                </Grid>
                :
                ''
              }
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
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 20,
                  maxScrollbarLength: 25
                }}
              >
                {
                  rows.length > 0 
                  ?
                  <div style={{position: 'absolute',right: '10px',top: '-24px',width: '300px',background: '#222',height: '43px'}}>
                  <TextField id="search_company" name="search_company" ref={inputSearchCompanyTable}  onFocus={handleFocus} label="Search with in company table" onChange={handleSearchCompanyFromData}/>
                  <span className={classes.spanAbsolute} style={{top: '-20px'}}>{rowsInitial.length > 0 ? rowsInitial.length.toLocaleString() : ''}</span> 
                  </div>             
                  :
                  ''
                }
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
                    rowCount={rowsInitial.length}           
                    rowGetter={({index}) => rowsInitial[index]}>
                    <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                    <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameCellRenderer}/>
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
                  transactionrow.length > 0 
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
                      rowCount={transactionrow.length}           
                      rowGetter={({index}) => transactionrow[index]}>
                      <Column width={width * 0.62} label="Conveyance Text" dataKey="text" />
                      <Column width={width * 0.11} label="Reel/Frame" dataKey="reel_frame"  cellRenderer = {reelframeCellRenderer} />
                      <Column width={width * 0.07} label="Occu." dataKey="counter" />
                      <Column width={width * 0.11} label="Type" dataKey="convey_ty" headerRenderer={typeHeaderRenderer}/>
                      <Column width={width * 0.09} label="Update" dataKey="updated_convey_ty" cellRenderer= {dropdownCellRenderer}/>
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
                      <Column width={width * 0.33} label="Cname" dataKey="cname" />
                      <Column width={width * 0.34} label="Caddress1" dataKey="caddress_1" />
                      <Column width={width * 0.33} label="Caddress2" dataKey="caddress_2" />
                      <Column width={width * 0.33} label="Caddress3" dataKey="caddress_7" />
                      <Column width={width * 0.33} label="Caddress4" dataKey="caddress_5" />
                      <Column width={width * 0.33} label="Caddress5" dataKey="caddress_6" />
                      <Column width={width * 0.33} label="Caddress6" dataKey="caddress_3" />
                      <Column width={width * 0.33} label="Caddress7" dataKey="caddress_4" />
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
                      sort={sortLawFirm}
                      sortBy={sortLawFirmBy}
                      sortDirection={sortLawFirmDirection}
                      rowCount={lawFirms.length}           
                      rowGetter={({index}) => lawFirms[index]}>
                      <Column width={width * 0.04} label="#" dataKey="law_firm_id" cellRenderer= {checkLawFirmCellRenderer}/>
                      <Column width={width * 0.40} label="Cname" dataKey="name" cellRenderer={nameLawFirmCellRenderer}/>
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
                          sort={sort}
                          sortBy={sortInventBy}
                          sortDirection={sortInventDirection}
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
                          <i className={"fad fa-download"} title="Download JSON"></i>
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
                  !props.isUserLoading
                  ?
                  <Users />
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
      assetJSON: state.patenTrack.assets,
      main_company_selected: state.patenTrack.main_company_selected,
      main_company_selected_name: state.patenTrack.main_company_selected_name,
      userList: state.patenTrack.userList,
      isUserLoading: state.patenTrack.userListLoading,
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
    updateNormalizeLawFirms,
    updateNormalizeLawyers,
    assignmentUpdate,
    transactionUpdate,
    updateEntitiesFlag,
    getAssets,
    setAssets,
    searchLawFirm,
    searchTransaction,
    setTransactionList,
    updateFlagAutomatic,
    missingInventor,
    findInventor,
    treeFileUpload,
    setEntityAssets, 
    getEntityAssets,
    setLawFirmList,
    cleanAddress,
    cancelRequest
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchCompanies);