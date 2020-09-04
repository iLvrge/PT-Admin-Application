import moment from 'moment';
import { Timeline, DataSet } from "vis-timeline/standalone";
import {base_new_api_url} from "../../../config/config";

import axios from 'axios';

let pressInterval = 0, timeInterval = 50, itemDetails,
    currentItemID = 0,
    closeHover = 1;

let timeline;

export const assignmentTimeline = ( itemList, itemDates, collectionID, assets, illustrationURL, outsource, addYears) => {
    // DOM element where the Timeline will be attached
    const container = document.getElementById("timeline");
    container.innerHTML = '';
    let parentHeight = container.parentElement.clientHeight;
    
    if(parentHeight == 0) {
        parentHeight = 720;
    }
    
    // create a dataset with items
    var items = new DataSet();

    items.add(itemList);

    let min = new Date(Math.min(...itemDates));
    let max = new Date(Math.max(...itemDates));
    
    min = moment(min).clone();
    max = moment(max).clone().add(2,"days");

  // specify options alignCurrentTime
    let options = {
        horizontalScroll: true,
        zoomKey: 'ctrlKey',
        orientation: 'both',
        zoomMin: 3456e5,
        stack: true,
        groupOrder: 'content',
        tooltip: {
            followMouse: true,
            overflowMethod: 'cap'
        },  
        height: parentHeight+'px', 
        zoomFriction: 60,
        groupHeightMode: "fixed", /**['auto', 'fixed', 'fitItems'] */
        verticalScroll: true,
    };   

    const orderedItems = items.get({fields: ['start'], order: 'start'})
    const lastRangeItem = orderedItems[items.length - 1]
    const fistRangeIndex = items.length > 100 ? (items.length - 100) : 0  
    const firstRangeItem = orderedItems[fistRangeIndex]

    
    if(items.length > 0) {
        // options.min = new Date(min);        
        // options.max = new Date(max);                
        options.start = new Date(firstRangeItem.start);
        options.end = new Date(lastRangeItem.start);
    }
    // create a Timeline
    timeline = new Timeline(container, items, options);

    let btnZoomIn = document.getElementById('zoomIn');

    btnZoomIn.addEventListener('mouseover', () => {
        btnZoomIn.classList.add('hover');
    });

    btnZoomIn.addEventListener('mouseout', () => {
        btnZoomIn.classList.remove('hover');
        clearInterval(pressInterval);
    });

    btnZoomIn.addEventListener('mousedown', (e) => {
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

    /**Clicking on item */

    timeline.on('select', function (properties) {
        if(properties.items.length > 0) {
          const getItem = items.get(properties.items);
          closeHover = 1;
          disableIllustration(getItem[0]);
          callData(getItem[0], 1);
          closeHover = 0;
          callData(getItem[0], 0);
          collectionID(getItem[0].id);
          assets("");
          illustrationURL("");
          outsource(0,getItem[0].id);
        }    
    });
}

export const timelineOnChange = () =>{
    if(timeline) {
        return timeline;
    } 
}
const getCookie = (name)=> {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

/**Get item data */

function callData(item, t) {    
    let token = localStorage.getItem("token");
	if(token == null) {
	  token = getCookie('token');
	}
    if(item !== undefined && item.id !== undefined && currentItemID !== item.id){
      (async () => {
        axios.get(`${base_new_api_url}/collections/${item.id}/illustration`, {
          headers: {'x-access-token': token}
        }).then(res => {
          itemDetails = res.data;
          currentItemID = item.id;
          t === 0 ? callIllustration(): showDetails();
        });
      })();
    } else {
      t === 0 ? callIllustration(): showDetails();
    }
}
  
function disableIllustration(item) {
    document.getElementById('illustration_modal').classList.remove('show');    
    if(item !== undefined && typeof item.id !== 'undefined' && currentItemID === item.id){
      currentItemID = 0;
      let element = document.getElementById('illustration_modal');
      if(element.classList.contains('illustration_'+item.id) && closeHover === 1){
        element.classList.remove('show');
        element.classList.remove('illustration_'+item.id);
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

/**Illustration box */

function callIllustration() {
    document.getElementById('illustration_container').classList.remove("d-none");
    let element = document.getElementById('illustration_modal');
    element.classList.remove('hide');
    element.classList.add('show');
    const timeline = document.getElementById("timeline");
    element.querySelector('.modal-content').style.top = timeline.getBoundingClientRect().top+'px';
    element.classList.add('illustration_'+currentItemID);
    let iframe = document.getElementById('load_illustration_frame');
    iframe.style.display = "block";
    iframe.src = "about:blank";
    setTimeout(() => {
        if(itemDetails !== undefined && itemDetails.box.length > 0) {
            callOutsideClick();
            iframe.src = "./d3/index.html";               
            loadIllustrationIframeData(itemDetails, itemDetails.fakeDate );        
        }
    }, 200);
}

/**Load ifram for the d3 illustration */

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

function callOutsideClick() {
    
    window.addEventListener("click", function(event) {
        const modal = document.getElementById('illustration_modal');
        console.log(event, event.target);
        if (event.target === modal) {
          modal.classList.remove('show');
          modal.querySelector("iframe").setAttribute('src', 'about:blank');
          window.pdf = '';
        } 
    });
}

function showDetails() {
    let commentContainer = document.getElementById('comment_container');
    const illustrationContainer = document.getElementById('illustration_container');
    if( commentContainer != null) {
        commentContainer.classList.remove("d-none");
    }
    if( illustrationContainer != null) {
        illustrationContainer.classList.remove("d-none");
    }
}

