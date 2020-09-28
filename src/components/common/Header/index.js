import React, { useState, useRef } from "react";
import { connect } from 'react-redux';

import {
  AppBar,
  Toolbar,
  IconButton,
  Button, Dialog, DialogActions, DialogContent, DialogTitle,  TextareaAutosize, TextField, Typography, Avatar
} from "@material-ui/core";

import 'font-awesome/css/font-awesome.min.css';

import useStyles from "./styles";

import { signOut } from "../../../actions/authActions";

import { getLawyers, getEntitiesList, getTransactionList, updateClientEntities, getUsers, createAccount, setFlag, postRecordItems, updateComment, setCurrentWidget, setSettingText, updateClientLogo, setEntitiesList, setTransactionList, setSearchCompanies, getClientAssetsList, setClientAssetsList, setUsers, setUploadTreeFile, setSearchBar, setSingleSearchBar, getTransactionEntities, setTreeHeight, setSearchHeight, getLawFirmList, setRetreiveCompanyAssetsHolding} from "../../../actions/patenTrackActions";


/*import Draggable from 'react-draggable';*/

const menuIcon = require('../../../assets/menu_icon.svg');



function Header(props) {
  const classes = useStyles();
  const [profileMenu, setProfileMenu] = useState(null);
  const lawyers = props.lawyers;
  const documents = props.documents;
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [openLogo, setOpenLogo] = useState(false);
  const [lawyer, setLawyer] = useState(0);
  const [document, setDocument] = useState(0);
  const [header, setHeader] = useState("Correct a Record");
  const [formId, setFormId] = useState(0);
  const [type, setType] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const ref = useRef(null);	
  const defaultValue = 0;

  
  const handleOpenLogoPopup = () => {
    if(props.clientID > 0) {
      setOpenLogo(true);
    } else {
      alert("Please select client first.");
    }
  }

  const handleLogoDialogClose = () => {
    setOpenLogo(false);
  };

  const handleCreateAccountPopup = () => {
    if(props.clientID > 0 && props.companyData && props.companyData.name != "") {
      setCompanyName(props.companyData.name);
    }
    setOpenAccount(true);
  }

  const handleAccountClose = () => {
    setCompanyName('');
    setOpenAccount(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    const optionElement = [...event.target.querySelectorAll("option")];
    const type = optionElement.filter(opt => opt.selected ? opt : null);
    if(type.length > 0) {
      if(type[0].getAttribute('type') === '1') {
        setType(1);
      }
    }
    setLawyer(event.target.value);
  };

  const handleChangeDocument = (event) => {
    setDocument(event.target.value);
  };

  const handleUpdateClientLogo = (form) => {
    let formData = new FormData(form); 
    props.updateClientLogo(formData, props.clientID);
    setOpenLogo(false);
  }
  
  let commentShow = "";
  

  /*const PaperComponent = (props) =>{
    return (
      <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
      </Draggable>
    );
  };*/

  const handleCreateAccount = ( form ) => {            
    let formData = new FormData(form); 
    if(props.clientID > 0){
      formData.append('organisation_id', props.clientID);
    }
    props.createAccount(formData, props.clientID);
    setOpenAccount( false );
  }

  const handleSubmit = ( form ) => {
    let formData = new FormData( form );
    let subject = '', subject_type = 6;
    if(formId === 1) {
      subject = (props.currentAsset !== "") ? props.currentAsset : props.selectedRFID;      
    }  
    subject_type = (props.currentAssetType !== "" && props.currentAssetType != 0) ? props.currentAssetType : 6;
    formData.append( 'subject', subject );
    formData.append( 'subject_type', subject_type );
    props.postRecordItems(formData, formId);
    setOpen( false );   
  };

  const resetAll = () => {
    props.setEntitiesList(1, []);
    props.setTransactionList({list:[], type: [], assignment_type: []});
    props.setSearchCompanies([]);
    props.setClientAssetsList([]);
    props.setUsers([]);
    props.setSearchHeight('100%');
    props.setTreeHeight('30%');
    props.setRetreiveCompanyAssetsHolding( false );
  }

  const handleEntitiesList = (t) => {
    resetAll();
    if(props.clientID > 0) {      
      props.setFlag(t == 1 ? 0 : t == 2 ? 1 : 2);
      props.getEntitiesList(props.clientID, props.portfolioList, t);            
    } else {
      alert("Please select client first.");
    }    
  } 

  const handleTransactionList = () => {
    resetAll();
    props.getTransactionList(props.clientID, props.portfolioList);
    
  }

  const handleUsersListing = () => {
    resetAll();
    if(props.clientID > 0) {
      props.getUsers(props.clientID);
    } else {
      alert("Please select client first.");
    } 
  }

  const handleUpdate = () => {
    if(props.clientID > 0) {
      props.updateClientEntities(props.clientID);
    } else {
      alert("Please select client first.");
    } 
  }

  const handleAssets = () => {
    resetAll()
    if(props.clientID > 0) {
      props.getClientAssetsList(props.clientID, props.portfolioList);
    } else {
      alert("Please select client first.");
    } 
  }

  const handleLawFirms = () => {
    resetAll();
    props.getLawFirmList(props.clientID, props.portfolioList);
  }

  const openUploadTreeFile = () => {
    props.setUploadTreeFile(!props.treeForm);
    props.setSearchBar(true);
    props.setSingleSearchBar(false);
    let searchHeight = '100%', treeHeight = '0%';
    if(!props.treeForm === true) {
      searchHeight = '70%';
      treeHeight = '30%';
    }
    props.setSearchHeight(searchHeight);
    props.setTreeHeight(treeHeight);
  }

  const handleEntitiesSecurity = (type) => {
    props.setSearchBar(false);
    props.setSingleSearchBar(true);
    if(props.treeForm === true) {
      props.setUploadTreeFile(!props.treeForm);
    }
    props.getTransactionEntities(type);
    props.setRetreiveCompanyAssetsHolding( type === 'borrowers' ? true : false );
  }

  return (
    
    <AppBar className={classes.appBar} position='relative' >
      
      <Toolbar className={classes.toolbar}>
        <div className={classes.logotype}>
          {
            <img src={props.siteLogo} className={classes.siteLogo} alt={''}/>
          }
        </div>
        <div className={classes.headerTitle}>
          {Object.keys(props.companyData).length > 0 ? <Avatar alt="" src={props.companyData.logo} className={classes.small}/> : ''}
          <div className={classes.headerTitleContent}>
            <Typography variant="h6">
              {Object.keys(props.companyData).length > 0 ? props.companyData.name : ''}          
            </Typography>
          </div> 
        </div>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {`${classes.headerMenuButton}`}
          onClick           = {openUploadTreeFile}
        > Tree
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {`${classes.headerMenuButton}`}
          onClick           = {() => {handleEntitiesSecurity('lenders')}}
        >  Lender
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {`${classes.headerMenuButton}`}
          onClick           = {() => {handleEntitiesSecurity('borrowers')}}
        >  Borrower
        </IconButton>
        <IconButton  
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleAssets()}}
        >  Assets
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleTransactionList()}}
        > Transactions
        </IconButton>  
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleEntitiesList(1)}}
        >  Inventors
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleEntitiesList(2)}}
        > Customers
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleEntitiesList(3)}}
        > Entities
        </IconButton>
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleLawFirms()}}
        > Law Firms
        </IconButton>  
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleUpdate()}}
        > Update
        </IconButton>        

        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleUsersListing()}}
        ><i className={"fad fa-users"} title="Listing Users"></i></IconButton> 
        
        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleOpenLogoPopup()}}
        ><i className={"fal fa-images"} title="Logo"></i></IconButton>

        <IconButton
          color             = "inherit"
          aria-haspopup     = "true"
          aria-controls     = "mail-menu"
          className         = {classes.headerMenuButton}
          onClick           = {() => {handleCreateAccountPopup()}}
        ><i className={"fad fa-building"} title="Create Account"></i></IconButton>
                
        {
          props.user.logo && (
            <div className={classes.logotype}>
              <img src={props.user.logo} className={classes.companyLogo} alt={''}/>
            </div>
          )
        }
        <IconButton
          aria-haspopup     = "true"
          color             = "inherit"
          className         = {classes.headerMenuButton}
          aria-controls     = "profile-menu"
          onMouseEnter           = {() => {
            setProfileMenu(!profileMenu)
          }}
          onMouseLeave           = {() => {
            setProfileMenu(false)
          }}
        >
          <img src={menuIcon} className={classes.headerMenuIcon} alt="header menu icon" />
          <div
            className = {classes.profileMenu}
            style = {{
              display: profileMenu ? 'initial' : 'none'
            }}
          >
            <div className={classes.profileMenuItem} onClick = {() => {
              props.setSettingText(props.settingText === "Settings" ? "Close Settings" : "Settings")
              props.setCurrentWidget('settings')
            }}>
            <span>
              {props.settingText}
            </span>
            </div>
            <div className={classes.profileMenuItem} onClick = {() => {props.signOut()}}>
            <span>
              Sign Out
            </span>
            </div>
          </div>
        </IconButton>
      </Toolbar>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="draggable-dialog-title"
        maxWidth={"sm"}
        fullWidth={true}
        className={"record-modal"}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {header}
        </DialogTitle>
        <DialogContent>          
          <div>
            <form ref={ref} className={classes.root} noValidate autoComplete="off">
            {
              formId === 0 && 
              <Typography variant="body1" className={"red"} align="left">
                { props.currentAsset !== ""
                  ? 
                  props.currentAsset 
                  : 
                  props.selectedRFID
                }
              </Typography>
            } 
            <div>              
              <div className={"MuiFormControl-root MuiTextField-root"}>
                <label className={"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"} >Select your professional to be assigned for this task:</label>
                <div className={"MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"}>
                  <select value={lawyer}  onChange={handleChange} name="professional_id" id="professional_id"  className={`${classes.customSelect} MuiSelect-root MuiSelect-select MuiInputBase-input MuiInput-input `}>   
                    <option value={defaultValue} disable={"true"}></option>           
                    {lawyers.map((option) => (
                      <option key={option.professional_id} type={option.type} value={option.professional_id}>{`${option.first_name} ${option.last_name}`}</option>
                    ))}
                  </select> 
                </div>
              </div>
              {
                formId === 2
                ?
                <div className={"MuiFormControl-root MuiTextField-root"}>
                  <label className={"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"} >Select the document to be used to record the assignment:</label>
                  <div className={"MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"}>
                    <select value={document}  onChange={handleChangeDocument} name="document_id" id="document_id" className={`${classes.customSelect} MuiSelect-root MuiSelect-select MuiInputBase-input MuiInput-input `}>   
                      <option value={defaultValue} disable={"true"}></option>           
                      {documents.map((option) => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                :
                ''
              }
            </div>
              <div>
              <label className={"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"} >Write your instructions and click Send.</label>
              <TextareaAutosize id="comment" label="Description" name="comment" rowsMin={9}  className={classes.textarea} defaultValue={commentShow}/>         
              </div>
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button autoFocus  color="primary" className={classes.btn} onClick={() => {
            handleSubmit(ref.current)
          }}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAccount}
        onClose={handleAccountClose}
        scroll={"paper"}
        aria-labelledby="draggable-dialog-title"
        maxWidth={"sm"}
        fullWidth={true}
        className={"record-modal"}
      >
        <div className={classes.customPadding}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {"Create a Account"}
          </DialogTitle>
          <DialogContent>          
            <div>
              <form ref={ref} className={classes.root} noValidate autoComplete="off">              
                <div>              
                  <TextField id="company_name" name="company_name" label="Account Name" defaultValue={companyName}/>       
                </div>
              </form>
            </div>
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleAccountClose} color="secondary">
              Cancel
            </Button>
            <Button autoFocus  color="primary" className={classes.btn} onClick={() => {
              handleCreateAccount(ref.current)
            }}>
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
      <Dialog
        open={openLogo}
        onClose={handleLogoDialogClose}
        scroll={"paper"}
        aria-labelledby="draggable-dialog-title"
        maxWidth={"sm"}
        fullWidth={true}
        className={"record-modal"}
      >
        <div className={classes.customPadding}>
          <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
            {"Update Client Logo"}
          </DialogTitle>
          <DialogContent>          
            <div>
              <form ref={ref} className={classes.root} noValidate autoComplete="off" encType='multipart/form-data'>     
                <div className={"MuiFormControl-root MuiTextField-root"}>    
                  <TextField id="url_customer_logo" name="url_customer_logo" label="Logo url:" />       
                </div>
                <div className={"MuiFormControl-root MuiTextField-root"}>
                  <label className={"MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink MuiFormLabel-filled"} >Upload logo from hard drive:</label>
                  <div className={"MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"}>
                  <input
                    className={"MuiInputBase-input MuiInput-input"}
                    id="contained-button-file"
                    type="file"
                    name="file"
                  />                
                  </div>
                </div>
              </form>
            </div>
          </DialogContent>
          <DialogActions>
            <Button  onClick={handleLogoDialogClose} color="secondary">
              Cancel
            </Button>
            <Button autoFocus  color="primary" className={classes.btn} onClick={() => {
              handleUpdateClientLogo(ref.current)
            }}>
              Save
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </AppBar>
  );
}

