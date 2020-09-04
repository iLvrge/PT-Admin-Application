import React, {useState, useEffect} from 'react';

import {connect} from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useStyles from "./styles";
import CustomList from "./CustomList";
import CollapsibleTable from "./CollapsibleTable"
import Typography from '@material-ui/core/Typography';
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TabsContainer from "../Tabs";
import FullWidthSwitcher from "../FullWidthSwitcher";
import Loader from "../Loader";
import CustomTab from "../CustomTab";
import { getCustomers, setNestGridTabIndex, getFilterTimeLine, getCustomersParties,  getCustomersNameCollections, setTimelineTabIndex, getCustomerRFIDAssets, getCollectionIllustration,  setIllustrationUrl,  setCurrentCollectionID,  setCurrentAsset, setCurrentAssetType, getAssetsOutsource,  getAssets,  getComments, getCompanies,treeExpand, treeToggle,getAssetsCount,  getTransactions, getValidateCounter,  getErrorItems, selectTreeCompany } from "../../../actions/patenTrackActions";
import { signOut } from "../../../actions/authActions";

function LevelsNestedTreeGrid(props) {
  const { nestGridTab, setNestGridTabIndex } = props;
  const classes = useStyles();
  const [showSwitcher, setShowSwitcher] = useState(0);
  const isExpanded = props.currentWidget === "nestedTree";

  const [expanded, setExpanded] = useState([]);
  const [selected, setSelected] = useState([]);
  const [parentCompany, setParentCompany] = useState([]);
  const [parentNode, setParentNode] = useState("");
  const [parentNode1, setParentNode1] = useState("");
  const [parentNode2, setParentNode2] = useState(""); 

  
  useEffect(() => {
    
    if(expanded.length === 0 && props.treeTogg.length > 0) {
      setExpanded(props.treeTogg);
    }
    if(selected.length === 0 && props.treeExpa !== "") {
      setSelected(props.treeExpa);
    }
  },[expanded.length, props.treeExpa, props.treeTogg, selected.length]);

  const errorProcess = (err) => {
    if(err !== undefined && err.status === 401 && err.data === 'Authorization error') {
      props.signOut();
      return true;
    }
    return false;
  };

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
    props.treeToggle(nodeIds);
  };

  const onKeyPressed = (e) => {
    console.log(e.key);
  }

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    props.treeExpand(nodeIds);
    if(nodeIds !== "") {
      const targetEvent = event.currentTarget;
      const selectElement = targetEvent.querySelector('.MuiTreeItem-label');
      
      if(selectElement != null && selectElement !== undefined) {
        const svgICON = targetEvent.querySelector('.MuiSvgIcon-root');
        if(svgICON == null) {
          const newNodeIds = [...expanded];
          newNodeIds.push(nodeIds);
          setExpanded(newNodeIds);
          props.treeToggle(newNodeIds);
        }
        let itemText = event.currentTarget.innerText;
        /*if(itemText.indexOf('(') >=0) {
          itemText = itemText.substring(0,itemText.indexOf('('));
        }*/
        itemText = itemText.trim();
        const parentElement = targetEvent.parentNode;
        console.log("ppparentElement", parentElement);
        if (parentElement != null && parentNode !== undefined) {
          const level = parentElement.getAttribute('level');
          const tabId = parentElement.getAttribute('tabid');
          switch(parseInt(level)) {
            case 0:
              setParentCompany(itemText);
              setParentNode(nodeIds);
              setParentNode1("");
              setParentNode2("");
              props.getAssetsCount(itemText, true, false);
              props.getTransactions(itemText, true, false);
              props.getValidateCounter(itemText, true, false);
              props.getErrorItems('count',itemText, true, false);
              props.getErrorItems('list',itemText, true, false);
              props.setCurrentAsset('');
              props.setCurrentAssetType(1);
              props.getComments(1, itemText).catch(err => errorProcess({...err}.response));
              props.getCustomersParties(itemText, nestGridTab, nodeIds).catch(err => errorProcess({...err}.response));
              props.getFilterTimeLine( itemText, itemText, 0, nestGridTab ).catch(err => errorProcess({...err}.response));
              if( props.timelineTab === 1 ) {
                props.setTimelineTabIndex(0);
              }
              break;
            case 1:          
              setParentNode1(nodeIds);
              setParentNode2("");    
              props.setCurrentAsset('');
              props.setCurrentAssetType(2);
              console.log("nestGridTab", tabId, parentCompany);
              props.getComments(2, itemText).catch(err => errorProcess({...err}.response));
              props.getCustomersNameCollections(itemText, nestGridTab, parentNode, nodeIds, parentCompany).catch(err => errorProcess({...err}.response));
			        props.getFilterTimeLine( parentCompany, itemText, 1, nestGridTab ).catch(err => errorProcess({...err}.response));
              if( props.timelineTab === 1 ) {
                props.setTimelineTabIndex(0);
              }
              break;
            case 2: 
              if(itemText.indexOf('(') >=0) {
                itemText = itemText.substring(0,itemText.indexOf('('));
              }
              setParentNode2(nodeIds); 
              props.setCurrentCollectionID(itemText);
              props.setCurrentAsset('');  
              props.setCurrentAssetType(3);
              props.setIllustrationUrl('about:blank');
              props.getComments(3, itemText).catch(err => errorProcess({...err}.response));
              props.getAssetsOutsource(0, itemText).catch(err => errorProcess({...err}.response));
              props.getCustomerRFIDAssets(itemText, tabId, parentNode, parentNode1, nodeIds).catch(err => errorProcess({...err}.response)); 
              props.getFilterTimeLine( parentCompany, itemText, 2, nestGridTab ).catch(err => errorProcess({...err}.response));              
              props.getCollectionIllustration(itemText).catch(err => errorProcess({...err}.response));
              break;
            case 3: 
              const type = parentElement.getAttribute('type');
              console.log("ddtype", type);
              props.setCurrentAsset(itemText);
              props.setCurrentAssetType(type == 1 ? 4 : 5);
              props.setCurrentCollectionID('');
              props.setIllustrationUrl('about:blank'); 
              props.getComments(type, itemText).catch(err => errorProcess({...err}.response));
              props.getAssetsOutsource(1, itemText).catch(err => errorProcess({...err}.response));
              props.getAssets(itemText).catch(err => errorProcess({...err}.response));
              props.getFilterTimeLine( parentCompany, itemText, 3, nestGridTab ).catch(err => errorProcess({...err}.response));
              break;
            default: 
              break            
          }
        }
      }
    }
  };

  const getTreeItemsFromData = treeItems => {
    return treeItems.map( treeItemData => {
      let children = undefined;
      if (treeItemData.child && treeItemData.child.length > 0) {
        children = getTreeItemsFromData(treeItemData.child);
      }
      let name = treeItemData.level === 2 ? `${treeItemData.name} (${treeItemData.counter})` : treeItemData.name;

      return (
        <TreeItem  
          key={treeItemData.id}
          nodeId={`${treeItemData.id}`}
          label={name}
          children={children}
          tabid={nestGridTab}
          level={treeItemData.level}
          type={treeItemData.type}          
        />
      );
    });
  };

  const DataTreeView = ({ treeItems }) => {
    return (
      <TreeView  
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        onKeyDown={onKeyPressed}
       >
        {getTreeItemsFromData(treeItems)}
      </TreeView>
    );
  };
  

  const renderCustomersData = (data) => {
    if(props.isLoading)
      return <Loader/>;
    return (
      <div className={classes.flexColumn}>        
        {
          isExpanded 
          ?
          <CollapsibleTable data={data} />
          :
          <DataTreeView treeItems={data} />
        }
        
      </div>
    );
  };

  
  return (
    <div
      className     = {classes.nestedTree}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={classes.container}>
        <div className={classes.context} >
          <Typography variant="h6" className={classes.customPadding} align="center">
            {`Portfolios: ${props.companies.length}`}
          </Typography>
          {
            props.customersData
            ?
              
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }}
                className={classes.scrollbar}
              >
                {
                  nestGridTab === 0 && renderCustomersData(props.customersData.employee)
                }
                {
                  nestGridTab === 1 && renderCustomersData(props.customersData.ownership)
                }
                {
                  nestGridTab === 2 && renderCustomersData(props.customersData.merger)
                }
                {
                  nestGridTab === 3 && renderCustomersData(props.customersData.security)
                }
                {
                  nestGridTab === 4 && renderCustomersData(props.customersData.other)
                }
              </PerfectScrollbar>
            :
              ''
          }
        </div>
        {
          !isExpanded && (props.screenWidth < 1800 || props.screenHeight < 420)
          ?
            <CustomTab
              activeTabId={nestGridTab}
              setActiveTabId={setNestGridTabIndex}
              tabs={['Emply', 'Acqu', 'M&A', 'Secur', 'Other']}
            />
          :
            <TabsContainer
              activeTabId={nestGridTab}
              setActiveTabId={setNestGridTabIndex}
              tabs={['Emply', 'Acqu', 'M&A', 'Secur', 'Other']}
            />
        }
      </div>
      <FullWidthSwitcher show={showSwitcher} widget={"nestedTree"}/>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    customersData: state.patenTrack.customersData,
    isLoading: state.patenTrack.customersLoading,
    currentWidget: state.patenTrack.currentWidget,
    screenWidth: state.patenTrack.screenWidth,
    screenHeight: state.patenTrack.screenHeight,
    nestGridTab: state.patenTrack.nestGridTab,
    timelineTab: state.patenTrack.timelineTab,
    companies: state.patenTrack.companiesList,
    treeTogg: state.patenTrack.treeToggle,
    treeExpa: state.patenTrack.treeExpand,
  };
};

const mapDispatchToProps = {
  getCustomers,
  setNestGridTabIndex,
  getFilterTimeLine,
  getCustomersParties,
  getCustomersNameCollections,
  setTimelineTabIndex,
  getCustomerRFIDAssets,
  getCollectionIllustration,
  setIllustrationUrl,
  setCurrentCollectionID,
  setCurrentAsset,
  setCurrentAssetType,
  getAssetsOutsource,
  getAssets,
  getComments,
  getCompanies,
  treeExpand,
  treeToggle,
  getAssetsCount,
  getTransactions,
  getValidateCounter,
  getErrorItems,
  selectTreeCompany,
  signOut
};

export default connect(mapStateToProps, mapDispatchToProps)(LevelsNestedTreeGrid);