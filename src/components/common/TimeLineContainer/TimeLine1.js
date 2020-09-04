import moment from 'moment';
import { Timeline, DataSet } from "vis-timeline/standalone";
/*import "vis-timeline/styles/vis-timeline-graph2d.css";*/
/*import vis from "vis";
import Timeline from 'react-visjs-timeline';*/
import {base_api_url} from "../../../config/config";

import axios from 'axios';

let cloneTimelineItems1 = [],
    cloneTimelineItems3 = [],
    hideItems = [],
    cloneMainGroups = [],
    cloneGroup3 = [],
    pressInterval = 0,
    timeInterval = 50,
    itemDetails,
    currentItemID = 0,
    closeHover = 1;
  var timeline;

export default function assignmentTimeline(groups1, groups3, items1,  items3, itemDates, collectionID, assets, illustrationURL, outsource) {
  // DOM element where the Timeline will be attached
  cloneTimelineItems1 = [...items1];
  cloneTimelineItems3 = [...items3];
  cloneMainGroups = [...groups1];
  cloneGroup3 = [...groups3];

  const container = document.getElementById("timeline");
  container.innerHTML = '';
  let parentHeight = container.parentElement.clientHeight;
  /*console.log("parentHeight", parentHeight);*/
  if(parentHeight == 0) {
    parentHeight = 720;
  }
  let startDay = moment().startOf("month").startOf("week").isoWeekday(1);

   // create a data set with groups
  let groups = new DataSet();

  const newGroups = [...groups1, ...groups3];

  newGroups.forEach(group => groups.add(group));

  // create a dataset with items
  let items = new DataSet();
  items1.forEach(item => items.add(item));

  let min = new Date(Math.min(...itemDates));
  let max = new Date(Math.max(...itemDates));
  min = moment(min).clone().subtract(3, 'year');
  max = moment(max).clone().add(3, 'year');

  // specify options alignCurrentTime
  let options = {
    horizontalScroll: true,
    zoomKey: 'ctrlKey',
    orientation: 'both',
    zoomMin: 3456e5,
    min: min,
    max: max,
    start: min,
    end: max,
    tooltip: {
      followMouse: true,
      overflowMethod: 'cap'
    },  
    /*height: parentHeight+'px', */
    zoomFriction: 60,
    groupHeightMode: "fixed", /**['auto', 'fixed', 'fitItems'] */
    verticalScroll: true,
  };

  /**
   * Destroy timeline if already created before
   */
  if(typeof timeline != "undefined"){
    timeline.destroy();
  }
  // create a Timeline
  /*console.log(groups.getIds());*/
  timeline = new Timeline(container, items, groups, options);

  
  let btnZoomIn = document.getElementById('zoomIn');

  btnZoomIn.addEventListener('mouseover', () => {
    btnZoomIn.classList.add('hover');
  });

  btnZoomIn.addEventListener('mouseout', () => {
    btnZoomIn.classList.remove('hover');
    clearInterval(pressInterval);
  });

  btnZoomIn.addEventListener('mousedown', (e) => {
    /*console.log(e.button);*/
    if(e.button === 0){
      timeline.zoomIn( 0.2);
      clearInterval(pressInterval);
      pressInterval = setInterval(() => {
        if(btnZoomIn.classList.contains('hover')){
          timeline.zoomIn( 0.2);
        } else {
          clearInterval(pressInterval);
        }
      }, timeInterval);
    }
  });

  btnZoomIn.addEventListener('click', () => {
    clearInterval(pressInterval);
  });

  let btnZoomOut = document.getElementById('zoomOut');

  btnZoomOut.addEventListener('mouseover', () => {
    btnZoomOut.classList.add('hover');
  });

  btnZoomOut.addEventListener('mouseout', () => {
    btnZoomOut.classList.remove('hover');
    clearInterval(pressInterval);
  });

  btnZoomOut.addEventListener('mousedown', (e) => {
    /*console.log(e.button);*/
    if(e.button === 0){
      timeline.zoomOut( 0.2 );
      clearInterval(pressInterval);
      pressInterval = setInterval(() => {
        if(btnZoomOut.classList.contains('hover')){
          timeline.zoomOut( 0.2 );
        }
      }, timeInterval);
    } else {
      clearInterval(pressInterval);
    }
  });
  btnZoomOut.addEventListener('click', () => {
    clearInterval(pressInterval);
  });



  timeline.on('click', function (properties) {
    /*console.log(properties);*/
    ( async () => {
      /*console.log("properties",properties);*/
      if(properties.group !== null && properties.what == "group-label"){
        let group = groups.get(properties.group), groupName = group.content; 
        /*console.log("CLICKED", group);*/
        if(group.showNested === true) {
          if(group.nestedGroups !== null && group.nestedGroups !== undefined && group.nestedGroups.length > 0){            
            await items.forEach( item => {
              if(group.nestedGroups.includes(parseInt(item.group))){
                items.remove(item.id);
              }
            });
          }
          let getItemList = [];
          if(cloneTimelineItems1.length > 0){
            getItemList = await cloneTimelineItems1.map(item => item.group === group.id ? item: undefined).filter(x => x);
            /*console.log('1',getItemList,group.id,cloneTimelineItems1);*/
            if(getItemList !== undefined && getItemList.length > 0 ) {
              try{
                await getItemList.forEach( item => items.add(item));
              }catch(e){
              }
              //console.log("Added level 1 from 1");
            }            
          }

        } else {
          /*console.log("SHOWNESTED", false, cloneTimelineItems3);*/
          await hideItems.push(group.id);
          await items.forEach( item => {
            if(item.group === group.id){
              items.remove(item.id);
            }
          });
          if(cloneTimelineItems3.length > 0 && group.nestedGroups.length > 0){
            let getItemList = await  cloneTimelineItems3.map(item => group.nestedGroups.includes(parseInt(item.group)) ? item: undefined).filter(x => x);
            /*console.log(getItemList);*/
            if(getItemList !== undefined && getItemList.length > 0 ) {
              try{
                await  getItemList.forEach( item => items.add(item));
              } catch(e){
              }
              //console.log("Added level 3 from 3");
            }   
          }          
        }
      }
    })();
  });

  timeline.on('select', function (properties) {
    if(properties.items.length > 0) {
      const getItem = items.get(properties.items);
      closeHover = 1;
      disableIllustration(getItem[0]);
      callData(getItem[0], 1);
      closeHover = 0;
      callData(getItem[0], 0);
      collectionID(getItem[0].rf_id);
      assets("");
      illustrationURL("");
      outsource(0,getItem[0].rf_id);
    }    
  });
}

