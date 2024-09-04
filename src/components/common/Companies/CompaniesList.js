import React, { useCallback, useEffect, useState, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import VirtualizedTable from '../VirtualizedTable'
import useStyles from './styles' 
import { Paper } from '@material-ui/core'

import Loader from "../Loader";
import { setCompanyTableScrollPos } from '../../../actions/patenTrackActions'

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
            width: 100,
            minWidth: 100,
            label: 'Status',
            dataKey: 'status',
            role: 'checkbox', 
            anotherCheckbox: true,
            checkedCondition: 1,
            disableSort: true,
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Assets',
            dataKey: 'assets',
            headingIcon: 'assets',
            disableLabel: true
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Transactions',
            dataKey: 'no_of_transactions',
            headingIcon: 'transactions',
            disableLabel: true
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Parties',
            dataKey: 'no_of_parties',
            headingIcon: 'parties',
            disableLabel: true
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Entities',
            dataKey: 'no_of_entities',
            headingIcon: 'entities',
            disableLabel: true
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Employees',
            dataKey: 'no_of_employees',
            headingIcon: 'employees',
            disableLabel: true
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
            headingIcon: 'arrows',
            disableLabel: true
        },
        {
            width: 50,
            minWidth: 50,
            label: 'Family',
            dataKey: 'family',  
        },
        {
            width: 100,
            minWidth: 100,
            label: 'Updated',
            dataKey: 'updated',  
        }
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 800 )
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectStatusItems, setSelectStatusItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ selectedCompaniesAll, setSelectedCompaniesAll] = useState( false )   
    const [ selectedCompaniesStatusAll, setSelectedCompaniesStatusAll] = useState( false )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [sortField, setSortField] = useState(`original_name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)
    const [ companiesList, setCompaniesList ] = useState([])
    const [accountId, setAccountId] = useState(0) 
    const companyTableScrollPosition = useSelector(state => state.patenTrack.company_scroll_pos)
    

    useEffect(() => {
        if(typeof props.list != 'undefined') { 
            setCompaniesList( props.list )
            setTotalRecords(props.list.length)
        }
        setSortOrder(props.defaultOrderDirection)
        setSortField((props.defaultOrderBy == 'name' || props.defaultOrderBy == 'organisation_type' || props.defaultOrderBy == 'share_url') ? 'original_name' : props.defaultOrderBy)
        setAccountId(props.clientID)
        if(typeof props.selected != 'undefined') { 
            setSelectItems(props.selected)
        }
    }, [ props ])


    useEffect(() => {
        let selectAll = true, selected = [];
        companiesList.map( item => {
            if(item.status == 1){
                selected.push(item.representative_id)
            }
            if(item.status == 0 && selectAll === true){
                selectAll = false
            }
        }) 
        setSelectedCompaniesStatusAll(selectAll)
        setSelectStatusItems(selected)
    }, [companiesList])
   

    const handleClickRow = useCallback((event, row) => {
        event.persist()
        const { checked } = event.target; 
        if(typeof event.target.closest == 'function') {
            const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
            if(element != null) {
                let index = element.getAttribute('aria-colindex')   
                if( index == 1 ) { 
                    props.onHandleSelectCompany(event, accountId, row.representative_id, props.list)
                } else if( index == 3 ) {
                    setSelectedCompaniesStatusAll(false)
                    const oldItems = [...selectStatusItems]
                    if(!oldItems.includes(row.representative_id)){
                        oldItems.push(row.representative_id)
                    } else {
                        const findIndex = oldItems.findIndex( item => item == row.representative_id)
                        if(findIndex !== -1) {
                            oldItems.splice(findIndex, 1)
                        }
                    }
                    setSelectStatusItems(oldItems)
                    props.onHandleChangeCompanyStatus(event.target.checked === true ? 1 : 0, accountId, [row.representative_id])
                }
            }
        }
    }, [ dispatch, accountId ])

    const handleSelectAll = useCallback(async(event, row) => {
        event.persist();
        if(typeof event.target.closest == 'function') {
            const element = event.target.closest('div.ReactVirtualized__Table__headerColumn')
            const findHeadCell = element.querySelector('div.MuiTableCell-head')
            if(findHeadCell !== null) { 
                let colIndex = -1
                const allClasses = findHeadCell.classList
                const result = [...allClasses].some(className => {
                    const findIndex = className.indexOf('col-')
                    if(findIndex !== -1) {
                        colIndex = className.replace('col-', '')
                    }
                });

                if( colIndex !== -1 ) {
                    if(parseInt(colIndex) == 0) {  
                        const allCompanies = []
                        if(event.target.checked === true) {
                            setSelectedCompaniesAll(true)
                            const promise = props.list.map( item =>  allCompanies.push(item.representative_id)) 
                            await Promise.all(promise) 
                        } else {
                            setSelectedCompaniesAll(false)
                        }
                        props.onHandleSelectCompany(event, accountId, allCompanies, props.list)
                    } else {  
                        const allIDs = []
                        let checked = 0
                        if(event.target.checked === true) {
                            checked = 1
                            setSelectedCompaniesStatusAll(true)
                        } else {
                            setSelectedCompaniesStatusAll(false)
                        } 
                        const promise = companiesList.map(item =>  allIDs.push(item.representative_id) )
                        await Promise.all(promise)
                        props.onHandleChangeCompanyStatus(checked, accountId, allIDs)
                    }
                }
            }
        }
    }, [ dispatch, companiesList, selectedCompaniesAll ])

    const onScrollTable = (scrollPos) => {
        if(scrollPos > 0) { 
            dispatch(setCompanyTableScrollPos(scrollPos))
        }
    }
    
    return (
        <Paper className={classes.root} square id={`main_companies`}>
            {
                props.loading ?
                    <Loader/>
                    :
                        <VirtualizedTable
                            classes={classes}
                            scrollTop={companyTableScrollPosition}
                            selected={selectItems}
                            anotherSelected={selectStatusItems}
                            rowSelected={selectedRow}
                            selectedIndex={currentSelection}
                            selectedKey={'id'}    
                            scrollToIndex={true}
                            rows={companiesList}
                            rowHeight={rowHeight}
                            headerHeight={headerRowHeight}
                            columns={headerColumns}
                            totalRows={totalRecords}
                            onSelect={handleClickRow}
                            onSelectAll={handleSelectAll}
                            onScrollTable={onScrollTable}
                            defaultSelectAll={selectedCompaniesAll} 
                            defaultAnotherSelectAll={selectedCompaniesStatusAll}    
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