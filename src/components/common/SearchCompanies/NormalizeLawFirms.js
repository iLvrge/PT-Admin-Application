import React, { useState, useRef, forwardRef, useEffect, useCallback  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";
import PerfectScrollbar from 'react-perfect-scrollbar';
import Loader from "../Loader";
import IconButton from '@mui/material/IconButton';
import Checkbox from '@mui/material/Checkbox';


import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';


import PatenTrackApi from '../../../api/patenTrack';

import {  updateNormalizeEntites, setEntityAssets, getEntityAssets, getListByLawfirmAddressCompany } from "../../../actions/patenTrackActions"; 



function NormalizeLawFirms(props) {

    const WAIT_INTERVAL = 200;
    const classes = useStyles(); 
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowsInitial, setRowsInitial] = useState([]); 
    const [sortCompanies, setSortCompanies] = useState('counter');
    const [sortCompaniesDirection, setSortCompaniesDirection] = useState(SortDirection.DESC) 

    const [entityrowselection, setEntityRowSelection] = useState([])
    const [entityselectionnames, setEntityRowSelectionNames] = useState([])


    const resetAll = () => {
        setRows([])
        setRowsInitial([])
        setEntityRowSelection([]);
        setEntityRowSelectionNames([]);
    }

     useEffect(() => {    
        resetAll();
        if(props.lawFirmID > 0 ){
            const getNormalizeLawfirms = async () => { 
                setIsLoading(true)
                const {data} =  await PatenTrackApi.getNormalizeLawfirms(props.lawFirmID)
                setRows(data);
                setRowsInitial(data);
                setSortCompanies('counter');
                setIsLoading(false)
            } 
            getNormalizeLawfirms()
        }
    }, [props.lawFirmID]) 
 

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
                const name = oldItems[rowIndex]['name']
                if(selectedNames.indexOf(name) < 0) {
                    selectedNames.push(name);
                    oldSelection.push(oldItems[rowIndex]['law_firm_id']);
                }
            }      
        } else {
            const name = oldItems[rowIndex]['name']
            const findIndex = selectedNames.indexOf(name);
            if(findIndex >= 0){
                selectedNames.splice(findIndex, 1);
                oldSelection.splice(findIndex, 1);
            } 
        } 

        console.log(selectedNames, oldSelection);
        setEntityRowSelectionNames(selectedNames);
        setEntityRowSelection(oldSelection);
    }

    const updateEntityData = (selectedNames, oldSelection, normalizename) => {
        if(selectedNames.length > 0) {
            const  promise = []; let allUpdates = [];
            let formData = new FormData();
            formData.append('names', JSON.stringify(selectedNames));
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
                setEntityRowSelectionNames([]);
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
        if(entityselectionnames.length > 0 && entityrowselection.length > 0) {
            updateEntityData(entityselectionnames, entityrowselection, '');
        } else {
            const deleteID = rowsInitial[rowIndex]['law_firm_id'];
            updateEntityData([name], [deleteID], '');
        }
    }

    const isRowSelected = rowIndex => entityrowselection.indexOf(rowsInitial[rowIndex]['law_firm_id']) !== -1;

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

    const deleteCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
            <IconButton
                color             = "inherit"
                aria-haspopup     = "true"
                onClick           = {() => {handleDelete(cellData, rowIndex)}}
                size="large">
                {
                <i className={"fa fa-trash"} title="Delete"></i>
                }
            </IconButton>
        );
    }

    const nameRFIDCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const oldItems = [...rowsInitial];
        const urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultFilter?advSearchFilter=reelNo:${oldItems[rowIndex].reel_no}%7CframeNo:${oldItems[rowIndex].frame_no}&qc=1&reelNo=${oldItems[rowIndex].reel_no}&frameNo=${oldItems[rowIndex].frame_no}`;
        
        return (
        <span className={oldItems[rowIndex].representative_name == cellData ? classes.activeRepresentative : oldItems[rowIndex].representative_name != null ? classes.normalizedRow : classes.white} title={cellData}><a href={urlString} target='_blank'>{cellData}</a></span>
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
                isLoading
                ?
                    <Loader/>
                :
                    <React.Fragment>
                        <div style={{height: '50px'}}>
                            Total: {rowsInitial.length}
                        </div>
                        <div style={{width: '100%', float: 'left', height: '90%'}}>
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
                                    sortBy={sortCompanies}
                                    sortDirection={sortCompaniesDirection}
                                    rowCount={rowsInitial.length}           
                                    rowGetter={({index}) => rowsInitial[index]}>
                                    <Column width={width * 0.04} label="#" dataKey="law_firm_id" cellRenderer= {checkCellRenderer}/>
                                    <Column width={width * 0.29} label="Name" dataKey="name" cellRenderer= {nameRFIDCellRenderer}/>
                                    <Column width={width * 0.29} label="Normalize" dataKey="representative_name" cellRenderer={normalizeLawFirmCellRenderer}/>
                                    <Column width={width * 0.04} label="" dataKey="law_firm_id" cellRenderer= {deleteCellRenderer}/>
                                </Table>
                                )}
                                </AutoSizer>
                            :
                            ''
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
    };
  };
  
  const mapDispatchToProps = {
    updateNormalizeEntites,
    setEntityAssets, 
    getEntityAssets,
    getListByLawfirmAddressCompany
  };

export default connect(mapStateToProps, mapDispatchToProps)(NormalizeLawFirms);