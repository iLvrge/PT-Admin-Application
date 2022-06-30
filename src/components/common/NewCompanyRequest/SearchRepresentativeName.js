import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Paper, TextField, Grid, Box } from '@material-ui/core';

import useStyles from './styles' 
import VirtualizedTable from '../VirtualizedTable';
import Loader from '../Loader';
import PatenTrackApi from '../../../api/patenTrack';

const SearchRepresentativeName = (props) => {

    const classes = useStyles();
    const WAIT_INTERVAL = 200;
    const inputSearchCompany = useRef(null);
    const [timeInterval, setTimeInterval] =  useState( null );

    const [list, setList] = useState([])
    const [loading, setLoading] = useState(false)

    const COLUMNS = [
        {
            width: 35,
            minWidth: 35,
            label: '',
            dataKey: 'representative_id',
            role: 'radio', 
            disableSort: true,
            show_selection_count: true,
        },
        {
            width: 300,
            minWidth: 300,
            label: 'Representative',
            dataKey: 'representative_name',
        }
    ]
    const [headerColumns, setHeaderColumns] = useState(COLUMNS)
    const [ width, setWidth ] = useState( 500 )
    const [ totalRecords, setTotalRecords ] = useState(0)
    const [ headerRowHeight, setHeaderRowHeight ] = useState(47)
    const [ rowHeight, setRowHeight ] = useState(40)
    const [ selectItems, setSelectItems] = useState( [] )
    const [ selectedRow, setSelectedRow] = useState( [] )   
    const [ selectedCompaniesAll, setSelectedCompaniesAll] = useState( false )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [sortField, setSortField] = useState(`representative_name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)

    useEffect(() => {
        console.log('list', list)
    }, [list])

    const handleFocus = () => {

    }
    const handleSearchCompany = (event) => {    
        /**event.target.value giving old value in setimeout */
        clearTimeout(timeInterval);
        setTimeInterval(setTimeout(() => {
            setList( [] );
            if(inputSearchCompany.current.querySelector("#search_company").value.length > 0) {
                setLoading( true ); 
                const getSearchData = async () =>  {
                    const {data} = await PatenTrackApi.searchRepresentative(inputSearchCompany.current.querySelector("#search_company").value)
                    setLoading( false );
                    console.log("data", data)
                    setList(data)
                    setTotalRecords(data.length)
                }
                getSearchData()
            } else {
                setLoading( false ); 
                PatenTrackApi.cancelSearchRepresentative()
            }
        }, WAIT_INTERVAL));  
    }

    const handleClickRow = useCallback(async(event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        
        const request = window.confirm('Are you sure?')

        if(request) {
            console.log(row.representative_id)
            const formData = new FormData();
            formData.append('company_ids', JSON.stringify(props.selections))
            formData.append('representative_id', row.representative_id)
            const {data} = await PatenTrackApi.updateCompaniesRequest(formData)
            console.log(data)
            props.modal(false)
            props.unSelect([])
        }
    }, [   ])

    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault() 
    }, [  ])


    return (
        <React.Fragment>
            
            <form noValidate autoComplete="off" className={classes.form} onSubmit={e => { e.preventDefault(); }}>
                <TextField id="search_company" name="search_company" ref={inputSearchCompany}  onFocus={handleFocus} label="Search Representative" onChange={handleSearchCompany}/>             
            </form>   
            <Box style={{marginTop: 10, height: '100%'}}>
            {
                loading ?
                    <Loader/>
                :
                    <VirtualizedTable
                        classes={classes}
                        selected={selectItems}
                        rowSelected={selectedRow}
                        selectedIndex={currentSelection}
                        selectedKey={'representative_id'}    
                        rows={list}
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
            </Box>
        </React.Fragment>
    )
}



export default SearchRepresentativeName;