function callData(item, t) {
  /*console.log('callData:', item, t);*/
  let token = localStorage.getItem("token");
  if(item !== undefined && item.rf_id !== undefined && currentItemID !== item.rf_id){
    (async () => {
      axios.get(`${base_api_url}/assignment_details/`+item.rf_id, {
        headers: {'x-access-token': token}
      }).then(res => {
        itemDetails = res.data;
        currentItemID = item.rf_id;
        t === 0 ? callIllustration(): showDetails();
      });
    })();
  } else {
    t === 0 ? callIllustration(): showDetails();
  }
}

function disableIllustration(item) {
  document.getElementById('illustration_modal').classList.remove('show');
  /*console.log("item.rf_id ", item.rf_id , currentItemID);*/
  if(item !== undefined && typeof item.rf_id !== 'undefined' && currentItemID === item.rf_id){
    currentItemID = 0;
    let element = document.getElementById('illustration_modal');
    if(element.classList.contains('illustration_'+item.rf_id) && closeHover === 1){
      element.classList.remove('show');
      element.classList.remove('illustration_'+item.rf_id);
      element.classList.add('hide');
    }
  } else {
    let element = document.getElementById('illustration_modal');
    if(element.classList.contains('show')){
      element.classList.remove('show');
      element.classList.add('hide');
    }
  }
}

