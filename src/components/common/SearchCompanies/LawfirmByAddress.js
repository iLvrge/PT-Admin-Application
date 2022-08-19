import React, { useState, useRef, forwardRef, useEffect, useCallback  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Loader from "../Loader";
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';


import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';


import PatenTrackApi from '../../../api/patenTrack';

import {  updateNormalizeEntites, setEntityAssets, getEntityAssets, getListByLawfirmAddressCompany } from "../../../actions/patenTrackActions";
import { TextField } from "@material-ui/core";



function LawfirmByAddress(props) {

    const WAIT_INTERVAL = 200;
    const classes = useStyles();
    const inputSearchCompany = useRef(null)
    const [rows, setRows] = useState([]);
    const [rowsInitial, setRowsInitial] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [state, setState] = useState(1);
    const [timeInterval, setTimeInterval] =  useState( null );
    const [clickedActiveCompany, setClickedActiveCompany] = useState("")
    const [sortCompanies, setSortCompanies] = useState('counter');
    const [sortCompaniesDirection, setSortCompaniesDirection] = useState(SortDirection.DESC)

    const [sortAddress, setSortAddress] = useState('address');
    const [sortAddressDirection, setSortAddressDirection] = useState(SortDirection.DESC)

    const [selectedAddress, setSelectedAddress] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState([])

    const [entityrowselection, setEntityRowSelection] = useState([])
    const [entityselectionnames, setEntityRowSelectionNames] = useState([])

    const [normalizename, setCopiedName] = useState('')



    const resetAll = () => {
        setRows([])
        setRowsInitial([])
        setCopiedName('')
        setEntityRowSelection([]);
        setEntityRowSelectionNames([]);
    }

     useEffect(() => {    
        resetAll();
        if(props.searchCompanyByIDAddressData && props.searchCompanyByIDAddressData.length > 0 ){      
            setRows(props.searchCompanyByIDAddressData);
            setRowsInitial(props.searchCompanyByIDAddressData);
            setSortCompanies('counter');
        }
    }, [props.searchCompanyByIDAddressData]) 

    useEffect(() => {    
        resetAll();
        if(props.searchCompanyByIDAddresses && props.searchCompanyByIDAddresses.length > 0 ){      
            setAddresses(props.searchCompanyByIDAddresses);
            setSortAddress('address');
        }
    }, [props.searchCompanyByIDAddresses])

    const searchCompaniesBySelectedAddress = useCallback(() => {
        if( selectedAddress.length > 0 ) {
            setState(2)
            setRows([])
            setRowsInitial([])
            let formData = new FormData();
            for (var i = 0; i < selectedAddress.length; i++) {
                formData.append('address[]', selectedAddress[i]);
            }
            props.getListByLawfirmAddressCompany(props.searchedLawfirmAddressID, formData)
        }
        
    }, [ selectedAddress ])

    const unSelectAllSelectedAddress = () => {
        setSelectedAddress([])
        setSelectedAddressId([])
    }

    const backToAddress = () => {
        setState(1)        
    }


    const sort = ({ sortBy, sortDirection }) => {
        setSortCompanies(sortBy);
        setSortCompaniesDirection(sortDirection);

        let newItems = [...rowsInitial];
        
        newItems.sort((a, b) => {
            let firstIndex = sortBy != 'representative_name' ? a[sortBy] : a.representative_name != null ? a.representative_name : '';
            let secondIndex = sortBy != 'representative_name' ? b[sortBy] : b.representative_name != null ? b.representative_name : '';

            firstIndex = !isNaN(Number(firstIndex)) ? Number(firstIndex) :  firstIndex.toLowerCase();
            secondIndex =  !isNaN(Number(secondIndex)) ? Number(secondIndex) :  secondIndex.toLowerCase()
            if (firstIndex < secondIndex) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (firstIndex > secondIndex) {
                return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
        });
        
        setRowsInitial(newItems);   
        setRows(newItems); 
    }



    const sortAddressFn = ({ sortBy, sortDirection }) => {
        setSortAddress(sortBy);
        setSortAddressDirection(sortDirection);

        let newItems = [...addresses];
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
        setAddresses(newItems);   
    }


    const selectAddressRows =  (event, address, rowIndex) => {    
        let selectedAddresses = [...selectedAddress];
        let oldSelection = [...selectedAddressId];  
        const oldItems =   [...addresses];
        event.stopPropagation();  
        console.log(event.target.checked);
        if(event.target.checked) {
            let cntrlKey = event.ctrlKey ? event.ctrlKey : false;
            let previousIndex = -1;
            
            if (cntrlKey && oldSelection.length > 0) {
                previousIndex = oldItems.findIndex(item => item.rf_id == oldSelection[oldSelection.length - 1]);
            }
            if(previousIndex >= 0) { 
                if(previousIndex > rowIndex) {
                    oldItems.forEach((r, index) => {
                        if(index >= rowIndex && index <= previousIndex) {
                            if(selectedAddresses.indexOf(r.address) < 0) {
                                oldSelection.push(r.rf_id);
                                selectedAddresses.push(r.address);
                            }
                        }
                    });
                } else {
                    oldItems.forEach((r, index) => {
                        if(index >= previousIndex && index <= rowIndex) {
                            if(selectedAddresses.indexOf(r.address) < 0) {
                                oldSelection.push(r.rf_id);
                                selectedAddresses.push(r.address);
                            }
                        }
                    });
                }
            } else {
                if(selectedAddresses.indexOf(address) < 0) {
                    selectedAddresses.push(address);
                    oldSelection.push(oldItems[rowIndex]['rf_id']);
                }
            }      
        } else {
            const findIndex = selectedAddresses.indexOf(address);
            if(findIndex >= 0){
                selectedAddresses.splice(findIndex, 1);
                oldSelection.splice(findIndex, 1);
            } 
        }
        setSelectedAddress(selectedAddresses)
        setSelectedAddressId(oldSelection);
    }

    const selectRows = (event, entityName, rowIndex) => {    
        let selectedNames = [...entityselectionnames];
        let oldSelection = [...entityrowselection];  
        const oldItems =   [...rowsInitial];
        event.stopPropagation();   
        console.log(event.target.checked);
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
                    if(selectedNames.indexOf(r.name) < 0) {
                        oldSelection.push(r.law_firm_id);
                        selectedNames.push(r.name);
                    }
                    }
                });
                } else {
                oldItems.forEach((r, index) => {
                    if(index >= previousIndex && index <= rowIndex) {
                    if(selectedNames.indexOf(r.name) < 0) {
                        oldSelection.push(r.law_firm_id);
                        selectedNames.push(r.name);
                    }
                    }
                });
                }
            } else {
                if(selectedNames.indexOf(entityName) < 0) {
                    selectedNames.push(entityName);
                    oldSelection.push(oldItems[rowIndex]['law_firm_id']);
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
        /*entityName = normalizename != entityName ? entityName : '';*/
        setCopiedName(entityName);
    }

    const handleCopyNormalizeLawFirm = (event, cellData, rowIndex) => {
        event.stopPropagation();
        const oldItems =   [...rowsInitial];
        setCopiedName(oldItems[rowIndex].representative_name != null ? oldItems[rowIndex].representative_name : '');
    }

    const handlePaste = (entityName, rowIndex) => {
        if(normalizename != undefined) {
            let selectedNames = [...entityselectionnames];
            let oldSelection = [...entityrowselection];
            const oldItems =   [...rowsInitial];
            if(selectedNames.indexOf(entityName) < 0) {
                selectedNames.push(entityName);
                oldSelection.push(oldItems[rowIndex]['law_firm_id']);
            }
            setEntityRowSelectionNames(selectedNames);
            setEntityRowSelection(oldSelection);
            updateEntityData(selectedNames, oldSelection, normalizename);
        } else {
            alert("Please select normalize entity first.");
        }
    }

    const updateEntityData = (selectedNames, oldSelection, normalizename) => {
        if(selectedNames.length > 0) {
            const  promise = []; let allUpdates = [];
            let formData = new FormData();

            formData.append('law_firm_ids', JSON.stringify(oldSelection));
            formData.append('normalize_name', normalizename );
            formData.append('client_id', 0);
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
                setEntityRowSelection([]);
              if(allUpdates.length > 0) {
                updateLawFirmRows(allUpdates);
              }
            })
        }    
    }

    const updateLawFirmRows = ( data ) => {
        const oldRows = [...rowsInitial];
        (async () => {
          const promise = data.map(d => {
            const rowIndex = oldRows.findIndex( r => r.law_firm_id == d.law_firm_id);
            if( rowIndex !== -1 ) {          
              //oldRows[rowIndex] = d;
              if(d.representativelawfirm != null) {
                oldRows[rowIndex].representative_id = d.representativelawfirm.representative_id;
                oldRows[rowIndex].representative_name = d.representativelawfirm.representative_name;
              } else {
                delete oldRows[rowIndex].representative_id
                delete oldRows[rowIndex].representative_name
              }         
            }        
            return d;
          });
          await Promise.all(promise);
          setRows(oldRows);
          setRowsInitial(oldRows);
        })(); 
    }


    const handleDelete = (name, rowIndex) => {
        const deleteID = rowsInitial[rowIndex]['law_firm_id'];
        updateEntityData([name], [deleteID], '');
    }

    const isRowSelected = rowIndex => entityrowselection.indexOf(rowsInitial[rowIndex]['law_firm_id']) !== -1;

    const isAddressRowSelected = rowIndex => selectedAddress.indexOf(addresses[rowIndex]['address']) !== -1;

    const checkAddressCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
        <Checkbox
        checked={isAddressRowSelected(rowIndex)}
        onClick={(event) => selectAddressRows(event, cellData, rowIndex)}
        value={cellData}
        inputProps={{ 'aria-labelledby': `enhanced-table-checkbox-${rowIndex}` }}
        />
        )
    }

    const normalizeLawFirmCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return rowsInitial[rowIndex].representative_name != null ? rowsInitial[rowIndex].representative_name : '';
    }

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

    const copyNormalizeLawFirm = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
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

    const findEntityAssets = (entityID) => {
        props.setEntityAssets({entity_id: entityID, count: 0});
        props.getEntityAssets(entityID);
    }

    const nameRFIDCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const oldItems = [...rowsInitial];
        const urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=reelNo:${oldItems[rowIndex].reel_no}%7CframeNo:${oldItems[rowIndex].frame_no}&qc=1&reelNo=${oldItems[rowIndex].reel_no}&frameNo=${oldItems[rowIndex].frame_no}`;
        
        return (
        <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex].representative_name == cellData ? classes.activeRepresentative : oldItems[rowIndex].representative_name != null ? classes.normalizedRow : classes.white} title={cellData}><a href={urlString} target='_blank'>{cellData}</a></span>
        )
    }

    const findWordWithKeys = (keys, list, searchText) => {
        let findList = [];
        try{
          if(list.length > 0 && keys.length > 0) {
            (async () => {
              const promises = keys.map( key => {
                const searchItems = list.filter( e => e[key] != null && e[key].toLowerCase().includes(searchText));
                if(searchItems.length > 0){
                  findList = [...findList, ...searchItems];
                }
                return searchItems;
              })
              await Promise.all(promises);
            })();
          }
        } catch(e){
          console.log(e);
        }
        return findList;
    }

    const handleSearchCompany = (event) => {    
            /**event.target.value giving old value in setimeout */
            clearTimeout(timeInterval);
            setTimeInterval(setTimeout(() => {
            if(rows.length > 0) {
                let getList = [];
                if(inputSearchCompany.current.querySelector("#search_company").value.length > 0) {
                    let splitWord = inputSearchCompany.current.querySelector("#search_company").value.toLowerCase().split(' ');
                    //splitWord = splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
                    getList = findWordWithKeys(['name', 'normalize_name'], rows, splitWord);
                } else {
                    getList = rows;
                }
                setRowsInitial(getList) ;
            } 
        }, WAIT_INTERVAL));  
    }


    return (
    <div
      className={`${classes.searchContainer} search_container`}
    >
      <div
        className={classes.container}
      >
         <div className={classes.context}>
            <div className={`search-list ${classes.scrollbar}`} >
            {
                props.isLoading
                ?
                <Loader/>
                :
                    <React.Fragment>
                        <div style={{height: '50px'}}>
                            {
                                state == 1 
                                ?
                                    <React.Fragment>
                                        <button onClick={searchCompaniesBySelectedAddress}>Find Law Firms</button> 
                                        <button onClick={unSelectAllSelectedAddress}>UnSelect All</button>
                                    </React.Fragment>
                                :
                                <React.Fragment>
                                    <button onClick={backToAddress}>Back</button> 
                                    {
                                        state == 2 && rows.length > 0 && (
                                            <TextField id="search_company" name="search_company" ref={inputSearchCompany} label="Search within" onChange={handleSearchCompany}  className={classes.searchInputbox}/>    
                                        )
                                    }     
                                </React.Fragment>
                            }
                            Total: {state == 1 ?  addresses.length : state == 2 ? rowsInitial.length : ''}
                        </div>
                        <div style={{width: '100%', float: 'left', height: '90%'}}>
                        {
                            state == 2 && rows.length > 0
                            ?  
                        
                                <AutoSizer>
                                {({ width, height}) => (           
                                    <Table
                                    width={width}
                                    height={height}
                                    headerHeight={30}            
                                    rowHeight={60} 
                                    sort={sort}
                                    sortBy={sortCompanies}
                                    sortDirection={sortCompaniesDirection}
                                    rowCount={rowsInitial.length}           
                                    rowGetter={({index}) => rowsInitial[index]}>
                                    <Column width={width * 0.04} label="#" dataKey="law_firm_id" cellRenderer= {checkCellRenderer}/>
                                    <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameRFIDCellRenderer}/>
                                    <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                                    <Column width={width * 0.04} label="" dataKey="law_firm_id"  cellRenderer= {pasteCellRenderer}/>
                                    <Column width={width * 0.09} label="Occu." dataKey="counter" />                    
                                    <Column width={width * 0.09} label="Total Occu." dataKey="total_occurences" />    
                                    <Column width={width * 0.29} label="Normalize" dataKey="representative_name" cellRenderer={normalizeLawFirmCellRenderer}/>
                                    <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyNormalizeLawFirm}/>
                                    <Column width={width * 0.04} label="" dataKey="law_firm_id" cellRenderer= {deleteCellRenderer}/>
                                </Table>
                                )}
                                </AutoSizer>
                            :
                            state == 2 && rows.length == 0
                            ?
                                'This company is not an assignee'
                            :
                            state == 1 && addresses.length > 0
                            ?
                                <AutoSizer>
                                    {({ width, height}) => (           
                                        <Table
                                        width={width}
                                        height={height}
                                        headerHeight={30}            
                                        rowHeight={60}
                                        sort={sortAddressFn}
                                        sortBy={sortAddress}
                                        sortDirection={sortAddressDirection}
                                        rowCount={addresses.length}           
                                        rowGetter={({index}) => addresses[index]}>
                                        <Column width={width * 0.04} label="#" dataKey="address" cellRenderer= {checkAddressCellRenderer}/>
                                        <Column width={width * 0.29} label="address" dataKey="address"/>
                                    </Table>
                                    )}
                                </AutoSizer>
                            :
                            'This company is not an assignee'
                        }
                        </div>
                    </React.Fragment>
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
      isLoading: state.patenTrack.searchedLawfirmByIDLoading,
      searchCompanyByIDAddressData: state.patenTrack.searchLawfirmByIDAddressData,
      searchCompanyByIDAddresses: state.patenTrack.searchLawfirmByIDAddresses,
      searchedLawfirmAddressID: state.patenTrack.searchedLawfirmAddressID
    };
  };
  
  const mapDispatchToProps = {
    updateNormalizeEntites,
    setEntityAssets, 
    getEntityAssets,
    getListByLawfirmAddressCompany
  };

export default connect(mapStateToProps, mapDispatchToProps)(LawfirmByAddress);