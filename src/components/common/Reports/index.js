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
    const [ maintainenceEvents, setMaintainenceEvents] = useState([])

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
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
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

    const linkRepresentative = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        const rowData = rows[rowIndex]['representative_id']
        return (
            <a className={classes.link} onClick={() => getEventList(rowData)}>{cellData}</a>
        )
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
                    <Column width={width * 0.15} label="Assets" dataKey="assets"  cellRenderer={formatNumber}/>
                    <Column width={width * 0.15} label="Transactions" dataKey="no_of_transactions" cellRenderer={formatNumber}/>
                    <Column width={width * 0.15} label="Parties" dataKey="no_of_parties"  cellRenderer={formatNumber}/>                
                    <Column width={width * 0.25} label="Arrows" dataKey="product"  cellRenderer={formatNumber}/>
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
                    {
                        maintainenceEvents.length > 0
                        ?
                        <AutoSizer>
                            {({ width, height}) => (           
                                <Table
                                    width={width}
                                    height={height}
                                    headerHeight={30}            
                                    rowHeight={40}
                                    sort={sortEvents}
                                    sortBy={sortByEvents}
                                    sortDirection={sortEventDirection}
                                    rowCount={maintainenceEvents.length}           
                                    rowGetter={({index}) => maintainenceEvents[index]}>
                                    <Column width={width * 0.25} label="Application" dataKey="appno_doc_num" cellRenderer={formatNumber}/>
                                    <Column width={width * 0.25} label="Patent" dataKey="grant_doc_num"  cellRenderer={patentFormat}/>                
                                    <Column width={width * 0.15} label="Event Date" dataKey="event_date" cellRenderer={dateFormat}/>
                                </Table>
                            )}
                        </AutoSizer>
                        :
                        ''
                    }
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