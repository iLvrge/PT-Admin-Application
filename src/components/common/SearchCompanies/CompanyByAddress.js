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

import {  updateNormalizeEntites, setEntityAssets, getEntityAssets, getListByCompanyAddressCompany } from "../../../actions/patenTrackActions";


function CompanyByAddress(props) {
  
    const classes = useStyles();
    const [rows, setRows] = useState([]);
    const [rowsInitial, setRowsInitial] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [state, setState] = useState(1);
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
            props.getListByCompanyAddressCompany(props.searchedCompanyAddressID, formData, props.company_modal)
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
        if (a[sortBy] < b[sortBy]) {
            return sortDirection === SortDirection.ASC ? -1 : 1;
        }
        if (a[sortBy] > b[sortBy]) {
            return sortDirection === SortDirection.ASC ? 1 : -1;
        }
        return 0;
        });
        setRowsInitial(newItems);   
    }

    const sortAddressFn = ({ sortBy, sortDirection }) => {
        setSortAddress(sortBy);
        setSortAddressDirection(sortDirection);

        let newItems = [...addresses];
        newItems.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
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
            
            if (cntrlKey && selectedAddresses.length > 0) {
                previousIndex = oldItems.findIndex(item => item.address == selectedAddresses[selectedAddresses.length - 1]);
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
        /*entityName = normalizename != entityName ? entityName : '';*/
        setCopiedName(entityName);
    }

    const handlePaste = (entityName, rowIndex) => {
        if(normalizename != undefined) {
        let selectedNames = [...entityselectionnames];
        let oldSelection = [...entityrowselection];
        const oldItems =   [...rowsInitial];
        if(selectedNames.indexOf(entityName) < 0) {
            selectedNames.push(entityName);
            oldSelection.push(oldItems[rowIndex]['id']);
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
            formData.append('IDs', JSON.stringify(oldSelection));
            formData.append('normalize_name', normalizename );
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
                if(allUpdates.length > 0) {
                    updateRows(allUpdates);
                }
            })
        }    
    }

    const updateRows = ( data ) => {
        console.log("data", data);
        const oldRows = [...rowsInitial];
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
            
            console.log("oldRows", oldRows);
            setRowsInitial(oldRows);   
            let oldData = [...rows];
            const promiseData = data.map(d => {
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
            await Promise.all(promiseData);
            setRows(oldData);
        })();
    }

    const handleDelete = (name, rowIndex) => {
        const deleteID = rowsInitial[rowIndex]['id'];
        updateEntityData([name], [deleteID], '');
    }

    const isRowSelected = rowIndex => entityrowselection.indexOf(rowsInitial[rowIndex]['id']) !== -1;

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
        const rfID =  oldItems[rowIndex]['assigneeRFID'] != null ? oldItems[rowIndex]['assigneeRFID'].toString() : oldItems[rowIndex]['assignorRFID'] != null ? oldItems[rowIndex]['assignorRFID'].toString() : '';
        let reelNo = rfID.split('-');    
        const findAssets = oldItems[rowIndex]['count_assets'] != undefined ? <a style={{marginLeft:'10px'}} className={classes.pointer} onClick={() => findEntityAssets(oldItems[rowIndex]['assignor_and_assignee_id'])}>({oldItems[rowIndex]['count_assets']})</a> : '';
        /* let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/result?id=${cellData}&type=patAssigneeName`; */
        let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=reelNo:${reelNo[0]}%7CframeNo:${reelNo[1]}&qc=1&reelNo=${reelNo[0]}&frameNo=${reelNo[1]}`;
        return (
        <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : oldItems[rowIndex]['normalize_name'] != '' && oldItems[rowIndex]['normalize_name'] != null ? classes.normalizedRow : '' } title={cellData}><a href={urlString} target='_blank' className={cellData == clickedActiveCompany ? classes.rowBold : ''} onClick={() => setClickedActiveCompany(cellData)}>{cellData}</a>{findAssets}</span>
        )
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
                <>
                    <div style={{height: '50px'}}>
                    {
                        state == 1 
                        ?
                        <><button onClick={searchCompaniesBySelectedAddress}>Find Companies</button> <button onClick={unSelectAllSelectedAddress}>UnSelect All</button></>
                        :
                        <button onClick={backToAddress}>Back</button>
                    }
                    </div>
                    <div style={{width: '100%', float: 'left', height: '90%'}}>
                    {
                        state == 2 && rowsInitial.length > 0
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
                                <Column width={width * 0.04} label="#" dataKey="name" cellRenderer= {checkCellRenderer}/>
                                <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameRFIDCellRenderer}/>
                                <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {copyCellRenderer}/>
                                <Column width={width * 0.04} label="" dataKey="name"  cellRenderer= {pasteCellRenderer}/>
                                <Column width={width * 0.09} label="Occu." dataKey="counter" />                    
                                <Column width={width * 0.09} label="Total Occu." dataKey="total_occurences" />                    
                                <Column width={width * 0.29} label="Normalize" dataKey="normalize_name" />
                                <Column width={width * 0.04} label="" dataKey="normalize_name"  cellRenderer= {copyCellRenderer}/>
                                <Column width={width * 0.04} label="" dataKey="name" cellRenderer= {deleteCellRenderer}/>
                            </Table>
                            )}
                            </AutoSizer>
                        :
                        state == 2 && rowsInitial.length == 0
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
                    </>
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
      isLoading: state.patenTrack.searchedCompanyByIDLoading,
      company_modal: state.patenTrack.company_modal,
      searchCompanyByIDAddressData: state.patenTrack.searchCompanyIDAddressData,
      searchCompanyByIDAddresses: state.patenTrack.searchCompanyByIDAddresses,
      searchedCompanyAddressID: state.patenTrack.searchedCompanyAddressID
    };
  };
  
  const mapDispatchToProps = {
    updateNormalizeEntites,
    setEntityAssets, 
    getEntityAssets,
    getListByCompanyAddressCompany
  };

export default connect(mapStateToProps, mapDispatchToProps)(CompanyByAddress);