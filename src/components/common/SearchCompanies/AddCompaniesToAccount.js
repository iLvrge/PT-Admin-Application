import React, {useEffect, useState} from 'react'
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select } from '@material-ui/core';
import PatenTrackApi from '../../../api/patenTrack';
import { useDispatch, useSelector } from 'react-redux';
import { setAddCompanyToAccountModal, setAddCompanyToAccountType, setAddCompanyToAccountGroup, setAddCompanyToAccountRepresentatives } from '../../../actions/patenTrackActions'; 
import useStyles from "./styles";



const AddCompaniesToAccount = () => {
    const classes = useStyles();
    const dispatch = useDispatch()
    const [account, setAccount] = useState(''); 

    const openAccountModal = useSelector( state => state.patenTrack.openAddAccountModal)
    const accountList = useSelector( state => state.patenTrack.clientsData)
    const type = useSelector( state => state.patenTrack.addCompanyToAccountType)
    const group = useSelector( state => state.patenTrack.addCompanyToAccountGroup)
    const representatives = useSelector( state => state.patenTrack.addCompanyToAccountRepresentatives)

    const onHandleSelectAccount = async(event) => {
        setAccount(parseInt(event.target.value))    
    }

    const onHandleCloseAccount = () => {
        dispatch(
            setAddCompanyToAccountModal(false)
        )
        dispatch(
            setAddCompanyToAccountType(0)
        )
        dispatch(
            setAddCompanyToAccountGroup('')
        )
        dispatch(
            setAddCompanyToAccountRepresentatives([])
        )
    }

    const onHandleSaveAddbulkCompanies = async () => {
        console.log(type, representatives, group)
        const form = new FormData()
        form.append("client_id", account)
        form.append("type", type)
        form.append("group", group)
        form.append("representatives", JSON.stringify(representatives))
        const { data } = await PatenTrackApi.addBulkCompaniesToAccount(account, form)
        setAccount('') 
    }  

    return (
        <React.Fragment>
            <Modal
                open={openAccountModal}
                onClose={onHandleCloseAccount}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={{
                width: 500,
                margin: '50px auto',
                background: '#424242',
                height: 200,
                padding: 20,
                }}>
                    <FormControl fullWidth>
                        <InputLabel id="account-select-label">Select an Account</InputLabel>
                        <Select
                        labelId="account-select-label"
                        id="account-select"
                        value={account}
                        label="Select an Account"
                        onChange={onHandleSelectAccount}
                        className={classes.select}
                        >
                        {
                            accountList.map((row, index) => (
                            <MenuItem value={row.id} key={index}>{row.name}</MenuItem>
                            ))
                        }
                        
                        </Select>
                        <Button 
                            onClick={onHandleSaveAddbulkCompanies}
                            className={classes.btn}
                        >Save</Button>
                    </FormControl>
                </Box>
            </Modal>
        </React.Fragment>
    )
}


export default AddCompaniesToAccount;