function callIllustration() {
  /*console.log("callIllustration");*/
  document.getElementById('illustration_container').classList.remove("d-none");
  let element = document.getElementById('illustration_modal');
  element.classList.remove('hide');
  element.classList.add('show');
  const timeline = document.getElementById("timeline");
  element.querySelector('.modal-content').style.top = timeline.getBoundingClientRect().top+'px';
  /*const recordTodoList = document.getElementsByClassName('record-todo-list');
  element.querySelector('.modal-content').style.right = recordTodoList[0].getBoundingClientRect().right+'px';*/
  /*console.log('illustration_'+currentItemID);  */
  element.classList.add('illustration_'+currentItemID);
  let iframe = document.getElementById('load_illustration_frame');
  iframe.style.display = "block";
  iframe.src = "about:blank";
  setTimeout(() => {
  let boxes = [], connections = [], execDate = '', execDate1 = '', fakeDate = '';
  if(itemDetails !== undefined && itemDetails.assignor.length > 0) {
    itemDetails.assignor.forEach( (assignor, index) => {
      let boxName = assignor.normalize_name;
      let assignorID = assignor.id;
      if( boxName  === '' || boxName == null) {
        boxName = assignor.or_name;
      }

      if(index === 0){
        execDate = moment(new Date(assignor.exec_dt)).format('MMM DD, YYYY');
        fakeDate = moment(new Date(assignor.exec_dt)).subtract(9, 'days');
      }
      let boxObj = {
        id: assignorID.toString(),
        name: boxName,
        execution_date: fakeDate.format('MMM DD, YYYY'),
        recorded_date: moment(new Date(itemDetails.assignment.record_dt)).format('MMM DD, YYYY'),
        document: "https://patentrack.com/resources/shared/data/assignment-pat-" + itemDetails.assignment.reel_no + "-" + itemDetails.assignment.frame_no +".pdf",
      }

      let type = "Ownership";
      let boxType = 0;
      let segment = 1;
      let inventorDetails, checkType = "";
      if(itemDetails.assignment.employer_assign === 1){
        boxType = 0;
        segment = 0;
        type = 'Inventor';
        checkType = 'Inventor';
      } else {
        checkType = "Ownership";
        type = "Ownership";
        segment = 1;
      }

      inventorDetails = itemDetails.box.filter( x => x.type === type ? x : '');
      if(inventorDetails !== ''){
        boxObj.type = type;
        boxObj.boxType = inventorDetails[0].id;
        boxObj.shape = inventorDetails[0].shape;
        boxObj.dimension = inventorDetails[0].dimension;
        boxObj.border_color = inventorDetails[0].border_color;
        boxObj.border_linepx = inventorDetails[0].border_px;
        boxObj.background_color = inventorDetails[0].background_color;
        boxObj.segment = segment.toString();
      }

      boxes.push(boxObj);

      if(itemDetails.assignee.length > 0){

        if(itemDetails.assignment.convey_ty === "security"){
          checkType = "Security";
          type = "Security";
          segment = 2;
        } else if(itemDetails.assignment.convey_ty === "release"){
          checkType = "Security";
          type = "Release";
          segment = 2;
        } else if(itemDetails.assignment.convey_ty === "namechg"){
          checkType = "Ownership";
          type = "Name Change";
          segment = 1;
        } else if(itemDetails.assignment.convey_ty === "assignment"){
          checkType = "Ownership";
          type = "Ownership";
          segment = 1;
        } else if(itemDetails.assignment.convey_ty === "correct"){
          checkType = "Ownership";
          type = "Ownership";
          segment = 1;
        }

        itemDetails.assignee.forEach( assignee => {

          if( index === 0) {
            boxName = assignee.normalize_name;


            if( boxName  === '' || boxName == null) {
              boxName = assignee.ee_name;
            }


            boxObj = {
              id: assignee.id.toString(),
              name: boxName,
              execution_date: execDate,
              recorded_date: moment(new Date(itemDetails.assignment.record_dt)).format('MMM DD, YYYY'),
              document: "https://patentrack.com/resources/shared/data/assignment-pat-" + itemDetails.assignment.reel_no + "-" + itemDetails.assignment.frame_no +".pdf",
            }

            inventorDetails = itemDetails.box.filter( x => x.type === checkType ? x : '');
            if(inventorDetails !== ''){
              boxObj.type = type;
              boxObj.boxType = inventorDetails[0].id;
              boxObj.shape = inventorDetails[0].shape;
              boxObj.dimension = inventorDetails[0].dimension;
              boxObj.border_color = inventorDetails[0].border_color;
              boxObj.border_linepx = inventorDetails[0].border_px;
              boxObj.background_color = inventorDetails[0].background_color;
              boxObj.segment = segment.toString();
            }
            boxes.push(boxObj);
          }
          //boxes[boxes.length] = boxObj

          let connectionLine = itemDetails.line.filter( x => x.tooltip === type ? x : '');
          if(connectionLine !== '') {
            let lineType = "Solid";
            if(connectionLine[0].line_type === 1){
              lineType = "Dashed";
            }
            let commentObj = {};
            commentObj[itemDetails.assignment.reel_no + "-" +  itemDetails.assignment.frame_no] = ["",""];
            connections.push({"id":assignee.id,"assignment_no1":1,"color":connectionLine[0].color,"type":type,"type_line":lineType,"ref_id":assignee.rf_id,"start_id":assignorID,"end_id":assignee.id,"box_creator_id":0,"box_creator_id2":0,"popup":[itemDetails.assignment.reel_no + "-" +  itemDetails.assignment.frame_no],"comment":[commentObj],"user_files":[""],"tooltip":connectionLine[0].tooltip,"date":execDate,"document1":"https://patentrack.com/resources/shared/data/assignment-pat-"+itemDetails.assignment.reel_no + "-" +  itemDetails.assignment.frame_no+".pdf","document2":"","note1":"","pdf1":"","note2":"","pdf2":"","popuptop":itemDetails.assignment.reel_no + "-" +  itemDetails.assignment.frame_no,"popupbottom":""});
          }
        });
      }
    });    

    iframe.src = "./d3/index.html";
    const illustrationData = {
      box: boxes,
      connection: connections, 
      line: connections, 
      all_boxes: itemDetails.box, 
      legend: itemDetails.line, 
      box_menu: { 
        border_color:["#e8665d","#e8a41c","#c1ed0e","#ed0e2f"], 
        background_color:["#fae3e3","#f5f5d7","#d7f0f5","#f5d7dc"]}, 
        general:{"background": "#000000" ,
        patent_number:"", 
        original_number: "", 
        logo_1:"",
        logo_2:"",
        copyright:""
      },
      popup:[],
      comment:""
    };    
    loadIllustrationIframeData(illustrationData, fakeDate );
  }
  }, 200);
}

