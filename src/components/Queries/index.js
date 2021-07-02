import React, { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';

import useStyles from "./styles";
import Header from "../common/Header";
import SplitPane from 'react-split-pane';

import * as authActions from "../../actions/authActions";
import * as patentActions from "../../actions/patenTrackActions";

import PatenTrackApi from "../../api/patenTrack";

function Queries(props) {
  const {authenticated} = props.auth;
  const classes = useStyles();
  const isMountedRef = useRef(null);
  const companyRef = useRef(null);

  const [ representativeCompany, setRepresentativeCompany ] = useState(null) 

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

  const handleRunQuery = async (value) => {
    if(representativeCompany != null) {
        console.log(representativeCompany, value)
        const {data} = await PatenTrackApi.runQuery(representativeCompany, value)
        console.log("data", data)
    }
  }
/* 
  const assetCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    let  asset = cellData;
    let activeClass = "";
    if(asset == ''){
      asset = assetList[rowIndex]['application'].toString()
      activeClass = asset == selectedAsset ? classes.activeCopyRow : ''
      asset = asset.substring(0,2) + "/" + asset.substring(2, asset.length)
    } 
    if(activeClass == '' && asset == selectedAsset) {
      activeClass = classes.activeCopyRow;
    }
    return (
      <a className={activeClass} onClick={(event) => openAssetIllustration(event)}>{asset}</a>
    )
  }

  const openAssetIllustration = (event) => {
    let selectedAssets = event.target.innerText;
    selectedAssets = selectedAssets.replace("/", "");
    setSelectedAsset(selectedAssets);
    props.getAssets(selectedAssets);
  }  */

  /**End all frontend request */

  if(!authenticated)
    return (<Redirect to={"/"}/>);

  return (
    <div className={classes.container}>
        <Header />
        <Grid 
            container
            className={classes.dashboardWarapper}
        >
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
                                        <Grid container style={{flexGrow: 1}} >
                                            <div style={{flexGrow: 1,width:'100%'}}>
                                                <form noValidate autoComplete="off">
                                                    <TextField id="company_name" label="Representative Name" ref={companyRef} onChange={(event) => setRepresentativeCompany(event.target.value)}/> 
                                                </form>    
                                                <List dense={false}>
                                                    {
                                                        [1,2].map( value => (
                                                            <ListItem>
                                                                <ListItemText
                                                                    primary= {`Query ${value}`}
                                                                    onClick={() => handleRunQuery(value)}
                                                                />
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>                         
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
                                        {/* <div style={{flexGrow: 1,width:'100%'}}>
                                        {
                                            assetList.length > 0 
                                            ?
                                                <Grid
                                                container
                                                className={classes.container}
                                                >
                                                <Grid
                                                    item lg={2} md={2} sm={2} xs={2}
                                                    className={classes.flexColumn}
                                                    style={{height: props.height - 150}}
                                                >
                                                    <AutoSizer>
                                                    {({ width, height}) => ( 
                                                        <Table
                                                            width={width}
                                                            height={height}
                                                            headerHeight={30}            
                                                            rowHeight={30}
                                                            sort={sort}
                                                            sortBy={sortInventBy}
                                                            sortDirection={sortInventDirection}
                                                            rowCount={assetList.length}           
                                                            rowGetter={({index}) => assetList[index]}>
                                                            <Column width={width} label="Asset" dataKey="number" cellRenderer = {assetCellRenderer}/>
                                                        </Table>
                                                    )}
                                                    </AutoSizer>
                                                </Grid>
                                                <Grid
                                                item lg={10} md={10} sm={10} xs={10}
                                                className={classes.flexColumn}
                                                style={{height: props.height - 150}}
                                                >
                                                <IconButton
                                                    color             = "inherit"
                                                    aria-haspopup     = "true"
                                                    onClick           = {() => {downloadJSON()}}
                                                >
                                                    {
                                                    <i className={"fa fa-download"} title="Download JSON"></i>
                                                    }
                                                </IconButton>
                                                    {
                                                    Object.keys(props.assetJSON).length > 0 && (
                                                        <div
                                                        className={classes.outSourceWrapper} ref={targetRef}
                                                        >
                                                        <div className={classes.padding} >
                                                            <PatentrackDiagram data={props.assetJSON} connectionBox={handleConnectionBox} comment={handleComment} share={handleShare} pdfView={handlePdfView} titleTop={topPosition} toolbarBottom={bottomToolbarPosition} parentWidth={parseInt(parent_width)} key={props.assetJSON + "_" + Math.random()} />             
                                                        </div>
                                                        </div>
                                                    )}
                                                </Grid>
                                                </Grid>
                                            :
                                            ''
                                            }
                                        </div>  */}
                                    </Grid>                                  
                                </Grid> 
                            </SplitPane>               
                        </Grid>
                    </Grid>
                </Grid>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Queries);