const mapStateToProps = (state) => {
  return {
    siteLogo: state.patenTrack.siteLogo.site_logo ? state.patenTrack.siteLogo.site_logo.logo_big : '/assets/images/logos/patentrack_logo.png',
    clientID: state.patenTrack.clientID,
    messagesCount: state.patenTrack.messagesCount,
    alertsCount: state.patenTrack.alertsCount,
    companyData: state.patenTrack.company_data,
    treeForm: state.patenTrack.treeForm,
    user: state.patenTrack.profile ? state.patenTrack.profile.user : {},
    lawyers: state.patenTrack.lawyerList ? state.patenTrack.lawyerList : [],
    users: state.patenTrack.userList ? state.patenTrack.userList : [],
    documents: state.patenTrack.documentList ? state.patenTrack.documentList : [],
    portfolioList: state.patenTrack.portfolioList,
    selectedRFID: state.patenTrack.selectedRFID,
    currentAsset: state.patenTrack.currentAsset,
    currentAssetType: state.patenTrack.currentAssetType,
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    settingText: state.patenTrack.settingText ? state.patenTrack.settingText : 'Settings'
  };
};

const mapDispatchToProps = {
  signOut,
  getLawyers,
  getEntitiesList,
  getTransactionList,
  getUsers,
  updateClientEntities,
  setFlag,
  createAccount,
  postRecordItems,  
  updateComment,
  setSettingText,
  setCurrentWidget,
  updateClientLogo,
  setEntitiesList,
  setTransactionList,
  getLawFirmList,
  setSearchCompanies,
  getClientAssetsList,
  setClientAssetsList,
  setUploadTreeFile,
  setSearchBar,
  setSingleSearchBar,
  getTransactionEntities,
  setSearchHeight,
  setTreeHeight,
  setRetreiveCompanyAssetsHolding,
  setUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);