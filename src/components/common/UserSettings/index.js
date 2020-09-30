import React, { useState, useEffect, useRef  } from "react";

import {connect} from 'react-redux';
import useStyles from "./styles";
import { Grid } from '@material-ui/core';
import SearchCompanies from "../SearchCompanies";
import Companies from "../Companies";
import CorporateTreeUploader from "../CorporateTreeUploader";
import SplitPane from 'react-split-pane';
import { bindActionCreators } from "redux";
import * as authActions from "../../../actions/authActions";
import * as patentActions from "../../../actions/patenTrackActions";

function UserSettings(props) {
    const classes = useStyles();
    const isExpanded = props.currentWidget === 'settings';
    const isMountedRef = useRef(null);
    const [callComp, setCallComp] = useState(0);

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

            setCallComp(1);
        }       
    });
 

  if(isExpanded === 'settings') {
      console.log("call")
  }

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
                            <Grid
                                item lg={12} md={12} sm={12} xs={12}
                                className={classes.flexColumn}
                                style={{height: '99%'}}
                            >
                                <div >
                                    <Companies />
                                </div> 
                            </Grid>                            
                        </Grid>    
                    </Grid>

                    <Grid
                        item lg={12} md={12} sm={12} xs={12}
                        className={classes.flexColumn}
                        style={{height: '94.5%'}} 
                    >    
                        
                           <Grid container style={{flexGrow: 1,}} className={props.corporate_html_file != '' ? classes.customerSearchHeight : ''}>
                            <div style={{flexGrow: 1,width:'100%'}}>
                                <SearchCompanies />
                                </div> 
                            </Grid>  
                            {
                                props.treeForm === true
                                ?
                                <Grid container style={{flexGrow: 1}} >
                                    <div style={{flexGrow: 1,width:'100%'}}>
                                        <CorporateTreeUploader />                                    
                                    </div> 
                                </Grid>
                                :
                                ''
                            }       
                    </Grid> 
                    </SplitPane>           
                                               
                </Grid>
            </Grid>
        </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    currentWidget: state.patenTrack.currentWidget,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
    searchHeight: state.patenTrack.searchHeight,
    treeHeight: state.patenTrack.treeHeight,
    treeForm: state.patenTrack.treeForm,
    corporate_html_file: state.patenTrack.corporate_html_file,
    lawyers: state.patenTrack.lawyerList ? state.patenTrack.lawyerList : [],
    documents: state.patenTrack.documentList ? state.patenTrack.documentList : [],    
    isLawyerLoading: state.patenTrack.laywerListLoading,
    isDocumentLoading: state.patenTrack.documentListLoading,
    width: state.patenTrack.screenWidth,
    height: state.patenTrack.screenHeight,
    settingTab: state.patenTrack.settingTab
  };
};

const mapDispatchToProps = (dispatch) => {
    return {
    actions: bindActionCreators(authActions, dispatch),
    patentActions: bindActionCreators(patentActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserSettings);