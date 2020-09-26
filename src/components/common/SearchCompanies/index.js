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

import { searchCompany, addCompany, setSearchCompanies, setSearchCompanyLoading, cancelRequest, setSelectedSearchCompanies, setMainCompanyChecked, setSelectedCompany, updateNormalizeEntites, assignmentUpdate, updateEntitiesFlag, getAssets, setAssets, searchTransaction, setTransactionList, updateFlagAutomatic, missingInventor, findInventor, treeFileUpload,setEntityAssets, getEntityAssets  } from "../../../actions/patenTrackActions";

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
  const inputSearchLawyer = useRef(null);
  const inputSearchTransaction = useRef(null);

  const targetRef = useRef();
  

  const [checked, setChecked] = useState([]);

  const [timeInterval, setTimeInterval] =  useState( null );

  const WAIT_INTERVAL = 200;
  const [rows, setRows] = useState([]);

  const [entitiesrow, setEntitesRow] = useState([]);
  const [entitiesrowIntial, setEntityIntialRows] = useState([]);

  const [transactionrow, setTransactionRow] = useState([]);
  const [transactionrowIntial, setTransactionIntialRow] = useState([]);

  const [conveyanceType, setConveyanceType] = useState({});

  const [normalizename, setCopiedName] = useState('');

  const [assetList, setAssetList] = useState([]);

  const [activeReel, setActiveReel] = useState(null);

  const [entityrowselection, setEntityRowSelection] = useState([]);

  const [entityselectionnames, setEntityRowSelectionNames] = useState([]);

  const [headerType, setHeaderType] = useState('');

  const [open, setOpen] = useState(false);

  const [selectedAsset, setSelectedAsset] = useState("");

  const [sortInventBy, setSortInventBy] = useState('name');
  const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC);

  const [parent_width, setParentWidth] = useState(0);

  const [bottomToolbarPosition, setBottomToolbarPosition] = useState(0);

  const [topPosition, setTopPosition] = useState(0);

  const resetAll = () => {
    setRows([]);
    setEntitesRow([]);
    setEntityIntialRows([]);
    setTransactionRow([]);
    setTransactionIntialRow([]);
    setConveyanceType([]);
    setAssetList([]);
  }

  React.useEffect(() => {    
    resetAll();
    if(props.searchCompanies && props.searchCompanies.length > 0 ){      
      setRows(props.searchCompanies);
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
    
    if(props.asset_list && props.asset_list.length > 0) {
      setSortInventBy('number');
      setAssetList(props.asset_list);
    }
    
    if (targetRef.current) {
      updateContainerWidth();
    }
    
    if(props.flag_update_text) {
      alert(props.flag_update_text);
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
  },[props.searchCompanies, props.entities_list, props.transaction_list, props.asset_list, props.assetJSON, props.flag_update_text, props.entity_assets]);


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
            const searchItems = list.filter( e => e[key] != null && e[key].startsWith(searchText));
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

    let newItems = entitiesrow.length > 0 ? [...entitiesrow] : transactionrow.length > 0 ? [...transactionrow] : assetList.length > 0 ? [...assetList] : [...rows];
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
    entityName = normalizename != entityName ? entityName : '';
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

  const findEntityAssets = (entityID) => {
    console.log("findEntityAssets", entityID);
    props.setEntityAssets({entity_id: entityID, count: 0});
    props.getEntityAssets(entityID);
  }

  const updateSelectedRows = (oldSelection, t, normalizeName) => {
   
    let oldRows = t == 2 ? [...entitiesrow] : [...rows];
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
        /*const representativeNamePromise = oldRows.map( (r, index) => {
          if(r.name == normalizeName){
            oldRows[index].representative_company = normalizeName;
            return true;
          }
          return false;
        });
        await Promise.all(representativeNamePromise);*/
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
    updateSelectedRows([deleteID], type, '');
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
      const reelNo = transactionrow[rowIndex]['reel_no'], frameNo = transactionrow[rowIndex]['frame_no'];
      let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
      return (<a href={urlString} target='_blank' onClick={() => handleReelFrame(transactionrow[rowIndex]['id'])} className={activeReel == transactionrow[rowIndex]['id'] ? classes.selected : ''}>{cellData}</a>)
    } else {
      return '';
    }
    
  }

  const nameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    const oldItems = entitiesrow.length > 0 ? entitiesrow : rows;
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
                  <TextField id="search_company" name="search_company" ref={inputSearchCompany}  onFocus={handleFocus} label="Enter a Company Name to Search" onChange={handleSearchCompany}/>
                  <span className={classes.spanAbsolute}>{props.searchCompanies.length > 0 ? props.searchCompanies.length.toLocaleString() : ''}</span>                  
                </form>
              </Grid>
              <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_lawyer" name="search_lawyer" ref={inputSearchLawyer} onFocus={handleFocus} label="Enter a Lawyer Name to Search" onChange={handleSearchCompany}/>
                  <span className={classes.spanAbsolute}>{props.searchCompanies.length > 0 ? props.searchCompanies.length.toLocaleString() : ''}</span>
                </form>
              </Grid>
              <Grid
                item lg={4} md={4} sm={4} xs={4}
                className={classes.flexColumn}              
              >
                <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                  <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} onFocus={handleFocus} label="Enter a Transaction text to Search" onChange={() => handleSearchTransaction(0)}/>
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
                    <TextField id="search_company" name="search_company" ref={inputSearchCompany} label="Enter a Company Name to Search" onChange={handleSearchCompany}/>                    
                    <a onClick={handleFlag} title="Flag" className={`${classes.iconAbsolute}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fas fa-yin-yang"}></i> Flag</a>
                    <a onClick={handleFindInventor} title="Find Inventor 2000-2004" className={`${classes.iconAbsolute} ${classes.rightBtn}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fad fa-long-arrow-down"}></i> 2000-04</a>
                    <a onClick={hanldeMissingInventor} title="Missing Inventor" className={`${classes.iconAbsolute} ${classes.rightMissingInven}  ${classes.marginRight} ${classes.marginTop}`}><i className={"fad fa-long-arrow-down"}></i> Missing Inven.</a>
                    <a onClick={handleFlagAutomatic} title="Automatic Flag" className={`${classes.iconAbsolute} ${classes.rightManualFlag}  ${classes.marginRight} ${classes.marginTop}`}><i className={"far fa-layer-plus"}></i> Auto. Flag</a>
                    <span className={`${classes.spanAbsolute} ${classes.marginRight} ${classes.marginTop}`}>{entitiesrow.length > 0 ? entitiesrow.length.toLocaleString() : ''}</span>
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
                  <TextField id="search_transaction" name="search_transaction" ref={inputSearchTransaction} label="Enter a Transaction text to Search" onChange={() => handleSearchTransaction(0)}/>
                  <span className={classes.spanAbsolute}>{transactionrow.length > 0 ? transactionrow.length.toLocaleString() : ''}</span>
                </form>
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
                    rowCount={rows.length}           
                    rowGetter={({index}) => rows[index]}>
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
      searchBar: state.patenTrack.searchBar,
      singleSearchBar: state.patenTrack.singleSearchBar,
      entity_assets: state.patenTrack.entity_assets,
      flag: state.patenTrack.flag,
      flag_update_text: state.patenTrack.flag_update_text,
      searchCompanies: state.patenTrack.searchCompanies,
      entities_list: state.patenTrack.entities_list,
      transaction_list: state.patenTrack.transaction_list,
      asset_list: state.patenTrack.asset_list,
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
    assignmentUpdate,
    updateEntitiesFlag,
    getAssets,
    setAssets,
    searchTransaction,
    setTransactionList,
    updateFlagAutomatic,
    missingInventor,
    findInventor,
    treeFileUpload,
    setEntityAssets, 
    getEntityAssets,
    cancelRequest
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(SearchCompanies);