import React, { useState, useEffect, useRef  } from "react";

import {connect} from 'react-redux';
import useStyles from "./styles";
import { Grid } from '@material-ui/core';
import Loader from "../Loader";
import SearchCompanies from "../SearchCompanies";
import Companies from "../Companies";
import Users from "../Users";
import Lawyers from "../Lawyers";
import Documents from "../Documents";
import TabsContainer from "../Tabs";
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
                    <Grid
                        item lg={4} md={4} sm={4} xs={4}
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
                        item lg={8} md={8} sm={8} xs={8}
                        className={classes.flexColumn}
                        style={{height: '94.5%'}} 
                    >                               
                        <Grid container style={{flexGrow: 1}} >
                            <div style={{height: '100%',flexGrow: 1,width:'100%'}}>
                                <SearchCompanies />
                            </div> 
                        </Grid>                        
                    </Grid>                           
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