import { Box, Checkbox, IconButton } from '@material-ui/core'; 
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import useStyles from "./styles";
import PatenTrackApi from '../../../api/patenTrack';


const EntitesGroup = (props) => {
    const classes = useStyles();
    const [sortInventBy, setSortInventBy] = useState('name');
    const [normalizename, setCopiedName] = useState('')
    const [copiedFlag, setCopiedFlag] = useState(-1)
    const [clickedActiveCompany, setClickedActiveCompany] = useState("")
    const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC)
    const [ entitiesrow, setEntitesRow ] = useState([])
    const [entityScrollTop, setEntityScrollTop] = useState(0)
    const [entityrowselection, setEntityRowSelection] = useState([]) 
    const [selectEntityRow, setSelectEntityRow] = useState([])
    const [entityselectionnames, setEntityRowSelectionNames] = useState([])
    const entities_filename = useSelector(state => state.patenTrack.entities_filename)
    const clientID = useSelector(state => state.patenTrack.clientID)
    const portfolioList = useSelector(state => state.patenTrack.portfolioList)
    const flag = useSelector(state => state.patenTrack.flag)
    console.log(props)
    useEffect(() => {
        const getGroupsSuggestions =  async () => { 
            if(clientID > 0 && (typeof props.readFromFile == 'undefined' || props.readFromFile == 0 )) {        
                /* const { data } = await PatenTrackApi.getGroupSuggestions(clientID, portfolioList, flag === 0 ? 1 : flag === 1 ? 3 : 2) 
                setEntitesRow(data) */
                PatenTrackApi.getGroupSuggestions(clientID, portfolioList, flag === 0 ? 1 : flag === 1 ? 3 : 2) 
            }
        }
        getGroupsSuggestions()
    }, [])

    useEffect(() => {
      const getFileData =  async () => { 
        if(clientID > 0 && entities_filename != '' && entities_filename != undefined) {        
          const { data } = await PatenTrackApi.readEntitySuggestionFile(entities_filename) 
          setEntitesRow(data) 
        }
      }
      getFileData()
    }, [entities_filename]);

    useEffect(() => {
      if(typeof props.readFromFile != 'undefined' && props.readFromFile == 1) {
        const getFileData =  async () => { 
          if(clientID > 0 ) {        
            const { data } = await PatenTrackApi.readDataFromFile(clientID, portfolioList, flag === 0 ? 1 : flag === 1 ? 3 : 2) 
            setEntitesRow(data)  
          }
        }
        getFileData()
      }
    }, [props.readFromFile])
    

    const selectRows = async(event, entityName, rowIndex) => {    
        let selectedNames = [...entityselectionnames], oldSelection = [...entityrowselection], rowSelections = [...selectEntityRow]
        const oldItems =   [...entitiesrow] ;
        event.stopPropagation();    
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

    const isRowSelected = rowIndex => entityrowselection.indexOf(entitiesrow[rowIndex]['id']) !== -1;

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

    const nameCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const oldItems =  [...entitiesrow];
        if(entitiesrow.length > 0) {
          const rfID = entitiesrow[rowIndex]['rf_id'] != null ? entitiesrow[rowIndex]['rf_id'].toString() : entitiesrow[rowIndex]['assigneeRFID'] != null ? entitiesrow[rowIndex]['assigneeRFID'].toString() : entitiesrow[rowIndex]['assignorRFID'] != null ? entitiesrow[rowIndex]['assignorRFID'].toString() : '';
          let reelNo = rfID.substring(0,5), frameNo = parseInt(rfID.substring(5, rfID.length));
          if(reelNo.substring(reelNo.length - 1 , reelNo.length) == '0') {
            reelNo = reelNo.substring(0, reelNo.length - 1);
          }
    
          const {flag, correctName} = oldItems[rowIndex]
        
          let urlString = `https://assignment.uspto.gov/patent/index.html#/patent/search/resultAssignment?searchInput=${reelNo}-${frameNo}&id=${reelNo}-${frameNo}`;
          return (
            <span className={cellData === normalizename ? classes.activeCopyRow : oldItems[rowIndex]['representative_company'] == cellData ? classes.activeRepresentative : typeof correctName != 'undefined' && correctName == cellData ? classes.correctRow : oldItems[rowIndex]['normalize_name'] != '' && oldItems[rowIndex]['normalize_name'] != null ? classes.normalizedRow : flag != undefined && parseInt(flag) === 4 ? classes.inventorRow : classes.white} title={cellData}><a href={urlString}  target='_blank' onClick={() => setClickedActiveCompany(cellData)} className={clickedActiveCompany == cellData ? classes.selected : ""}>{cellData}</a></span>
          )
    
        }   
    }

    const sort = ({ sortBy, sortDirection }) => {
        setSortInventBy(sortBy);
        setSortInventDirection(sortDirection);
        let newItems =  [...entitiesrow]  
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
        }     
    }

    const handleCopy = (event, entityName, rowIndex) => {
        event.stopPropagation();
        /*entityName = normalizename != entityName ? entityName : '';*/
        const oldItems =  [...entitiesrow];
        setCopiedName(entityName);
        if(typeof oldItems[rowIndex]['flag'] != 'undefined') {
          setCopiedFlag(parseInt(oldItems[rowIndex]['flag']))
        } else {
          setCopiedFlag(-1)
        } 
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

    const handlePaste = (entityName, rowIndex) => {
        if(normalizename != undefined) {
          let selectedNames = [...entityselectionnames], oldSelection = [...entityrowselection], rowSelection = [...selectEntityRow]
          const oldItems =   [...entitiesrow];
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
        const oldRows = [...entitiesrow];
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
            }  
        })();
    }

    const handleDelete = (name, rowIndex) => {
        const deleteID =  entitiesrow[rowIndex]['id'];
        const row =  entitiesrow[rowIndex] 
        updateEntityData([name], [deleteID], [row], ''); 
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

    const handleEntityScroll = ({clientHeight, clientWidth, scrollHeight, scrollLeft, scrollTop, scrollWidth}) => {
        setEntityScrollTop(scrollTop)
    }

    return ( 
        <div className={classes.addressContainer}>
            <div className={classes.containerChild}> 
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
                      <Column width={width * 0.04} label="#" dataKey="name" disableSort={true} cellRenderer= {checkCellRenderer}/>
                      <Column width={width * 0.40} label="Name" dataKey="name" disableSort={true} cellRenderer= {nameCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" disableSort={true}  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" disableSort={true}  cellRenderer= {pasteCellRenderer}/>
                      <Column width={width * 0.05} label="Occu." disableSort={true} dataKey="counter" />
                      <Column width={width * 0.06} label="Total" disableSort={true} dataKey="total_occurences" />                      
                      <Column width={width * 0.29} label="Normalize" disableSort={true} dataKey="normalize_name" />
                      <Column width={width * 0.04} label="" dataKey="normalize_name" disableSort={true}  cellRenderer= {copyCellRenderer}/>
                      <Column width={width * 0.04} label="" dataKey="name" disableSort={true} cellRenderer= {deleteCellRenderer}/>
                    </Table>
                    )}
                </AutoSizer>
            </div> 
        </div>
    )
}


export default EntitesGroup;