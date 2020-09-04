import React, { useState, useEffect, useRef  } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';

import useStyles from "./styles";
import FullWidthSwitcher from "../FullWidthSwitcher";
import TabsContainer from "../Tabs";
import {connect} from 'react-redux';
import { getAssetsOutsource, getTimeLine, setTimelineTabIndex, setCurrentCollectionID, setCurrentAsset, setIllustrationUrl, getTimelineFilterWithDate, setTimeLine, setTimeLineLoading, cancelRequest } from "../../../actions/patenTrackActions";
import 'font-awesome/css/font-awesome.min.css';
import classnames from 'classnames';
import moment from 'moment';

/*import modifyingData from './TimeLine';
import assignmentTimeline from "./TimeLine1";*/
import modifyTimeline from "./modifytimeline";
import {assignmentTimeline, timelineOnChange} from "./newtimeline";

function checkMe(data) {
	console.log("frame loaded....");
	const iframe = document.getElementById("outsource");
	if(typeof iframe.contentWindow !== "undefined"){
		if(typeof iframe.contentWindow.renderData === "function") {
      iframe.contentWindow.renderData(data);
      iframe.contentWindow.applyZoomFunction(); 
		}
	}
}

function loadTimeline(data) {
  const iframe = document.getElementById("timeline");
	if(typeof iframe.contentWindow !== "undefined"){
		if(typeof iframe.contentWindow.renderData === "function" && typeof data.assignment_assignors != 'undefined') {
      iframe.contentWindow.renderData(data);
		}
	}
} 
function TimeLineContainer(props) {
  const { timelineTab, setTimelineTabIndex } = props;
  const classes = useStyles();
  const [showSwitcher, setShowSwitcher] = useState(0);
  const [counter, setItemCounts] = useState(0);
  const ref = useRef(null);
   
  /*const [timeInterval, setTimeInterval] =  useState( null );*/
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const WAIT_INTERVAL = 5000; 
  const DATE_FORMAT = 'YYYY-MM-DD';

  const [timelineObject, setTimelineObject] = useState(null);

  const [timelineData, setTimelineData] = useState([]);

  const [itemsDateList, setItemsDateList] = useState([]);

  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  /*const [flag, setFlag] = useState(0);*/

  var timeInterval, flag = 0;
  const activeTabChange = (tabId) => {
    console.log("tabId", tabId);
    if((tabId == 1 && (props.selectedRFID !== "" || props.currentAsset !== "")) || (tabId == 2 && (props.currentAsset !== "" || props.selectedRFID !== ""))) {
      console.log("tabId", tabId, props);
      setTimelineTabIndex(tabId);
    } else {
      setTimelineTabIndex(0);
    }
  };
  useEffect(() => {
    const iframe = document.getElementById("outsource");
    if(timelineTab === 1 && iframe) {
      if(typeof iframe.contentWindow !== "undefined"){
        if(typeof iframe.contentWindow.renderData === "function") {
          console.log("iframe",iframe.contentWindow.renderData);
          iframe.contentWindow.renderData(props.assets);
          iframe.contentWindow.applyZoomFunction();
        }
      }
    }
  }, [props.assets]);

  useEffect(() => {
    console.log("TIMELINE USE EFFECT");
    flag = 0;
    if(timelineTab === 0 && props.timeLine.items) {
      /*setTimelineData(props.timeLine); 
      setItemCounts(props.timeLine.assignment_assignors.length + props.timeLine.assignment_assignee.length);
      const iframe = document.getElementById("timeline");
      if(timelineTab === 0 && iframe) {
        if(typeof iframe.contentWindow !== "undefined"){
          if(typeof iframe.contentWindow.renderData === "function") {
            console.log("iframe",iframe.contentWindow.renderData);
            iframe.contentWindow.renderData(props.timeLine);
          }
        }
      }*/
      (async () => {
        /*const passingData = await modifyingData(props.timeLine);
        assignmentTimeline(
          passingData.groups,
          passingData.groups3,
          passingData.items1,
          passingData.items3,
          passingData.itemDates,
          props.setCurrentCollectionID, 
          props.setCurrentAsset, 
          props.setIllustrationUrl,
          props.getAssetsOutsource
        );*/

        const passingData = await modifyTimeline(props.timeLine);  
        console.log("passingData", passingData);
        assignmentTimeline( 
          passingData.items,
          passingData.itemDates,
          props.setCurrentCollectionID, 
          props.setCurrentAsset, 
          props.setIllustrationUrl,
          props.getAssetsOutsource,
          props.add_years
        );
        /*setItemsDateList(passingData.itemDates);
        setMinDate(passingData.minDate);
        setMaxDate(passingData.maxDate);
        //console.log("add_years", props.add_years);
        assignmentTimeline( 
          passingData.items,
          passingData.itemDates,
          passingData.minDate,
          passingData.maxDate,
          props.setCurrentCollectionID, 
          props.setCurrentAsset, 
          props.setIllustrationUrl,
          props.getAssetsOutsource,
          props.add_years
        ); 
        const timeLine = timelineOnChange();
        setTimelineObject(timeLine);*/
      })();
    }
  }, [props.timeLine, timelineTab]);

  if(timelineObject != null) {    
    /*timelineObject.on("mouseMove", function(event){
      console.log("mouseMove", event);
    });*/
    
    timelineObject.on("rangechanged", function(properties){
      if(startDate != moment(properties.start).format(DATE_FORMAT) || endDate != moment(properties.end).format(DATE_FORMAT)) {        
        if(properties.byUser === true) {
          let checkScroll = 0;
          console.log("STARTDATE", startDate, new Date(startDate).getTime(), "ENDDATE", endDate, new Date(endDate).getTime());    

          /*if(startDate != null && new Date(properties.start).getTime() < new Date(startDate).getTime()) {
            checkScroll = 0;
          } else */if(endDate != null && new Date(properties.end).getTime() > new Date(endDate).getTime()) {
            checkScroll = 1;
          }

          setStartDate(moment(properties.start).format(DATE_FORMAT));
          setEndDate(moment(properties.end).format(DATE_FORMAT));

          if(itemsDateList.length > 0) {
            let min = Math.min(...itemsDateList);
            let newStart = new Date(properties.start).getTime();

            let max = Math.max(...itemsDateList);
            let newEnd = new Date(properties.end).getTime();
            //console.log("MIN", min, minDate, "NEWSTART", newStart, maxDate, newStart < min, checkScroll, "MAX", max, "MAXEND", newEnd);
            if(((checkScroll == 0 && newStart < min) || (checkScroll == 1 && newEnd > max)) && flag == 0) {
              flag = 1; 
              //console.log("NEW REQUEST");
              //alert("NEW REQUEST");
              if(checkScroll == 0){
                setStartDate(null);    
              } else if(checkScroll == 1) {
                setEndDate(null); 
              }
              console.log("timeInterval", timeInterval, flag);
              clearTimeout(timeInterval);
              timeInterval = setTimeout(() => {
                props.cancelRequest();
                if(startDate != null && endDate != null && flag == 0) {  
                  console.log(flag);  
                  //props.setTimeLineLoading( false );
                  //props.setTimeLine( [] );  
                  console.log("REQUESTSEND", props.nestGridTab, startDate, endDate, checkScroll);           
                  //props.getTimelineFilterWithDate(props.nestGridTab, startDate, endDate, checkScroll);
                }
              }, WAIT_INTERVAL); 
            }    
          }
        }
      }
    });
  }

  /*if(timelineObject != null) {    
    timelineObject.on("rangechanged", function(properties){
      if(startDate != moment(properties.start).format(DATE_FORMAT) && endDate != moment(properties.end).format(DATE_FORMAT)) {
        setStartDate(moment(properties.start).format(DATE_FORMAT));
        setEndDate(moment(properties.end).format(DATE_FORMAT));
        if(properties.byUser === true) {
          clearTimeout(timeInterval);
          setTimeInterval(setTimeout(() => {
            props.cancelRequest();
            if(startDate != null && endDate != null) {
              props.setTimeLineLoading( false );
              props.setTimeLine( [] );
              props.getTimelineFilterWithDate(startDate, endDate); 
            }    
          }, WAIT_INTERVAL)); 
        }
      }
      console.log(properties, moment(properties.start).format(DATE_FORMAT), moment(properties.end).format(DATE_FORMAT));      
    });
  }<div id="timeline"/><iframe id={"timeline"} onLoad={() => loadTimeline(timelineData)} className={classes.outsource} src={"./timeline/index.html"}/>*/

  return (
    <div
      className     = {classes.timeLineContainer}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={classes.timeLineWrapper}>
        <div className={classes.container}>
          {
            timelineTab === 0 &&
            <div style={{position: 'relative', height: '100%'}}>
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }} 
                className={classes.scrollbar}>
                <div id="timeline"/>
              </PerfectScrollbar>
              <div className={classes.btnGroups}>
                <i className={classnames("fa fa-plus", classes.button)} id={"zoomIn"}/>
                <i className={classnames("fa fa-minus", classes.button)} id={"zoomOut"}/>
              </div>
            </div> 
          }
          {
            timelineTab === 1 && props.illustrationUrl && props.assets &&
            <div
              className={classes.outSourceWrapper}
            >
              <div className={classes.padding}>
                <iframe ref={ref} id={"outsource"} onLoad={() => checkMe(props.assets)} className={classes.outsource} src={props.illustrationUrl}/>
              </div>
            </div> 
          }
          {
            timelineTab === 2 && props.assetsOutsource.url &&
            <div className={classes.outSourceWrapper}>
              <div className={classes.padding}>
                <iframe className={classes.outsource} src={props.assetsOutsource.url} title={props.assetsOutsource.url}/>
              </div>
            </div>
          }
        </div>
        <div style={{marginBottom: 5}}>
          <TabsContainer
            activeTabId={timelineTab}
            setActiveTabId={activeTabChange}
            tabs={['Timeline', 'Illustration', 'USPTO']}
          />
        </div>
      </div>
      <FullWidthSwitcher
        show={showSwitcher}
        widget="timeline"
      />
    </div>
  );
}

const mapStateToProps = state => {  
  return {
    timeLine: state.patenTrack.timeLine,
    assetsOutsource: state.patenTrack.assetsOutsource,
    assets: state.patenTrack.assets,
    currentAsset: state.patenTrack.currentAsset,
    isLoading: state.patenTrack.timeLineLoading,
    timelineTab: state.patenTrack.timelineTab,
    illustrationUrl: state.patenTrack.illustrationUrl ? state.patenTrack.illustrationUrl : 'about:blank',
    selectedRFID: state.patenTrack.selectedRFID,
    currentAsset: state.patenTrack.currentAsset,
    add_years: state.patenTrack.add_years,
    nestGridTab: state.patenTrack.nestGridTab,
  };
};

const mapDispatchToProps = {
  getAssetsOutsource,
  getTimeLine,
  setTimelineTabIndex,
  setCurrentCollectionID,
  setCurrentAsset,
  setIllustrationUrl,
  getTimelineFilterWithDate,
  setTimeLine,
  setTimeLineLoading,
  cancelRequest
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeLineContainer);