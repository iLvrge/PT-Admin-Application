import React, {useEffect, useState, useCallback} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Modal, Paper, Typography } from '@mui/material';
import Loader from '../Loader';
import VirtualizedTable from '../VirtualizedTable'; 
import PatenTrackApi from '../../../api/patenTrack';
import useStyles from './styles' 
import SearchRepresentativeName from './SearchRepresentativeName';

const NewCompaniesRequest = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const COLUMNS = [
        {
            width: 35,
            minWidth: 35,
            label: '',
            dataKey: 'company_id',
            role: 'checkbox', 
            disableSort: true,
            show_selection_count: true,
        },
        {
            width: 300,
            minWidth: 300,
            label: 'Name',
            dataKey: 'name',
        },
        {
            width: 80,
            minWidth: 80,
            label: 'Request Date',
            dataKey: 'date',
        },
        {
            width: 200,
            minWidth: 200,
            label: 'Account Name',
            dataKey: 'organisation_name',
        },
        {
            width: 300,
            minWidth: 300,
            label: 'Status',
            dataKey: 'representative_name',
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
    const [ loading, setLoading] = useState( false )   
    const [ currentSelection, setCurrentSelection ] = useState(null)   
    const [sortField, setSortField] = useState(`name`)
    const [sortOrder, setSortOrder] = useState(`ASC`)
    const [ companiesList, setCompaniesList ] = useState([])
    const [accountId, setAccountId] = useState(0) 
    const [openModal, setOpenModal] = useState(false);
    const new_companies_request = useSelector( state => state.patenTrack.new_companies_request)

    useEffect(() => {
        const loadNewCompanyRequest = async() => {
            setLoading(true)
            setCompaniesList(new_companies_request)
            setLoading(false)
        }
        loadNewCompanyRequest()
    }, [new_companies_request])

    const handleClickRow = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
        let olditems = [...selectItems]

        if(olditems.includes(row.company_id)) {
            olditems = olditems.filter( item => item != row.company_id)
        } else {
            olditems.push(row.company_id)
        }
        
        setSelectItems(olditems)
        
    }, [ dispatch  ])

    const handleSelectAll = useCallback((event, row) => {
        event.preventDefault()
        const { checked } = event.target;
    }, [ dispatch ])

    const onHandleUpdate = () => {
        console.log("Click update")
        setOpenModal(true)
    }

    const handleCloseModal = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        setOpenModal(false)
    };

    

    return (
        <Paper className={classes.root} square id={`request_companies`}>
            <Typography style={{paddingLeft: 10}}>
                Select a company and associate it with a representative name <Button className={classes.button} onClick={onHandleUpdate} disabled={selectItems.length === 0}>here.</Button>
            </Typography>
            {
                loading ?
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
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="Search Lawfirm Address"
                aria-describedby=""
            >
                <Box style={{
                    width: 500,
                    margin: '50px auto',
                    background: '#424242',
                    height: 500,
                    padding: 20,
                }}>
                    <SearchRepresentativeName  selections={selectItems} modal={setOpenModal} unSelect={setSelectItems}/>
                </Box>
            </Modal> 
        </Paper> 
    )
}


export default NewCompaniesRequest;