import React, { useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Redirect } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import useStyles from "./styles";
import Header from "../common/Header";
import PdfViewer from "../common/PdfViewer";
import UserSettings from "../common/UserSettings"; 
import UpdatedAssets from "../common/UpdatedAssests";
import ValidateCounter from "../common/ValidateCounter"; 
import CommentComponents from "../common/CommentComponents";
import LevelsNestedTreeGrid from "../common/LevelsNestedTreeGrid";
import RecordItemsContainer from "../common/RecordItemsContainer";
import TransactionsContainer from "../common/TransactionsContainer";

import * as authActions from "../../actions/authActions";
import * as patentActions from "../../actions/patenTrackActions";

function DashBoard(props) {
  const {authenticated} = props.auth;
  const classes = useStyles();
  const isMountedRef = useRef(null);

  const errorProcess = (err) => {
    if(err !== undefined && err.status === 401 && err.data === 'Authorization error' && isMountedRef.current) {
      props.actions.signOut();
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    if(props.profile == null) {
      
      /*props.patentActions.getProfile(isMountedRef.current).catch(err => {
        errorProcess({...err}.response);
      });
      props.patentActions.getCustomers('other', isMountedRef.current).catch(err => {
        errorProcess({...err}.response);
      });*/
    }
    return () => isMountedRef.current = false;
  });

  /**End all frontend request */

  const renderContext = () => {
    const {currentWidget} = props;
    if(currentWidget === 'all') {
      return (
        <Grid
          container
          className={classes.dashboard}
        >
          <Grid
            item lg={2} md={2} sm={2} xs={2}
            className={classes.flexColumn}
          >
            <Grid
              item
              className={classes.flexColumn}
              style={{flexGrow: 1, height: '100%'}}
            >
              <div style={{height: '20%'}}>
                <ValidateCounter/>
              </div>
              <div style={{height: '60%'}}>
                <LevelsNestedTreeGrid/>
              </div>
              <div style={{height: '20%'}}>
                <TransactionsContainer/>
              </div>
            </Grid>
          </Grid>
          <Grid
            item lg={6} md={6} sm={6} xs={6}
            className={classes.flexColumn}
            style={{flexGrow: 1}}
          >
            <Grid
              item
              className={classes.flexColumn}
              style={{flexGrow: 1, height: '80%'}}
            >
             
            </Grid>
            <Grid container style={{ height: '20%'}}>
              <Grid item lg={4} md={4} sm={4} xs={4}>
                <UpdatedAssets/>
              </Grid>
              <Grid
                item lg={8} md={8} sm={8} xs={8}
                className={classes.flexColumn}
              >
                <CommentComponents/>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            className={classes.flexColumn}
            item lg={4} md={4} sm={4} xs={4}
          >
            <Grid container style={{flexGrow: 1, height: '70%'}} id={"ms23wd"}>
              <Grid
                item lg={12} md={12} sm={12} xs={12}
                className={`${classes.flexColumn} ${classes.customIndex}`}
                style={{position: 'relative', display:'none', zIndex:10001}}
              >
                <PdfViewer display={"false"}/>
              </Grid>
              <Grid
                item lg={6} md={6} sm={6} xs={6}
                className={classes.flexColumn}
              >
                
              </Grid>
              <Grid
                item lg={6} md={6} sm={6} xs={6}
                className={classes.flexColumn}
              >
                <RecordItemsContainer display={"false"}/>
              </Grid>              
            </Grid>
            <Grid container style={{ height: '30%'}}>
            </Grid>
          </Grid>
        </Grid>
      )
    }
    if(currentWidget === 'nestedTree') {
      return <LevelsNestedTreeGrid/>
    }
    if(currentWidget === 'fixItems') {
      return ''
    }
    if(currentWidget === 'recordItems') {
      return <RecordItemsContainer display={"true"}/>
    }
    
   
    if(currentWidget === 'comments') {
      return <CommentComponents/>
    }
    if(currentWidget === 'validateCounter') {
      return <ValidateCounter/>
    }
    if(currentWidget === 'updatedAssets') {
      return <UpdatedAssets/>
    }
    if(currentWidget === 'transactions') {
      return <TransactionsContainer/>
    }
    if(currentWidget === 'agreement') {
      return <PdfViewer display={"true"}/>
    }
    if(currentWidget === 'settings') {      
      return <UserSettings/>
    }
  };

  if(!authenticated)
    return (<Redirect to={"/"}/>);

  return (
    <div className={classes.container}>
      <Header />
      <Grid
        container
        className={classes.dashboardWarapper}
      >
        {renderContext()}
      </Grid>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    currentWidget: state.patenTrack.currentWidget,
    screenHeight: state.patenTrack.screenHeight,
    screenWidth: state.patenTrack.screenWidth,
    profile: typeof state.patenTrack.profile == "undefined" ? null : state.patenTrack.profile
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(authActions, dispatch),
    patentActions: bindActionCreators(patentActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);