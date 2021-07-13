import React, { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import PatentrackDiagram from "../common/PatentrackDiagram";

import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

import useStyles from "./styles";
import Header from "../common/Header";
import SplitPane from 'react-split-pane';

import * as authActions from "../../actions/authActions";
import * as patentActions from "../../actions/patenTrackActions";

import PatenTrackApi from "../../api/patenTrack";

function Queries(props) {
  const {authenticated} = props.auth;
  const classes = useStyles();
  const targetRef = useRef();
  const isMountedRef = useRef(null);
  const companyRef = useRef(null);
  const [sortInventBy, setSortInventBy] = useState('number');
  const [sortInventDirection, setSortInventDirection] = useState(SortDirection.ASC)
  const [assetList, setAssetList] = useState([])
  const [selectedAsset, setSelectedAsset] = useState("")
  const [ representativeCompany, setRepresentativeCompany ] = useState(null) 
  const [parent_width, setParentWidth] = useState(0)
  const[queryColumnName, setQueryColumnName] = useState('')
  const[queryDataKey, setQueryDataKey] = useState('')
  const[queriesList, setQueriesList] = useState([
    {
      id: 1,
      name: 'Table_A'
    },
    {
      id: 2,
      name: 'Table_B'
    },
    {
      id: 3,
      name: 'Table_C'
    },
    {
      id: 4,
      name: 'Table_D'
    },
  ])

  const [bottomToolbarPosition, setBottomToolbarPosition] = useState(0)

  const [topPosition, setTopPosition] = useState(0)

  const errorProcess = (err) => {
    if(err !== undefined && err.status === 401 && err.data === 'Authorization error' && isMountedRef.current) {
      props.actions.signOut();
    }
  };

  useEffect(() => {
    console.log("queryColumnName, queryDataKey", queryColumnName, queryDataKey, assetList)
  }, [ queryColumnName, queryDataKey, assetList])

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

  useEffect(() => {
    if (targetRef.current != null) {
      updateContainerWidth();
    }
  }, [ targetRef ])

  const handleRunQuery = async (value) => {
    if(representativeCompany != null) {
      console.log(representativeCompany, value)
      switch(parseInt(value)) {
        case 1: 
        case 2:
        case 3:
        case 4:
          setQueryColumnName('Asset')
          setQueryDataKey('list_3')
          break;
      }
      props.patentActions.setAssets({})
      setAssetList([])
      const {data} = await PatenTrackApi.runQuery(representativeCompany, value)
      setAssetList(data)
    }
  }

  const sort = ({ sortBy, sortDirection }) => {
    setSortInventBy(sortBy);
    setSortInventDirection(sortDirection);

    let newItems =  [...assetList] ;
    newItems.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return sortDirection === SortDirection.ASC ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortDirection === SortDirection.ASC ? 1 : -1;
      }
      return 0;
    });
    setAssetList(newItems);  
  }

  const updateContainerWidth = () => {
    if (targetRef.current) {
      const patentelement = targetRef.current.parentElement.parentElement;
      setBottomToolbarPosition(props.screenHeight - patentelement.offsetHeight - 40);
      const clientRect = patentelement.getBoundingClientRect();      
      setTopPosition(clientRect.top  + 26);
      setParentWidth(parseInt(targetRef.current.offsetWidth));
    }
  }

  const assetCellRenderer = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
    let  asset = cellData;
    let activeClass = "";
    /* if(asset == ''){
      asset = assetList[rowIndex]['application'].toString()
      activeClass = asset == selectedAsset ? classes.activeCopyRow : ''
      asset = asset.substring(0,2) + "/" + asset.substring(2, asset.length)
    }  */
    if(activeClass == '' && asset == selectedAsset) {
      activeClass = classes.activeCopyRow;
    }
    return (
      <a className={activeClass} onClick={(event) => openAssetIllustration(event)}>{asset}</a>
    )
  }

  const openAssetIllustration = (event) => {
    let selectedAssets = event.target.innerText;
    /* selectedAssets = selectedAssets.replace("/", ""); */
    setSelectedAsset(selectedAssets);
    props.patentActions.getAssets(selectedAssets);
  }  

  const downloadJSON = () => {
    console.log("downloadJSON");
    if(selectedAsset != "" && Object.keys(props.assetJSON).length > 0) {
      let filename = selectedAsset+".json";
      let blob = new Blob([JSON.stringify(props.assetJSON)], {
        type: "application/json;charset=utf-8"
      });
      var element = document.createElement('a');
      var url = URL.createObjectURL(blob);
      element.href = url;
      element.setAttribute('download', filename);
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);
    } else {
      alert("Please select asset first");
    }
  }

  const handlePdfView = (obj) => {
    console.log("handlePdfView", obj);
    if(typeof obj.document_file != "undefined") {
      props.patentActions.setPDFFile({document: obj.document_file, form: obj.document_form, agreement: obj.document_agreement}); 
      props.patentActions.setPDFView(true);
      props.patentActions.setPdfTabIndex(0); 
    } else {
      alert("No document found!");
    }
  }
  
  const handleShare = (obj) => {
    console.log("handleShare", obj);
    if(obj != null && typeof obj.original_number != undefined && obj.original_number != null) {
      let form = new FormData();
      form.append("assets", obj.original_number);
      form.append("type", 2);
      props.patentActions.share(form);
    }
  }
  
  const handleComment = (obj) => {
    console.log("handleComment", obj);
  }

  const handleConnectionBox = (obj) => {
    console.log("handleConnectionBox", obj);
    if(typeof obj.popup != "undefined"){
      props.patentActions.setConnectionData(obj);
      props.patentActions.setConnectionBoxView(true);
    }
  }

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
                                                        queriesList.map( (query, index) => (
                                                            <ListItem key={`query${index}`}>
                                                                <ListItemText
                                                                    primary= {query.name}
                                                                    onClick={() => handleRunQuery(query.id)}
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
                                      <div style={{flexGrow: 1,width:'100%', display: 'flex', flexDirection: 'column'}}>
                                        {
                                            assetList.length > 0 
                                            ?
                                                <Grid
                                                container
                                                className={classes.container}
                                                style={{flexDirection: 'row'}}
                                                >
                                                <Grid
                                                    item lg={1} md={1} sm={1} xs={1}
                                                    className={classes.flexColumn}
                                                    style={{height: '100%'}}
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
                                                            <Column width={width} label={queryColumnName} dataKey={queryDataKey} cellRenderer = {assetCellRenderer}/>
                                                        </Table>
                                                    )}
                                                    </AutoSizer>
                                                </Grid>
                                                <Grid
                                                item lg={11} md={11} sm={11} xs={11}
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
                                                      )
                                                    }
                                                </Grid>
                                                </Grid>
                                            :
                                            ''
                                            }
                                        </div>  
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
    profile: typeof state.patenTrack.profile == "undefined" ? null : state.patenTrack.profile,
    assetJSON: state.patenTrack.assets,
    asset_list: state.patenTrack.asset_list,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(authActions, dispatch),
    patentActions: bindActionCreators(patentActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Queries);