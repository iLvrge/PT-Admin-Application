import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import VirtualizedTable from '../VirtualizedTable';
import moment from 'moment'
import useStyles from './styles' 


const Reclassify = ({data}) => {

    const numberWithCommas = (date) => {
        return moment( new Date(date)).format('h:mm:ss')
    }

    const classes = useStyles()
    const dispatch = useDispatch()
    const COLUMNS = [  
        {
            width: 150,
            minWidth: 150,
            label: 'Company',
            dataKey: 'representative_name',
        }, 
        {
            width: 150,
            minWidth: 150,
            label: 'Message',
            dataKey: 'message',
        },
        {
            width: 50,
            minWidth: 50,
            label: 'Start', 
            staticIcon: "",
            format: numberWithCommas,
            dataKey: 'start_time',
        },
        {
            width: 50,
            minWidth: 50,
            label: 'End',
            staticIcon: "",
            format: numberWithCommas,
            dataKey: 'end_time',
        }, 
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 800 )
    const [ logs, setLogs ] = useState([])
    const [ statusData, setStatusData ] = useState(null)
    const [ totalRecords, setTotalRecords ] = useState()
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ currentSelection, setCurrentSelection ] = useState(null)  
    const [ selectedCompaniesAll, setSelectedCompaniesAll] = useState( false ) 
    const [sortField, setSortField] = useState(`id`)
    const [sortOrder, setSortOrder] = useState(`DESC`)


    useEffect(() => { 
        setLogs(data)  
        setTotalRecords(data.length) 
    }, [data])

    const handleClickRow = () => {

    }

    const handleSelectAll = () => {
        
    }

    return (
        <VirtualizedTable
            classes={classes}
            selected={selectItems}
            rowSelected={selectedRow}
            selectedIndex={currentSelection}
            selectedKey={'id'}    
            rows={logs}
            rowHeight={rowHeight}
            headerHeight={headerRowHeight}
            columns={headerColumns}
            totalRows={totalRecords}
            onSelect={handleClickRow}
            onSelectAll={handleSelectAll}
            defaultSelectAll={selectedCompaniesAll}     
            defaultSortField={sortField}
            defaultSortDirection={sortOrder}
            responsive={true}
            noBorderLines={true}
            width={width} 
            containerStyle={{ 
                width: '100%',
                maxWidth: '100%' 
            }} 
            style={{
                width: '100%'
            }}
        />
    )

}


export default Reclassify;