function loadIllustrationIframeData(illustrationData, fakeDate) {
	let iframe = document.getElementById('load_illustration_frame');
	if(typeof iframe.contentWindow != 'undefined' && iframe.contentWindow != null && typeof iframe.contentWindow.renderData == "function"){
		const element = iframe.contentDocument;	
		if(element != null) {
			const container = element.querySelector("#container");
			iframe.contentWindow.renderData(illustrationData);
			const menuItem = element.querySelector('.menu');
			if(menuItem != null ){
				menuItem.remove();
        iframe.contentWindow.removeFakeDates(fakeDate.format('DD MMM YYYY'),fakeDate.format('YYYY-MM-DD'));
        iframe.contentWindow.applyZoomFunction();
				const svg = container.querySelector('svg');
				let widthSvg = svg.getAttribute('width');
				let heightSvg = svg.getAttribute('height');
				widthSvg = parseInt(widthSvg) + 30;
				heightSvg = parseInt(heightSvg) + 30;
				iframe.style.width = 500;
				iframe.style.height = 400;
			}
		}
	} else {
		setTimeout(() => {
			loadIllustrationIframeData(illustrationData, fakeDate)
		}, 300);
	}
}

function showDetails() {
  const commentContainer = document.getElementById('comment_container');
  const illustrationContainer = document.getElementById('illustration_container');
  if( commentContainer != null) {
    commentContainer.classList.remove("d-none");
  }
  if( illustrationContainer != null) {
    illustrationContainer.classList.remove("d-none");
  }
}