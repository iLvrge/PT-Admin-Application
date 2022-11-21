import React, {useCallback, useState, useEffect, useRef, forwardRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Grid, TextField, Modal, Box,  Paper, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, TableSortLabel, TablePagination, Checkbox, IconButton}  from '@material-ui/core'
import { useTheme } from "@material-ui/styles";


import useStyles from "./styles"
import PatenTrackApi from "../../../api/patenTrack"
import { getCitedAssigneesList, setCitedAssigneeImagesRetreived } from '../../../actions/patenTrackActions'
import { Refresh } from '@material-ui/icons';


const CitedPatent = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const googleLoginRef = useRef(null)
    const assigneeRef = useRef(null)
    const logoRef = useRef(null)
    const theme = useTheme();
    const [citedAssigneeList, setCitedAssigneeList] = useState([])
    const [selectAssigneeRow, setSelectAssigneeRow] = useState([])
    const [selectAssigneeItems, setSelectAssigneeItems] = useState([])
    const [selectAll, setSelectAll] = useState(false)
    const [sortBy, setSortBy] = useState('occurences')
    const [sortDirection, setSortDirection] = useState('desc')
    const [selectedRows, setSelectedRows] = useState({})
    const [assigneeName, setAssigneeName] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [open, setOpen] = useState(false)
    const [type, setType] = useState(0)
    const [records, setRecords] = useState(0)
    const [currentPage, setCurrentPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const citedAssignees =  useSelector( state => state.patenTrack.cited_patents.citedAssignees)
    const totalRecords =  useSelector( state => state.patenTrack.cited_patents.totalRecords)
    const clientID =  useSelector( state => state.patenTrack.clientID)
    const portfolioList =  useSelector( state => state.patenTrack.portfolioList)
    const image_retrieved_cited_assignee_id =  useSelector( state => state.patenTrack.image_retrieved_cited_assignee_id)

    useEffect(() => {
        setCitedAssigneeList(citedAssignees)
        setSelectAssigneeItems([])
    }, [citedAssignees]) 

    useEffect(() => {
        setRecords(totalRecords)
    }, [totalRecords])

    useEffect(() => {
        if(image_retrieved_cited_assignee_id > 0) {
            const getCitedAssigneeData = async () => {
                const { data } = await PatenTrackApi.getCitedAssigneeData(clientID, portfolioList, image_retrieved_cited_assignee_id)

                if(data != null && data.length > 0) {
                    const oldItems = [...citedAssigneeList]
                    const findIndex = oldItems.findIndex(item => item.assignee_id == data[0].assignee_id)
                    if(findIndex !== -1) {
                        oldItems[findIndex] = {...data[0]}
                        setCitedAssigneeList(oldItems)
                        setCitedAssigneeImagesRetreived(0)
                    }
                }
            } 
            getCitedAssigneeData()
        }
    }, [image_retrieved_cited_assignee_id])

    const columns = React.useMemo(() => [
        {
            width: 200,  
            minWidth: 200,
            Header: 'Assignee Name',
            accessor: 'assignee_organization',
        },
        {
            width: 100,  
            minWidth: 100,
            Header: 'Occurences',
            accessor: 'occurences',
        },
        {
            width: 200,  
            minWidth: 200,
            Header: 'Assignee Query',
            accessor: 'assignee_query',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo0',
            accessor: 'api_logo',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo1',
            accessor: 'api_logo1',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo2',
            accessor: 'api_logo2',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo3',
            accessor: 'api_logo3',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo4',
            accessor: 'api_logo4',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo5',
            accessor: 'api_logo5',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo6',
            accessor: 'api_logo6',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo7',
            accessor: 'api_logo7',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo8',
            accessor: 'api_logo8',
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            Header: 'Logo9',
            accessor: 'api_logo9',
        },
        {
            width: 100,  
            minWidth: 100,
            Header: 'Image from URL',
            accessor: 'image_url',
        }
    ], [])

    const items =  React.useMemo(() => {
        return citedAssigneeList
    }, [citedAssigneeList])

    const ShowImage = (props) =>  {
        return (
            <img src={props.src} width='100px'/>
        )
    }

    const handleClose = () => {
        setOpen(false)
    }

    const getOriginalAssignee = async(event) => {
        const formData = new FormData()
        formData.append('assignee_id', selectAssigneeRow[0])
        let list = [...citedAssigneeList]
        const findIndex = list.findIndex( item => item.assignee_id === selectAssigneeRow[0])
        if(findIndex !== -1) {
            list[findIndex].assignee_query =  list[findIndex].assignee_organization
            setCitedAssigneeList(list)
            formData.append('assignee_query', list[findIndex].assignee_organization)
            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
            if( data ) {
                const form = new FormData()
                form.append('client_id', clientID)
                form.append('api_name', 'rapidapi')
                form.append('assignees', JSON.stringify([selectAssigneeRow[0]]))
                form.append('type', 4)
                const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeLogo(form)
                if( data ) {
                    setSelectAssigneeRow([]) 
                }  
                setOpen(false)     
            }
        } 
    }

    const updateDataName = async(event) => {
        const formData = new FormData()
        formData.append('assignee_id', selectAssigneeRow[0])
        const newLogoData = logoRef.current.value
        if(newLogoData == '') {
            const newAssigneeName = assigneeRef.current.value
            formData.append('assignee_query', newAssigneeName)
            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
            if( data ) {
                let list = [...citedAssigneeList]
                const findIndex = list.findIndex( item => item.assignee_id === selectAssigneeRow[0])
                if(findIndex !== -1) {
                    list[findIndex].assignee_query =  newAssigneeName
                    setCitedAssigneeList(list)
                    setType(0)
                    setOpen(false)
                }
                const form = new FormData()
                form.append('client_id', clientID)
                form.append('api_name', 'rapidapi')
                form.append('assignees', JSON.stringify([selectAssigneeRow[0]]))
                form.append('type', 4)
                const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeLogo(form)
                if( data ) {
                    setSelectAssigneeRow([])
                }                            
            }
        } else {
            formData.append('image_url', newLogoData)
            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
            if( data ) {               
                let list = [...citedAssigneeList]
                const findIndex = list.findIndex( item => item.assignee_id === selectAssigneeRow[0])
                if(findIndex !== -1) {
                    list[findIndex].image_url =  newLogoData
                    setLogoUrl('')
                    setCitedAssigneeList(list)
                    setSelectAssigneeRow([])
                    setType(0)
                    setOpen(false)
                }
            }
        }        
    }

    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked)
        if(e.target.checked === false) {
            setSelectAssigneeItems([])
        } else {
            const items = []
            const promises = citedAssigneeList.map(item => items.push(item.assignee_id))
            Promise.all(promises)
            setSelectAssigneeItems(items)
        }
    }

    const handleRowClick = async(event, row, rowIndex) => {        
        event.preventDefault()
        const {checked} = event.target
        console.log('handleRowClick', checked)
        if (checked !== undefined) {
            let tap = false, cntrlKey = event.ctrlKey ? event.ctrlKey : false, previousIndex = -1, oldSelection = [...selectAssigneeItems]; 
            if(!oldSelection.includes(row.assignee_id)) {
                const oldItems =   [...citedAssigneeList]  
                
                if (cntrlKey && oldSelection.length > 0) {
                    previousIndex = oldItems.findIndex(item => item.assignee_id == oldSelection[oldSelection.length - 1]);
                }
                if(previousIndex >= 0) {
                    if(previousIndex > rowIndex) {
                        oldItems.forEach((r, index) => {
                            if(index >= rowIndex && index <= previousIndex) {
                                if(oldSelection.indexOf(r.assignee_id) == -1) {
                                    oldSelection.push(r.assignee_id);
                                }
                            }
                        });
                    } else {
                        oldItems.forEach((r, index) => {
                            if(index >= previousIndex && index <= rowIndex) {
                                if(oldSelection.indexOf(r.assignee_id) == -1) {
                                    oldSelection.push(r.assignee_id);
                                }
                            }
                        });
                    }
                } else {
                    if(oldSelection.indexOf(row.assignee_id) == -1) {
                        oldSelection.push(row.assignee_id)
                    }
                }
                tap = true;
            } else {
                oldSelection = oldSelection.filter( item => item !== row.assignee_id)
            }
            setSelectAssigneeItems(oldSelection)
            setSelectAll(oldSelection.length === records ? true : false)
        } else {
            if(typeof event.target.closest == 'function') {
                const element = event.target.closest('td')
                if(element != null) {
                    let index = element.getAttribute('colindex')
                    if ( index == 1) {
                        /**
                         * Open in new tab with google search url
                         */
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(row.assignee_organization)}`)
                    } else if( index == 3 ) {
                        setAssigneeName(row.assignee_query)
                        setSelectAssigneeRow([row.assignee_id])
                        setType(0)
                        setOpen(true)
                    } else if( index >= 4 && index <= 14) {
                        let api_logo = ''
                        if(index == 4) {
                            api_logo = row.api_logo
                        } else if(index == 5) {
                            api_logo = row.api_logo1
                        } else if(index == 6) {
                            api_logo = row.api_logo2
                        } else if(index == 7) {
                            api_logo = row.api_logo3
                        } else if(index == 8) {
                            api_logo = row.api_logo4
                        } else if(index == 9) {
                            api_logo = row.api_logo5
                        } else if(index == 10) {
                            api_logo = row.api_logo6
                        } else if(index == 11) {
                            api_logo = row.api_logo7
                        } else if(index == 12) {
                            api_logo = row.api_logo8
                        } else if(index == 13) {
                            api_logo = row.api_logo9
                        } else if(index == 14) {
                            api_logo = row.image_url
                        }

                        let oldItems = [...citedAssigneeList]
                        const findIndex = oldItems.findIndex(item => item.assignee_id == row.assignee_id);
                        if(findIndex !== -1) {
                            oldItems.splice(findIndex, 1)
                            //setCitedAssigneeList(oldItems) (don't update data remove row physically otherwise there will be jump)
                            const findRow = document.querySelector(`tr[rowindex='${row.assignee_id}']`)
                            if(findRow !== null) {
                                //findRow.remove() (Don't use remove because react create Virtual Dom and application will when component refresh or state change)
                                findRow.style.display = 'none'
                            }
                            const formData = new FormData()
                            formData.append('assignee_id', row.assignee_id)
                            formData.append('api_logo', api_logo)
                            formData.append('api_logo1', '')
                            formData.append('api_logo2', '')
                            formData.append('api_logo3', '')
                            formData.append('api_logo4', '')
                            formData.append('api_logo5', '')
                            formData.append('api_logo6', '')
                            formData.append('api_logo7', '')
                            formData.append('api_logo8', '')
                            formData.append('api_logo9', '')
                            formData.append('without_square', '')
                            formData.append('image_url', '')
                            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
                            if( data ) {
                                await save([row.assignee_id])
                            } 
                        }                        
                    }
                }
            }
        }
    }

    const retrievedCitedPatentAssignee = async() => {
        const { data } = await PatenTrackApi.retrieveCitePatents(clientID, portfolioList)
        console.log('retrievedCitedPatentAssignee', data)
    }

    const retrievedCitedPatentAssigneeLogo = async(apiName) => {
        const form = new FormData()
        form.append('client_id', clientID)
        form.append('api_name', apiName)
        form.append('assignees', JSON.stringify(selectAssigneeItems))
        const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeLogo(form)
        console.log('retrievedCitedPatentAssignee', data)
    } 

    const retrievedCitedPatentAssigneeDomain = async(apiName) => {
        const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeDomain(clientID, apiName, JSON.stringify(selectAssigneeItems))
        console.log('retrievedCitedPatentAssignee', data)
    }

    const clearAssigneesLogos = async() => {
        if(selectAssigneeItems.length > 0) {
            const form = new FormData()
                form.append('assignee_id', JSON.stringify(selectAssigneeItems))
                form.append('type', 'clear')
                const {data} = await PatenTrackApi.updateAssigneesLogos(form)
                if(data != null) {
                    let list = [...citedAssigneeList]
                    const promise = selectAssigneeItems.map(index => {
                        const findIndex = list.findIndex( item => item.assignee_id === index)
                        if(findIndex !== -1) {
                            list[findIndex].api_logo =  ''
                            list[findIndex].api_logo1 =  ''
                            list[findIndex].api_logo2 =  ''
                            list[findIndex].api_logo3 =  ''
                            list[findIndex].api_logo4 =  ''
                            list[findIndex].api_logo5 =  ''
                            list[findIndex].api_logo6 =  ''
                            list[findIndex].api_logo7 =  ''
                            list[findIndex].api_logo8 =  ''
                            list[findIndex].api_logo9 =  ''
                        }
                    })
                    await Promise.all(promise)                     
                }
                console.log('clearAssigneesLogos=>data', data)
        } else {
            alert("Please select the assignees")
        }
    }

    const saveAllLogos = async() => {
        if(selectAssigneeItems.length > 0) {
            await save(selectAssigneeItems)
        } else {
            alert("Please select the assignees")
        }
    }

    const save = async(items) => {
        const form = new FormData()
            form.append('assignee_id', JSON.stringify(items))
            form.append('type', 'download')
            const {data} = await PatenTrackApi.updateAssigneesLogos(form)
            console.log('saveAllLogos=>data', data)
    }

    const isSelected = useCallback((ID) => {
        return selectAssigneeItems.includes(ID)
    }, [selectAssigneeItems])

    
    const handleSortColumn = useCallback(async(sortingBy, sortingDirection) => {
        console.log("sortingBy, sortingDirection", sortingBy, sortingDirection) 
        setSortDirection(sortingDirection)
        setSortBy(sortingBy)
        setCitedAssigneeList([])
        setCurrentPage(0)
        dispatch(getCitedAssigneesList(clientID, portfolioList, sortingBy, sortingDirection, rowsPerPage, 0)) 
    }, [dispatch, clientID, portfolioList, rowsPerPage])

    const handleChangeRowsPerPage =  useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value));
        setCurrentPage(0);
        setCitedAssigneeList([])
        dispatch(getCitedAssigneesList(clientID, portfolioList, sortBy, sortDirection, event.target.value, 0)) 
    }, [dispatch, clientID, portfolioList, sortBy, sortDirection])

    const handleChangePage =  useCallback((event, newPage) => {
        console.log('handleChangePage', event, event.target, newPage)
        setCurrentPage(newPage);
        setCitedAssigneeList([])
        dispatch(getCitedAssigneesList(clientID, portfolioList, sortBy, sortDirection, rowsPerPage, newPage)) 
    }, [dispatch, clientID, portfolioList, sortBy, sortDirection, rowsPerPage])

    const refreshTable = () => {
        setCitedAssigneeList([])
        dispatch(getCitedAssigneesList(clientID, portfolioList, sortBy, sortDirection, rowsPerPage, currentPage)) 
    }

    return (
        <Grid
            container
            className={classes.container}
            spacing={2}
        >
            <Grid
                item lg={12} md={12} sm={12} xs={12}  
                className={classes.flexColumn}
            >
                <Paper style={{ width: '100%', overflow: 'hidden' }}>
                    <Box style={{ flexShrink: 0, marginLeft: 2.5 }}>
                        {/* <IconButton
                            onClick={() => setCurrentPage(0)} 
                            disabled={currentPage === 0}
                            aria-label="first page"
                        >
                            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                        </IconButton>
                        <IconButton
                            onClick={() => setCurrentPage(currentPage - 1)} 
                            disabled={currentPage === 0}
                            aria-label="previous page"
                        >
                            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                        </IconButton>
                        <IconButton
                            onClick={() => setCurrentPage(currentPage + 1)} 
                            disabled={currentPage >= Math.ceil(records / rowsPerPage) - 1}
                            aria-label="next page"
                        >
                            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                        </IconButton>
                        <IconButton
                            onClick={() => setCurrentPage(Math.ceil(records / rowsPerPage) - 1)} 
                            disabled={currentPage >= Math.ceil(records / rowsPerPage) - 1}
                            aria-label="last page"
                        >
                            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                        </IconButton>
                        <span>
                        | Go to page:{' '}
                            <input
                                type="number"
                                defaultValue={currentPage}
                                onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                    setCurrentPage(page)
                                }}
                                style={{ width: '100px' }}
                            />
                        </span>{' '}
                        <select
                        value={rowsPerPage}
                        onChange={e => {
                            setRowsPerPage(Number(e.target.value))
                        }}
                        >
                        {[100, 200, 300, 400, 500].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                            </option>
                        ))}
                        </select> */}
                        <TablePagination
                            rowsPerPageOptions={[50, 100, 150, 200]}
                            colSpan={3}
                            count={records}
                            rowsPerPage={rowsPerPage}
                            page={currentPage}
                            SelectProps={{
                                inputProps: {
                                'aria-label': 'rows per page',
                                },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                        <Button onClick={retrievedCitedPatentAssignee}>Retreive Citing Assignees</Button>
                        <Button onClick={(event) => retrievedCitedPatentAssigneeLogo('rapidapi')}>Retreive Logo(RapidApi)</Button>
                        <IconButton onClick={(event) => refreshTable()}>
                            <Refresh/>
                        </IconButton>
                        {/* <Button onClick={clearAssigneesLogos}>Clear Selected</Button>
                        <Button onClick={saveAllLogos}>Save</Button> */}
                    </Box> 
                    <TableContainer style={{ minHeight: '75vh', maxHeight:  '75vh' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell 
                                        style={{ 
                                            minWidth: 20, 
                                            width: 20,
                                            textAlign: 'left' ,
                                            maxHeight: 50
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectAll}
                                            onClick={(e) => handleSelectAll(e)}
                                        />
                                    </TableCell>
                                    {
                                        columns.map( (column, index) => (
                                            <TableCell
                                                key={index}
                                                style={{ 
                                                    minWidth: column.minWidth, 
                                                    width: column.width,
                                                    textAlign: 'left' ,
                                                    maxHeight: 50
                                                }}
                                                onClick={() => handleSortColumn(column.accessor, sortBy === column.accessor ? sortDirection === 'asc' ? 'desc' : 'asc': 'asc')}
                                                sortDirection={sortBy === column.accessor ? sortDirection !== '' ? sortDirection : 'asc' : false}
                                            >
                                                
                                                <TableSortLabel
                                                    active={sortBy === column.accessor ? true : false}
                                                    {...( sortBy === column.accessor ? { direction: sortDirection == 'desc'
                                                        ? 'desc'
                                                        : 'asc'} : {})}
                                                >
                                                    {column.Header}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))
                                    }
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    items.length === 0 ?
                                    <TableRow>
                                        <TableCell colspan={13}>Loading.....</TableCell>
                                    </TableRow>
                                    :
                                    items.map( (item, index) => (
                                        <TableRow 
                                            rowindex={item.assignee_id} 
                                            key={index}
                                            onClick={(e) => handleRowClick(e, item, index)}
                                        >
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 20, 
                                                    width: 20,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={0}
                                            >
                                                <Checkbox
                                                    checked={isSelected(item.assignee_id)}
                                                />
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 200, 
                                                    width: 200,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={1}
                                            >
                                                {item.assignee_organization}
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 50, 
                                                    width: 50,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={2}
                                            >
                                                {item.occurences}
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 200, 
                                                    width: 200,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={3}
                                            >
                                                {item.assignee_query}
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={4}
                                            >
                                                <ShowImage src={item.api_logo}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={5}
                                            >
                                                <ShowImage src={item.api_logo1}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={6}
                                            >
                                                <ShowImage src={item.api_logo2}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={7}
                                            >
                                                <ShowImage src={item.api_logo3}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={8}
                                            >
                                                <ShowImage src={item.api_logo4}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={9}
                                            >
                                                <ShowImage src={item.api_logo5}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={10}
                                            >
                                                <ShowImage src={item.api_logo6}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={11}
                                            >
                                                <ShowImage src={item.api_logo7}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={12}
                                            >
                                                <ShowImage src={item.api_logo8}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={13}
                                            >
                                                <ShowImage src={item.api_logo9}/>
                                            </TableCell>
                                            <TableCell 
                                                style={{ 
                                                    minWidth: 100, 
                                                    width: 100,
                                                    textAlign: 'left' ,
                                                    maxHeight: 100
                                                }}
                                                colindex={14}
                                            >
                                                <ShowImage src={item.image_url}/>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                  
                <Modal
                    open={open}
                    onClose={handleClose}
                >
                    <Box className={classes.box}>
                        <TextField
                            defaultValue={ assigneeName}
                            inputRef={assigneeRef}
                        />
                        <Button onClick={updateDataName} variant="contained">Update</Button>
                        <Button onClick={getOriginalAssignee} variant="contained">Find Org. Assignee</Button>
                        <TextField
                            defaultValue={ logoUrl }
                            inputRef={logoRef}
                            label={`Image Url`}
                            size="small"
                            style={{width: 300, float: 'right'}}
                        />
                    </Box>
                </Modal>
            </Grid>            
        </Grid>
    )
}

export default CitedPatent