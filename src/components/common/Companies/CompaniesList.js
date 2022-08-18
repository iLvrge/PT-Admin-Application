import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import VirtualizedTable from '../VirtualizedTable'
import useStyles from './styles' 
import { Paper } from '@material-ui/core'

import Loader from "../Loader";

const CompaniesList = (props) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const COLUMNS = [
        {
            width: 35,
            minWidth: 35,
            label: '',
            dataKey: 'representative_id',
            role: 'checkbox', 
            disableSort: true,
            show_selection_count: true,
        },
        {
            width: 300,
            minWidth: 300,
            label: 'Name',
            dataKey: 'original_name',
        },
        {
            width: 50,
            minWidth: 50,
            label: 'Status',
            dataKey: 'status',
            role: 'checkbox', 
            checkedCondition: 1,
            disableSort: true,
        },
        {
            width: 60,
            minWidth: 60,
            label: 'Assets',
            dataKey: 'assets',
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Transactions',
            dataKey: 'no_of_transactions',
        },
        {
            width: 80,
            minWidth: 80,
            label: 'Parties',
            dataKey: 'no_of_parties',
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Arrows',
            dataKey: 'product',
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Arrows / Assets',
            dataKey: 'arrow_assets',
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Arrows / Trns.',
            dataKey: 'arrow_transactions',
        }
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 800 )
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ selectedCompaniesAll, setSelectedCompaniesAll] = useState( false )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [sortField, setSortField] = useState(`original_name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)
    const [ companiesList, setCompaniesList ] = useState([])
    const [accountId, setAccountId] = useState(0)

    

    useEffect(() => {
        console.log(props)
        setCompaniesList( props.list )
        setTotalRecords(props.list.length)
        setSortOrder(props.defaultOrderDirection)
        setSortField((props.defaultOrderBy == 'name' || props.defaultOrderBy == 'organisation_type' || props.defaultOrderBy == 'share_url') ? 'original_name' : props.defaultOrderBy)
        setAccountId(props.clientID)
        setSelectItems(props.selected)
    }, [ props ])


    useEffect(() => {
        let selectAll = true;
        companiesList.map( item => {
            if(item.status == 0 && selectAll === true){
                selectAll = false
            }
        })
        setSelectedCompaniesAll(selectAll)
    }, [companiesList])
   

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        console.log("handleClickRow", checked, row, event, event.target.closest)
        if(typeof event.target.closest == 'function') {
            const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
            if(element != null) {
                let index = element.getAttribute('aria-colindex')   
                if( index == 1 ) {                    
                    let items = [...selectItems]
                    if(checked === true) {
                        items.push(row.representative_id)
                    } else {
                        items = items.filter( item => item !== row.representative_id)
                    }
                    props.onHandleSelectCompany(event, accountId, row.representative_id)
                } else if( index == 3 ) {
                    props.onHandleChangeCompanyStatus(event, accountId, [row.representative_id])
                }
            }
        }
    }, [ dispatch, accountId, selectItems ])

    const handleSelectAll = useCallback(async(event, row) => {
        event.persist();
        const allIDs = []
        setSelectedCompaniesAll(event.target.checked)
        const promise = companiesList.map(item =>  allIDs.push(item.representative_id) )
        await Promise.all(promise)
        props.onHandleChangeCompanyStatus(event, accountId, allIDs)
        
    }, [ dispatch, companiesList ])

    
    return (
        <Paper className={classes.root} square id={`main_companies`}>
            {
                props.loading ?
                    <Loader/>
                    :
                        <VirtualizedTable
                            classes={classes}
                            selected={selectItems}
                            rowSelected={selectedRow}
                            selectedIndex={currentSelection}
                            selectedKey={'id'}    
                            rows={companiesList}
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
            }
        </Paper> 
    )

}


export default CompaniesList;