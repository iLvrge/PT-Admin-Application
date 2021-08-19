import React, { useState, useEffect, forwardRef  } from 'react';
import {connect} from 'react-redux';
import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import Modal from '@material-ui/core/Modal';
import useStyles from "./styles";

import PatenTrackApi from '../../../api/patenTrack'

function Reports(props) {
    const classes = useStyles();
    const [sortBy, setSortBy] = useState('representative_name')
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC)
    const [sortByEvents, setSortByEvents] = useState('event_date')
    const [sortEventDirection, setSortEventDirection] = useState(SortDirection.ASC)

    const [rows, setRows] = useState([])
    const [open, setOpen] = useState(false);
    const [ maintainenceEvents, setMaintainenceEvents] = useState({abaondants: [], renewals: []})

    useEffect(() => {
        setRows(props.companyReports)
    }, [ props.companyReports ])

    const handleClose = () => {
        setOpen(false)
    }

    const getEventList = async(representativeID) => {
        setOpen(true)
        const {data} = await PatenTrackApi.getEventReports(representativeID)
   
        if( data != null) {
            setMaintainenceEvents(data)
        }
    }

    const numberWithCommas = (x) => {
        return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    }

    const sort = ({ sortBy, sortDirection }) => {
        setSortBy(sortBy);
        setSortDirection(sortDirection);

        let newItems = [...rows];
        newItems.sort((a, b) => {
            let firstIndex = sortBy != 'normalize_name' ? !isNaN(Number(a[sortBy])) ? Number(a[sortBy]) : a[sortBy] : a[sortBy];
            let secondIndex = sortBy != 'normalize_name'? !isNaN(Number(b[sortBy])) ? Number(b[sortBy]) : b[sortBy] : a[sortBy];
            if (firstIndex < secondIndex) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (firstIndex > secondIndex) {
                return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
        });
        setRows(newItems); 
    }

    const sortEvents = ({ sortBy, sortDirection }) => {
        setSortByEvents(sortBy);
        setSortEventDirection(sortDirection);

        let newItems = [...rows];
        newItems.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
        });
        setMaintainenceEvents(newItems); 
    }

    const patentFormat = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const cell = cellData.replace(/^0+/, '')
        return (
            numberWithCommas(cell)
        )
    }

    const dateFormat = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
            cellData.substr(0,4)+'-'+cellData.substr(4,2)+'-'+cellData.substr(6,2)
        )
    }

    const formatNumber = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
            numberWithCommas(cellData)
        )
    }

    const formatDigit = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
            parseFloat(cellData).toFixed(0)
        )
    }

    const linkRepresentative = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const rowData = rows[rowIndex]['representative_id']
        return (
            <a className={classes.link} onClick={() => getEventList(rowData)}>{cellData}</a>
        )
    }

    const downloadCSV = (event) => {
        event.preventDefault()
        if(maintainenceEvents.abaondants.length > 0) {
            const abaondants = maintainenceEvents.abaondants.map(function(c){
                return JSON.stringify(Object.values(c));
            })
            .join('\n') 
            .replace(/(^\[)|(\]$)/mg, '');
            downloadFile(abaondants, 'abaondants')
        }

        if(maintainenceEvents.renewals.length > 0) {
            const renewals = maintainenceEvents.renewals.map(function(c){
                return JSON.stringify(Object.values(c));
            })
            .join('\n') 
            .replace(/(^\[)|(\]$)/mg, '');
            downloadFile(renewals, 'renewals')
        }
    }

    const downloadFile = (csvContent, fileName) => {
        const anchor = document.createElement('a');
        var blob = new Blob([csvContent],{type: 'text/csv;charset=utf-8;'});
        var url = URL.createObjectURL(blob);
        anchor.href = url;
        anchor.setAttribute('download', `${fileName}.csv`);
        anchor.click();
    }

    return (
        <div
          className  = {classes.userItemsContainer}
        >
            <AutoSizer>
            {({ width, height}) => (           
                <Table
                    width={width}
                    height={height}
                    headerHeight={30}            
                    rowHeight={40}
                    sort={sort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    rowCount={rows.length}           
                    rowGetter={({index}) => rows[index]}>
                    <Column width={width * 0.30} label="Name" dataKey="representative_name" cellRenderer={linkRepresentative}/>
                    <Column width={width * 0.10} label="Assets" dataKey="assets"  cellRenderer={formatNumber}/>
                    <Column width={width * 0.10} label="Transactions" dataKey="no_of_transactions" cellRenderer={formatNumber}/>
                    <Column width={width * 0.10} label="Parties" dataKey="no_of_parties"  cellRenderer={formatNumber}/>                
                    <Column width={width * 0.10} label="Arrows" dataKey="product"  cellRenderer={formatNumber}/>
                    <Column width={width * 0.30} label="Transactions / Assets" dataKey="tranaction_assets"  cellRenderer={formatDigit}/>
                    <Column width={width * 0.30} label="Loans" dataKey="no_of_loans"  cellRenderer={formatNumber}/>
                    <Column width={width * 0.30} label="Banks" dataKey="no_of_banks"  cellRenderer={formatNumber}/>
                </Table>
            )}
            </AutoSizer>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div
                    className  = {classes.eventsContainer}
                >
                    <button type='button' onClick={(e) => downloadCSV(e)} style={{width: '200px', height: '30px', position: 'absolute', right: '10px'}}>Download CSV</button>
                    <div className={classes.container}>
                        {
                            maintainenceEvents.hasOwnProperty('abaondants') && maintainenceEvents.abaondants.length > 0
                            ?
                            <AutoSizer>
                                {({ width, height}) => (           
                                    <Table
                                        width={200}
                                        height={height}
                                        headerHeight={30}            
                                        rowHeight={40}
                                        sort={sortEvents}
                                        sortBy={sortByEvents}
                                        sortDirection={sortEventDirection}
                                        rowCount={maintainenceEvents.abaondants.length}           
                                        rowGetter={({index}) => maintainenceEvents.abaondants[index]}>         
                                        <Column width={150} label="Abaondants" dataKey="event_date" />
                                    </Table>
                                )}
                            </AutoSizer>
                            :
                            ''
                        }
                    </div>
                    <div className={classes.container}>
                        {
                            maintainenceEvents.hasOwnProperty('renewals') && maintainenceEvents.renewals.length > 0
                            ?
                            <AutoSizer>
                                {({ width, height}) => (           
                                    <Table
                                        width={200}
                                        height={height}
                                        headerHeight={30}            
                                        rowHeight={40}
                                        sort={sortEvents}
                                        sortBy={sortByEvents}
                                        sortDirection={sortEventDirection}
                                        rowCount={maintainenceEvents.renewals.length}           
                                        rowGetter={({index}) => maintainenceEvents.renewals[index]}>         
                                        <Column width={150} label="Renewals" dataKey="event_date" />
                                    </Table>
                                )}
                            </AutoSizer> 
                            :
                            ''
                        }
                    </div>
                </div>
            </Modal>
        </div>
      );

}

const mapStateToProps = state => {
    return {
        width: state.patenTrack.screenWidth,
        height: state.patenTrack.screenHeight,
        companyReports: state.patenTrack.companyReports
    };
};
  
const mapDispatchToProps = {
    
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Reports);