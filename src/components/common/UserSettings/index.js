import React, { useState, useEffect, useRef, useCallback  } from "react";

import {connect} from 'react-redux';
import useStyles from "./styles";
import { Grid, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Modal from '@material-ui/core/Modal';
import SearchCompanies from "../SearchCompanies";
import Keywords from "../Keywords";
import Companies from "../Companies";
import CorporateTreeUploader from "../CorporateTreeUploader";
import LawfirmByAddress from "../SearchCompanies/LawfirmByAddress";
import CompanyByAddress from "../SearchCompanies/CompanyByAddress";
import Reports from '../Reports';
import SplitPane from 'react-split-pane';
import { bindActionCreators } from "redux";
import Pusher from 'pusher-js'; 
import * as authActions from "../../../actions/authActions";
import * as patentActions from "../../../actions/patenTrackActions";
import NewCompaniesRequest from "../NewCompanyRequest";
import CompanyKeywords from "../CompanyKeywords";
import PatenTrackApi from "../../../api/patenTrack";

function UserSettings(props) {

    const MINUTE_MS = 600000;
    const classes = useStyles();
    const isExpanded = props.currentWidget === 'settings';
    const isMountedRef = useRef(null);
    const [callComp, setCallComp] = useState(0);
    const [notification, setNotification] = useState(null);
    const [previousCitedAssigneesCounter, setPreviousCitedAssigneesCounter] = useState({cited_assignees: 0, assignees_logo: 0})
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openCompanyModal, setOpenCompanyModal] = useState(false);
    const errorProcess = (err) => {
        if(err !== undefined && err.status === 401 && err.data === 'Authorization error' && isMountedRef.current) {
          props.actions.signOut();
        }
    };

    useEffect(() => {
        isMountedRef.current = true;

        if(callComp === 0) {
            /*props.patentActions.getUsers().catch(err => {
                errorProcess({...err}.response);
            });

            props.patentActions.getCompanies().catch(err => {
                errorProcess({...err}.response);
            });*/

            props.patentActions.getClients().catch(err => {
                errorProcess({...err}.response);
            });

            
            /*Pusher.logToConsole = true*/

            const pusher = new Pusher(process.env.REACT_APP_PUSHER_API_CODE, {
                cluster: process.env.REACT_APP_PUSHER_CLUSTER,
                encrypted: true
            });
    
            const channel = pusher.subscribe(process.env.REACT_APP_PUSHER_CHANNEL);
    
            channel.bind(process.env.REACT_APP_PUSHER_EVENT, function(data) {
                setOpen(true);
                setNotification(data);
            });
            setCallComp(1);
        }   
    });

    useEffect(() => {
        if(props.flag_update_text){
            setOpen(true);
            setNotification(props.flag_update_text);
        }
    }, [props.flag_update_text]) 
    
    useEffect(() => {        
        setOpenModal(props.searchedLawfirmAddressModal)
    }, [props.searchedLawfirmAddressModal])

    useEffect(() => {        
        setOpenCompanyModal(props.searchedCompanyAddressModal)
    }, [props.searchedCompanyAddressModal])

    useEffect(() => {
        const randomNumber = Math.random() * 100
        if(notification !== null && notification.indexOf('IMAGES_RETRIEVED:') >= 0 ) {
            /* const findID = notification.toString().replace('IMAGES_RETRIEVED: ', '');
            if(findID > 0) {
                props.patentActions.setCitedAssigneeImagesRetreived(findID)
            } */
        } else if(notification === "Employee flag script finished." || notification === "Classification Complete.") {
            if(props.clientID != 0 && props.clientID != null && props.transaction_list.list.length > 0) {
                setNotification(null)
                props.patentActions.refreshReclassify(randomNumber)
                props.patentActions.getTransactionList(props.clientID, Array.isArray(props.portfolioList) ? props.portfolioList : []);
            }
        } else if(notification === 'RE-Classify flag.') {
            console.log('Reclassification', randomNumber)
            setNotification(null)
            props.patentActions.refreshReclassify(randomNumber)
        } else if (/* notification === "Assignee logo download script finished." ||  */notification === "Cited Patents finished.") {
            /* if(props.clientID != 0 && props.clientID != null && props.cited_patents.citedAssignees.length > 0) {
                props.patentActions.getCitedAssigneesList(props.clientID, Array.isArray(props.portfolioList) ? props.portfolioList : []);
            } */
        }
    }, [notification])

    useEffect(() => {
    const interval = setInterval(() => {
        /**
         *  Check Cited Assignees and Logos
         */
        const getCitedAssigneeCounter = async () => {
            const {data} = await PatenTrackApi.getCitedAssigneeCounter();
            console.log('getCitedCounter', data)
            let alertForScript = false
            setPreviousCitedAssigneesCounter( previous => {
                if(previous.cited_assignees != 0 && previous.assignees_logo != 0 && (previous.cited_assignees == data.cited && previous.assignees_logo == data.logo)) {
                    alertForScript = true
                }
                return {
                    cited_assignees: data.cited,
                    assignees_logo: data.logo,
                }
            })
            console.log('alertForScript', alertForScript)
            if(alertForScript === true) {
                /**
                 * Show notification for the script not working
                 */
                setNotification('The current counter is the same as the previous for Cited Patents Assignee or Logos are the same.')
            }
        }
        getCitedAssigneeCounter()
    }, MINUTE_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    const Alert = (props) => {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClose = (event, reason) => {
        /* if (reason === 'clickaway') {
          return;
        } */    
        setOpen(false);
    };
 

    if(isExpanded === 'settings') {
      console.log("call")
    }

    const handleCloseModal = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        props.patentActions.setSearchAddressModal(false)
    };

    const handleCloseCompanyModal = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        } 
        props.patentActions.setSearchCompanyAddressModal(false)
    };

    

  return (
    <div className={"userSettings"}>
        <Grid
        container
        className={classes.container}
        style={{
            height: props.screenHeight
        }}
        >      
            <Grid
                container
                className={classes.settingContainer}
            >
                {
                    notification !== null && notification.indexOf('IMAGES_RETRIEVED:') == -1 && (
                        <Snackbar open={open} autoHideDuration={null} anchorOrigin={{vertical:'bottom', horizontal:'left'}} onClose={handleClose}>
                            <Alert onClose={handleClose} severity="success">{notification}</Alert>
                        </Snackbar>
                    )
                }
                <Grid
                container
                className={classes.setting}
                >         
                    <SplitPane
                            className={classes.splitPane} 
                            split="vertical"
                            minSize={50}
                            defaultSize={parseInt(localStorage.getItem('splitPos'), 12)}
                            onChange={(size) => localStorage.setItem('splitPos', size)}
                        >
                        <Grid
                            item lg={12} md={12} sm={12} xs={12}
                            className={classes.flexColumn}
                            style={{height: '100%'}}
                        >
                            <Grid container style={{flexGrow: 1}} >
                                {
                                    props.treeForm === true 
                                    ?
                                    <Grid container style={{flexGrow: 1}} >
                                        <div style={{flexGrow: 1,width:'100%'}}>
                                            <CorporateTreeUploader />                                    
                                        </div> 
                                    </Grid>
                                    :
                                    <Grid
                                        item lg={12} md={12} sm={12} xs={12}
                                        className={classes.flexColumn}
                                        style={{height: '99%'}}
                                    >
                                        <div>
                                            <Companies />
                                        </div> 
                                    </Grid>  
                                }                                                      
                            </Grid>    
                        </Grid>

                    <Grid
                        item lg={12} md={12} sm={12} xs={12}
                        className={classes.flexColumn}
                        style={{height: '94.5%'}} 
                    >   
                        {
                            props.companyReports.length > 0
                            ?
                            <Reports />
                            :
                            props.new_companies_request.length > 0
                            ?
                                <NewCompaniesRequest />
                            :
                            props.classificationKeyword.length > 0 
                            ?
                                <CompanyKeywords keywords={props.classificationKeyword} />
                            :
                            props.keywords.length > 0 || props.super_keywords.length > 0 
                            ?
                                <Keywords keywords={props.keywords} super_keywords={props.super_keywords} state_keywords={props.state_keywords}/>
                            :
                            <Grid container style={{flexGrow: 1,}} className={props.corporate_html_file != '' ? classes.customerSearchHeight : ''}>
                                <div style={{flexGrow: 1,width:'100%'}}>
                                    <SearchCompanies />
                                </div> 
                            </Grid>
                        }                                  
                    </Grid> 
                    </SplitPane>     
                    <Modal
                        open={openModal}
                        onClose={handleCloseModal}
                        aria-labelledby="Search Lawfirm Address"
                        aria-describedby=""
                    >
                        <div className={classes.modalContainer}>
                            <LawfirmByAddress />
                        </div>
                    </Modal> 

                    <Modal
                        open={openCompanyModal}
                        onClose={handleCloseCompanyModal}
                        aria-labelledby="Search Company Address"
                        aria-describedby=""
                    >
                        <div className={classes.modalContainer}>
                            <CompanyByAddress />
                        </div>
                    </Modal>          
                </Grid>
            </Grid>
        </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    companyReports: state.patenTrack.companyReports,  
    currentWidget: state.patenTrack.currentWidget,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
    searchHeight: state.patenTrack.searchHeight,
    treeHeight: state.patenTrack.treeHeight,
    treeForm: state.patenTrack.treeForm,
    corporate_html_file: state.patenTrack.corporate_html_file,
    lawyers: state.patenTrack.lawyerList ? state.patenTrack.lawyerList : [],
    documents: state.patenTrack.documentList ? state.patenTrack.documentList : [],  
    flag_update_text: state.patenTrack.flag_update_text,  
    new_companies_request: state.patenTrack.new_companies_request,
    classificationKeyword: state.patenTrack.classificationKeyword,
    keywords: state.patenTrack.keywords,
    super_keywords: state.patenTrack.super_keywords,
    state_keywords: state.patenTrack.state_keywords,
    isLawyerLoading: state.patenTrack.laywerListLoading,
    isDocumentLoading: state.patenTrack.documentListLoading,
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    settingTab: state.patenTrack.settingTab,
    searchedLawfirmAddressModal: state.patenTrack.searchedLawfirmAddressModal,
    searchedCompanyAddressModal: state.patenTrack.searchedCompanyAddressModal,
    clientID: state.patenTrack.clientID,
    cited_patents: state.patenTrack.cited_patents,
    transaction_list: state.patenTrack.transaction_list,
    portfolioList: state.patenTrack.portfolioList ? state.patenTrack.portfolioList : [],
    tableScrollPosition: state.patenTrack.tableScrollPosition
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
    actions: bindActionCreators(authActions, dispatch),
    patentActions: bindActionCreators(patentActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);