import React, {useCallback, useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Grid, TextField, Modal, Box }  from '@material-ui/core'
import VirtualizedTable from '../VirtualizedTable'

import useStyles from "./styles"
import Googlelogin from '../Googlelogin'
import { getTokenStorage } from '../../../utils/tokenStorage'
import PatenTrackApi from "../../../api/patenTrack"
import { setTreeOpen, setTableScrollPos } from '../../../actions/patenTrackActions'


const CitedPatent = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const googleLoginRef = useRef(null)
    const [assigneeName, setAssigneeName] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [domainName, setDomainName] = useState('')
    const [domainName2, setDomainName2] = useState('')
    const [domainName3, setDomainName3] = useState('')
    const [apiLogo, setAPILogo] = useState('')
    const [apiLogo1, setAPILogo1] = useState('')
    const [apiLogo2, setAPILogo2] = useState('')
    const [apiLogo3, setAPILogo3] = useState('')
    const [open, setOpen] = useState(false)
    const [type, setType] = useState(0)
    const [organisationList, setOrganisationList] = useState([])
    const [citedAssigneeList, setCitedAssigneeList] = useState([])
    const [ width, setWidth ] = useState( 1800 )
    const [ rowHeight, setRowHeight ] = useState(108)
    const [ headerHeight, setHeaderHeight ] = useState(40)
    const ORGANISATION_COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'organisation_id',
            role: 'radio',
            disableSort: true
        },
        {
            width: 171,  
            minWidth: 171,
            label: 'Companies',
            dataKey: 'organisation_name',
        }
    ]

    const ASSIGNEES_COLUMNS = [
        {
            width: 29,
            minWidth: 29,
            label: '',
            dataKey: 'assignee_id',
            role: 'checkbox',
            disableSort: true
        },
        {
            width: 200,  
            minWidth: 200,
            label: 'Assignee Name',
            dataKey: 'assignee_organization',
        },
        {
            width: 80,  
            minWidth: 80,
            label: 'Occurences',
            dataKey: 'occurences',
        },
        {
            width: 200,  
            minWidth: 200,
            label: 'Assignee Query',
            dataKey: 'assignee_query',
        },
        /* {
            width: 100,  
            minWidth: 100,
            label: 'Domain',
            dataKey: 'domain',
        },
        {
            width: 100,  
            minWidth: 100,
            label: 'Domain2',
            dataKey: 'domain2',
        },
        {
            width: 100,  
            minWidth: 100,
            label: 'Domain3',
            dataKey: 'domain3',
        }, */
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo0',
            dataKey: 'img',
            imageURL: 'api_logo'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo1',
            dataKey: 'img',
            imageURL: 'api_logo1'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo2',
            dataKey: 'img',
            imageURL: 'api_logo2'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo3',
            dataKey: 'img',
            imageURL: 'api_logo3'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo4',
            dataKey: 'img',
            imageURL: 'api_logo4'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo5',
            dataKey: 'img',
            imageURL: 'api_logo5'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo6',
            dataKey: 'img',
            imageURL: 'api_logo6'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo7',
            dataKey: 'img',
            imageURL: 'api_logo7'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo8',
            dataKey: 'img',
            imageURL: 'api_logo8'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Logo9',
            dataKey: 'img',
            imageURL: 'api_logo9'
        },
        {
            width: 100,  
            minWidth: 100,
            role: 'image',
            label: 'Image from URL',
            dataKey: 'img',
            imageURL: 'image_url'
        }
    ]

    const [headerOrganizationColumns, setHeaderOrganizationColumns] = useState(ORGANISATION_COLUMNS)
    const [headerAssigneesColumns, setHeaderAssigneesColumns] = useState(ASSIGNEES_COLUMNS)
    const [selectOrganisationRow, setSelectOrganisationRow] = useState([])
    const [selectOrganisationItems, setSelectOrganisationItems] = useState([])
    const [selectAssigneeRow, setSelectAssigneeRow] = useState([])
    const [selectAssigneeItems, setSelectAssigneeItems] = useState([])
    const [selectedAllAssignee, setSelectAllAssignee] = useState(false)
    const [selectedAllOrganisation, setSelectAllOrganisation] = useState(false)
    const google_profile = useSelector(state => state.patenTrack.google_profile)
    const organizations =  useSelector( state => state.patenTrack.cited_patents.organizations )
    const citedAssignees =  useSelector( state => state.patenTrack.cited_patents.citedAssignees)
    const clientID =  useSelector( state => state.patenTrack.clientID)
    const portfolioList =  useSelector( state => state.patenTrack.portfolioList)
    const tableScrollPosition = useSelector( state => state.patenTrack.tableScrollPosition);

    useEffect(() => {
        setOrganisationList(organizations)
    }, [organizations])

    useEffect(() => {
        setCitedAssigneeList(citedAssignees)
        setSelectAssigneeItems([])
    }, [citedAssignees]) 

    const handleClickOrganisationRow = async(event, row) => {
        event.preventDefault()
        setSelectOrganisationItems([row.organisation_id])
        if(selectAssigneeItems.length > 0) {
            const form = new FormData();
            form.append('organisation_id', row.organisation_id)
            form.append('assignee_id', JSON.stringify(selectAssigneeItems))
            const { data } = await PatenTrackApi.updateCitedAssignee(clientID, form)
            console.log('handleClickOrganisationRow=>data', data)
            setSelectAssigneeItems([])
        }
    }

    const handleClickAssigneeRow = async(event, row, rowIndex ) => {
        /* event.preventDefault() */
        event.stopPropagation();  
        const {checked} = event.target

        if (checked !== undefined) {
            let tap = false, cntrlKey = event.ctrlKey ? event.ctrlKey : false, previousIndex = -1, oldSelection = [...selectAssigneeItems];
            if(event.target.checked) {
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
            if(selectOrganisationItems.length > 0) {
                const form = new FormData();
                form.append('organisation_id', selectOrganisationItems[0])
                form.append('assignee_id', JSON.stringify([row.assignee_id]))
                if( tap === true ) {
                    const { data } = await PatenTrackApi.updateCitedAssignee(clientID, form)
                    console.log('handleClickAssigneeRow=>updateCitedAssignee=>data', data)
                } else {
                    const { data } = await PatenTrackApi.deleteCitedAssignee(clientID, form)
                    console.log('handleClickAssigneeRow=>deleteCitedAssignee=>data', data)
                }
            }
        } else {
            if(typeof event.target.closest == 'function') {
                const element = event.target.closest('div.ReactVirtualized__Table__rowColumn')
                if(element != null) {
                    let index = element.getAttribute('aria-colindex')
                    if( index == 4 ) {
                        setAssigneeName(row.assignee_query)
                        setSelectAssigneeRow([row.assignee_id])
                        setType(0)
                        setOpen(true)
                    } else if( index >= 5 && index <= 15) {
                        let api_logo = ''
                        if(index == 5) {
                            api_logo = row.api_logo
                        } else if(index == 6) {
                            api_logo = row.api_logo1
                        } else if(index == 7) {
                            api_logo = row.api_logo2
                        } else if(index == 8) {
                            api_logo = row.api_logo3
                        } else if(index == 9) {
                            api_logo = row.api_logo4
                        } else if(index == 10) {
                            api_logo = row.api_logo5
                        } else if(index == 11) {
                            api_logo = row.api_logo6
                        } else if(index == 12) {
                            api_logo = row.api_logo7
                        } else if(index == 13) {
                            api_logo = row.api_logo8
                        } else if(index == 14) {
                            api_logo = row.api_logo9
                        } else if(index == 15) {
                            api_logo = row.image_url
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
                            /* let list = [...citedAssigneeList]
                            list[rowIndex].api_logo = api_logo
                            list[rowIndex].api_logo1 = ''
                            list[rowIndex].api_logo2 = ''
                            list[rowIndex].api_logo3 = ''
                            setCitedAssigneeList(list) */
                        } 
                    } else if ( index == 2) {
                        /**
                         * Open in new tab with google search url
                         */
                        window.open(`https://www.google.com/search?q=${encodeURIComponent(row.assignee_organization)}`)
                    }
                }
            }
        }  
    }

    const handleSelectAll = () => {
    }

    const handleSelectAllAssignee = () => {
    }

    const retrievedCitedPatentAssignee = async() => {
        const { data } = await PatenTrackApi.retrieveCitePatents(clientID)
        console.log('retrievedCitedPatentAssignee', data)
    }

    const retrievedCitedPatentAssigneeLogo = async(apiName) => {
        const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeLogo(clientID, apiName, JSON.stringify(selectAssigneeItems))
        console.log('retrievedCitedPatentAssignee', data)
    } 

    const retrievedCitedPatentAssigneeDomain = async(apiName) => {
        const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeDomain(clientID, apiName, JSON.stringify(selectAssigneeItems))
        console.log('retrievedCitedPatentAssignee', data)
    }

    const openGoogleWindow = useCallback(() => {
        if(googleLoginRef.current != null) {
          googleLoginRef.current.querySelector('button').click()
        } 
      }, [googleLoginRef])

    const addAssigneeToSpreadsheet = async() => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken === null || googleToken == '') {
            openGoogleWindow()
        } else {
            try{
                const tokenParse = JSON.parse(googleToken)
                const { access_token } = tokenParse
    
                if(access_token !== undefined) {
                    if(selectAssigneeItems.length > 0) {
                        const allAssigneeNames = []
                        selectAssigneeItems.forEach( item => {
                            const findIndex = citedAssigneeList.findIndex( assignee => assignee.assignee_id == item )
                            if(findIndex !== -1) {
                                allAssigneeNames.push(citedAssigneeList[findIndex].assignee_organization)
                            }
                        })
                        if(allAssigneeNames.length > 0) {
                            const form = new FormData()
                            form.append('assignee_organisation', JSON.stringify(allAssigneeNames))
                            form.append('token', access_token)
                            form.append('account', 'webmaster@ilvrge.com')
    
                            const {data} = await PatenTrackApi.addAssigneeOrganisationToSheet(clientID, form)
    
                            console.log('data=>addAssigneeToSpreadsheet', data)
    
                            setSelectAssigneeItems([])
                        }
                    }
                } else {
                    openGoogleWindow()
                }
            } catch (err) {
                openGoogleWindow()
            }            
        }
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

    const updateDataName = async(event) => {
        const formData = new FormData()
        formData.append('assignee_id', selectAssigneeRow[0])
        if(logoUrl == '') {
            formData.append('assignee_query', assigneeName)
            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
            if( data ) {
                let list = [...citedAssigneeList]
                const findIndex = list.findIndex( item => item.assignee_id === selectAssigneeRow[0])
                if(findIndex !== -1) {
                    list[findIndex].assignee_query =  assigneeName
                    setCitedAssigneeList(list)
                    setSelectAssigneeRow([])
                    setType(0)
                    setOpen(false)
                }
                const { data } = await PatenTrackApi.retrieveCitePatentsAssigneeLogo(clientID, 'rapidapi', JSON.stringify([selectAssigneeRow[0]]))
                if( data ) {
                    setSelectAssigneeRow([])
                }                            
            }
        } else {
            formData.append('image_url', logoUrl)
            const { data } = await PatenTrackApi.updateAssigneeQuery(formData)
            if( data ) {               
                let list = [...citedAssigneeList]
                const findIndex = list.findIndex( item => item.assignee_id === selectAssigneeRow[0])
                if(findIndex !== -1) {
                    list[findIndex].image_url =  logoUrl
                    setLogoUrl('')
                    setCitedAssigneeList(list)
                    setSelectAssigneeRow([])
                    setType(0)
                    setOpen(false)
                }
            }
        }        
    }

    const exportData = async() => {
        const googleToken = getTokenStorage( 'google_auth_token_info' )
        if(googleToken === null || googleToken == '') {
            openGoogleWindow()
        } else {
            try{
                const tokenParse = JSON.parse(googleToken)
                const { access_token } = tokenParse
    
                if(access_token !== undefined) {
                    const formData = new FormData()
                    formData.append('token', access_token)
                    formData.append('portfolioList', JSON.stringify(portfolioList))

                    const { data } = await PatenTrackApi.exportDatatoSpreadsheet(clientID, formData)
                    console.log("EXPORT DATA", data)
                } else {
                    openGoogleWindow()
                }
            } catch(err) {
                console.log(err)
            }
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const onScrollTable = (scrollPos) => {
        dispatch(setTableScrollPos(scrollPos))   
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
                style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}
            >
                <Button onClick={retrievedCitedPatentAssignee}>Retreive Citing Assignees</Button>
                {/* <Button onClick={(event) => retrievedCitedPatentAssigneeLogo('clearbit')}>Retreive Logo(Clearbit)</Button>
                <Button onClick={(event) => retrievedCitedPatentAssigneeLogo('uplead')}>Retreive Logo(Uplead)</Button>
                <Button onClick={(event) => retrievedCitedPatentAssigneeDomain('ritekit')}>Retreive Domain(Ritekit)</Button>
                <Button onClick={(event) => retrievedCitedPatentAssigneeLogo('ritekit')}>Retreive Logo(Ritekit)</Button> */}
                <Button onClick={(event) => retrievedCitedPatentAssigneeLogo('rapidapi')}>Retreive Logo(RapidApi)</Button>
                <Button onClick={clearAssigneesLogos}>Clear Selected</Button>
                <Button onClick={saveAllLogos}>Save</Button>
                <Button onClick={exportData}>Export</Button>
                {/* <Button onClick={addAssigneeToSpreadsheet}>Add Assignee to Spreadsheet</Button> */}
            </Grid>            
            {/* <Grid
                item lg={5} md={5} sm={5} xs={5} 
                className={classes.flexColumn}
                style={{height: '100%'}}
            >
                <VirtualizedTable
                    classes={classes}
                    selected={selectOrganisationItems}
                    selectedKey={'organisation_id'}
                    rowSelected={selectOrganisationRow}
                    rows={organisationList}
                    rowHeight={rowHeight}
                    headerHeight={rowHeight}
                    columns={headerOrganizationColumns}
                    onSelect={handleClickOrganisationRow}
                    onSelectAll={handleSelectAll}
                    defaultSelectAll={selectedAllOrganisation}
                    responsive={true}
                    width={width} 
                    containerStyle={{ 
                        width: '100%',
                        maxWidth: '100%'
                    }}
                    style={{
                        width: '100%'
                    }}
                /> 
            </Grid> */}
            <Grid
                item lg={12} md={12} sm={12} xs={12}  
                className={classes.flexColumn}
                style={{height: '90%', overflowX: 'auto'}}
            >
                <VirtualizedTable
                    classes={classes}
                    selected={selectAssigneeItems}
                    selectedKey={'assignee_id'}
                    rowSelected={selectAssigneeRow}
                    rows={citedAssigneeList}
                    rowHeight={rowHeight}
                    headerHeight={headerHeight}
                    columns={headerAssigneesColumns}
                    scrollTop={tableScrollPosition}
                    onScrollTable={onScrollTable} 
                    onSelect={handleClickAssigneeRow}
                    onSelectAll={handleSelectAllAssignee}
                    defaultSelectAll={selectedAllAssignee}
                    responsive={false}
                    width={width} 
                    containerStyle={{ 
                        width: '100%',
                        maxWidth: '100%'
                    }}
                    style={{
                        width: '100%'
                    }}
                /> 
            </Grid>
            <span ref={googleLoginRef}>
                <Googlelogin/>
            </span>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box className={classes.box}>
                    <TextField
                        value={ assigneeName}
                        onChange={(event) => setAssigneeName(event.target.value)}
                    />
                    <Button onClick={updateDataName} variant="contained">Update</Button>
                    <TextField
                        value={ logoUrl }
                        onChange={(event) => setLogoUrl(event.target.value)}
                        label={`Image Url`}
                        size="small"
                        style={{width: 300, float: 'right'}}
                    />
                </Box>
            </Modal>
        </Grid>
    )
}

export default CitedPatent