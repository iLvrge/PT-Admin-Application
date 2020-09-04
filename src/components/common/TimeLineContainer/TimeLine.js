import moment from 'moment';
/*import assignmentTimeline from './TimeLine1';*/

function capitalFirstWord (value){
	const splitWord = value.toLowerCase().split(' ');
	return splitWord.map( w =>  w.substring(0,1).toUpperCase()+ w.substring(1)).join(' ');
}

/**
 * 
 * @param {Received timeline data from API} result 
 */

const modifyingData = (result) => {
  /*console.log('result:', result)*/
  var t0 = performance.now();
  console.log("Call Perfomance start " + t0 + " milliseconds.");
  let merger = [],
    mergerOut = [],
    employee = [],
    purchase = [],
    invented = [],
    assignment = [],
    sale = [],
    security = [],
    release = [],
    govern = [],
    correct = [],
    missing = [],
    other = [],
    namechg = [],
    items1 = [],
    items3 = [],
    groups3= [],
    groups= [],
    groupID = 0,
    rfID = 0,
    itemDates = [],
    itemIncrement = 1,
    mainGroup = "",
    allRFID = [];
  (async () => {
    if(result.assignment_assignors.length > 0){
      for(let i = 0; i < result.assignment_assignors.length; i++) {
        let name = result.assignment_assignors[i].normalize_name;
  
        if( name === '' || name === null) {
          name = result.assignment_assignors[i].raw_name;
        }
        name = capitalFirstWord(name);
        groupID = "";
        switch(result.assignment_assignors[i].convey_ty){
          case 'assignment':
  
            if(result.assignment_assignors[i].employer_assign === 1){
              groupID = "invented";
              if(!invented.includes( name )){
                invented.push( name );
              }
            } else {
              groupID = "purchased";
              if(!purchase.includes( name ) ) {
                purchase.push( name );
              }
            }
            /*
            if( !assignment.includes( name ) ){
              assignment.push( name );
              groupID = "assignment";
            }*/
            break;
          case 'correct':
            if( !correct.includes( name ) ){
              correct.push( name );
            }
            groupID = "correct";
            break;
          case 'employee':
            if( !employee.includes( name ) ){
              employee.push( name );
            }
            groupID = "employee";
            break;
          case 'govern':
            if( !govern.includes( name ) ){
              govern.push( name );
            }
            groupID = "govern";
            break;
          case 'merger':
            if( !merger.includes( name ) ){
              merger.push( name );
            }
            groupID = "merger";
            break;
          case 'missing':
            if( !missing.includes( name ) ){
              missing.push( name );
            }
            groupID = "missing";
            break;
          case 'namechg':
            if( !namechg.includes( name ) ){
              namechg.push( name );
            }
            groupID = "namechg";
            break;
          case 'other':
            if( !other.includes( name ) ){
              other.push( name );
            }
            groupID = "other";
            break;
          case 'security':
            if( !security.includes( name ) ){
              security.push( name );
            }
            groupID = "security";
            break;
          case 'release':
            if( !release.includes( name ) ){
              release.push( name );
            }
            groupID = "release";
            break;
        }
        //console.log(new Date(result.assignment_assignors[i].exec_dt), result.assignment_assignors[i].exec_dt);
        let start = moment(new Date(result.assignment_assignors[i].exec_dt));
        let end = start.clone().add(24, 'hours');
        let startFormatDate = start.format('MMM DD, YYYY');
        let content = [];
        /**List of Assignors for particular transactions */
        if(result.assignors.length > 0){
          for(let j =0; j < result.assignors.length; j++){
            if( result.assignors[j].rf_id === result.assignment_assignors[i].rf_id ){
              let assignorName = result.assignors[j].normalize_name;
  
              if( assignorName === '' || assignorName === null) {
                assignorName = result.assignors[j].raw_name;
              }
              content.push( capitalFirstWord(assignorName) );
            }
          }
        }
  
        if(result.assignment_assignors[i].rf_id > rfID){
          rfID = result.assignment_assignors[i].rf_id;
        }
        if(content.length > 0){
          itemDates.push(start.valueOf());   
          allRFID.push(result.assignment_assignors[i].rf_id);
          itemIncrement++;
          /**Add items to Group Level 2 */
          items3.push({
            id: itemIncrement,
            group: name,
            convey_ty: groupID,
            content_group: name,
            content: name.split(' ')[0] ,
            title: `<div><b>Date:</b> ${startFormatDate} </p><p><b>Type:</b> ${result.assignment_assignors[i].convey_ty} </p><p><b>Assignor:</b> <br/>${content.join('<div style="height:5px;">&nbsp;</div>')} </div>`,
            trans_id: result.assignment_assignors[i].id,
            rf_id: result.assignment_assignors[i].rf_id,
            start: start,
            end: end,
            type: 'point',
            className: result.className
          });
          itemIncrement++;
          mainGroup = "";

          /**Add items to Group Level 1 */
          /**|| groupID === "correct" */
          if(groupID === "release" || groupID === "security"){
            mainGroup = "main_security";
          } else if(groupID === "invented" || groupID === "employee" ) {
            mainGroup = "main_employer";
          } else if(groupID === "purchased" || groupID === "merger" || groupID === "mergerout" || groupID === "sale") {
            mainGroup = "main_ownership";
          } else if(groupID === "other" || groupID === "namechg" || groupID === "govern" || groupID === "missing" || groupID === "correct") {
            mainGroup = "main_other";
          }
          if(mainGroup != "") {            
            items1.push({
              id: itemIncrement,
              group: mainGroup,
              content:  name.split(' ')[0] ,
              title: `<div><b>Date:</b> ${startFormatDate} </p><p><b>Type:</b> ${result.assignment_assignors[i].convey_ty} </p><p><b>Assignor:</b> <br/>${content.join('<div style="height:5px;">&nbsp;</div>')} </div>`,
              trans_id: result.assignment_assignors[i].id,
              rf_id: result.assignment_assignors[i].rf_id,
              start: start,
              end: end,
              type: 'point',
              className: result.className
            });
            itemIncrement++;
          }
        }
      }
    }
    
    if(result.assignment_assignee.length > 0) {
      mainGroup = "";
      groupID = "";
      itemIncrement++;
      for(let i = 0; i < result.assignment_assignee.length; i++) {
        if(!allRFID.includes(result.assignment_assignee[i].rf_id)){
          allRFID.push(result.assignment_assignee[i].rf_id);
          let name = result.assignment_assignee[i].normalize_name;
    
          if( name === '' || name === null) {
            name = result.assignment_assignee[i].raw_name;
          }
          name = capitalFirstWord(name);
          switch(result.assignment_assignee[i].convey_ty){
            case 'release':
              if( !release.includes( name ) ){
                release.push( name );
              }
              groupID = "release";
              break;
            case 'security':
              if( !security.includes( name ) ){
                security.push( name );
              }
              groupID = "security";
              break;
            case 'merger':
              if( !mergerOut.includes( name ) ){
                mergerOut.push( name );
              }
              groupID = "mergerout";
              break;
            default:
              if( !sale.includes( name ) ){
                sale.push( name );
              }
              groupID = "sale";
              break;
          }
    
          let start = moment(new Date(result.assignment_assignee[i].exec_dt));
          let end = start.clone().add(24, 'hours');
          let startFormatDate = start.format('MMM DD, YYYY');
          let content = [];
    
          if(result.assignees.length > 0){
            for(let j =0; j < result.assignees.length; j++){
              if( result.assignees[j].rf_id === result.assignment_assignee[i].rf_id ){
                let assigneeName = result.assignees[j].normalize_name;
    
                if( assigneeName === '' || assigneeName === null) {
                  assigneeName = result.assignees[j].raw_name;
                }
                content.push( capitalFirstWord(assigneeName) );
              }
            }
          }
    
          if(result.assignment_assignee[i].rf_id > rfID){
            rfID = result.assignment_assignee[i].rf_id;
          }
          if(content.length > 0){
            itemDates.push(start.valueOf());

            itemIncrement++;         
            /**Add items to Group Level 2 */
            items3.push({
              id: itemIncrement,
              trans_id: result.assignment_assignee[i].id,
              rf_id: result.assignment_assignee[i].rf_id,
              group: name,
              convey_ty: groupID,
              content_group: name,
              content: name.split(' ')[0] ,
              title: `<div><b>Date:</b> ${startFormatDate} </p><p><b>Type:</b> ${result.assignment_assignee[i].convey_ty} </p><p><b>Assignee:</b> <br/>${content.join('<div style="height:5px;">&nbsp;</div>')} </div>`,
              start: start,
              end: end,
              type: 'point',
              className: result.className
            })
            itemIncrement++;
    
            /**Add items to Group Level 1   
             * || groupID === "correct"*/
            if(groupID === "release" || groupID === "security"){
              mainGroup = "main_security";
            } else if(groupID === "invented" || groupID === "employee" ) {
              mainGroup = "main_employer";
            } else if(groupID === "purchased" || groupID === "invented" || groupID === "merger" || groupID === "employee" || groupID === "mergerout" || groupID === "sale") {
              mainGroup = "main_ownership";
            } else if(groupID === "other" || groupID === "namechg" || groupID === "govern" || groupID === "missing" || groupID === "correct") {
              mainGroup = "main_other";
            }
            
            if(mainGroup != "") { 
              items1.push({
                id: itemIncrement,
                group: mainGroup,
                content: name.split(' ')[0],
                title: `<div><b>Date:</b> ${startFormatDate} </p><p><b>Type:</b> ${result.assignment_assignee[i].convey_ty} </p><p><b>Assignee:</b> <br/>${content.join('<div style="height:5px;">&nbsp;</div>')} </div>`,
                trans_id: result.assignment_assignee[i].id,
                rf_id: result.assignment_assignee[i].rf_id,
                start: start,
                end: end,
                type: 'point',
                className: result.className
              });
              itemIncrement++;
            }
          }
        }
      }
    }
  rfID += 1;
  var t1 = performance.now();
  console.log("Call Perfomance took " + (t1 - t0) + " milliseconds.");
  let group1 = rfID, group2 = rfID + 2, group3 = rfID + 3, group4 = rfID + 4;
  rfID += 4;
  /**Create Group level 1 */
  groups.push(
    {
      id: group1,
      title: "Employee",
      content: "Employee",
    },
    {
      id: group2,
      title: "Acquisition",
      content: "Acquisition",
    },
    {
      id: group3,
      title: "Security",
      content: "Security",
    },
    {
      id: group4,
      title: "Other",
      content: "Other",
    }
  );
  /** Checking group level2 to show nesting for group level 1*/

  if(invented.length > 0 || employee.length > 0) {
    groups[0]['nestedGroups'] = [];
    groups[0]['showNested'] = false;
    groups[0]['treeLevel'] = 1;
  }
  if(merger.length > 0 || mergerOut.length > 0 || purchase.length > 0 || sale.length > 0) {
    groups[1]['nestedGroups'] = [];
    groups[1]['showNested'] = false;
    groups[1]['treeLevel'] = 1;
  }
  if(security.length > 0 || release.length > 0) {
    groups[2]['nestedGroups'] = [];
    groups[2]['showNested'] = false;
    groups[2]['treeLevel'] = 1;
  }
  if(govern.length > 0 || missing.length > 0 || other.length > 0 || namechg.length > 0 || correct.length > 0) {
    groups[3]['nestedGroups'] = [];
    groups[3]['showNested'] = false;
    groups[3]['treeLevel'] = 1;
  }
  /**Invented */
  rfID += 1;
  if(invented.length > 0){
    invented.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'invented'
      });
      groups[0].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Employee */
  rfID += 1;
  if(employee.length > 0){
    employee.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'employee'
      });
      groups[0].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Merger In */
  rfID += 1;
  if(merger.length > 0){
    merger.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'merger'
      });
      groups[1].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Merger Out */
  rfID += 1;
  if(mergerOut.length > 0){
    mergerOut.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'mergerout'
      });
      groups[1].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Purchased */
  //console.log(purchase);
  rfID += 1;
  if(purchase.length > 0){
    purchase.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'purchased'
      });
      groups[1].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Sale */
  rfID += 1;
  if(sale.length > 0){
    sale.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'sale'
      });
      groups[1].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /** Security */
  rfID += 1;
  if(security.length > 0){
    security.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'security'
      });
      groups[2].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Release */
  rfID += 1;
  if(release.length > 0){
    release.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'release'
      });
      groups[2].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /***Govern */
  rfID += 1;
  if(govern.length > 0){
    govern.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'govern'
      });
      groups[3].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Correct */
  rfID += 1;
  if(correct.length > 0){
    correct.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'correct'
      });      
      groups[3].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /***Missing */

  rfID += 1;
  if(missing.length > 0){
    missing.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'missing'
      });
      groups[3].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /***Other */

  rfID += 1;
  if(other.length > 0){
    other.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'other'
      });
      groups[3].nestedGroups.push(rfID);
      rfID += 1;
    });
  }
  /**Name change */
  rfID += 1;
  if(namechg.length > 0){
    namechg.forEach( item => {
      groups3.push({
        id: rfID,
        treeLevel: 2,
        content: item,
        convey_ty: 'namechg'
      });
      groups[3].nestedGroups.push(rfID);
      rfID += 1;
    });
  }

  /** Updating Group ID */
  /*console.log("Items Before Updating",...items1);*/
  
    await items1.forEach( async ( item, index) => {
      let groupID = 0;
      switch(item.group){       
        case 'main_employer':
          groupID = group1;
          break;
        case 'main_ownership':
          groupID = group2;
          break;
        case 'main_security':
          groupID = group3;
          break;
        case 'main_other':
          groupID = group4;
          break;
      }
      items1[index].group = groupID;
    });
    /*await console.log("Items Before Update",...items1);
    //console.log("PURCHASED",purchaseID);
    await console.log("Items Before Update",...items3);*/

    if(groups3.length > 0){
      //console.log("Items3 Before Update",...groups3);
      /*console.log("Items Before Update",...items3);*/
      for(let k = 0 ; k < groups3.length; k++) {
        for(let l = 0; l < items3.length; l++) {
          if(items3[l].content_group === groups3[k].content && items3[l].convey_ty === groups3[k].convey_ty) {
            items3[l].group = groups3[k].id;
          }
        }
      }
      
      /*await groups3.forEach( async grpItem => {
        var objGroupindex = await items3.map((e,i) => (e.content_group === grpItem.content && grpItem.convey_ty == e.convey_ty) ? i : undefined).filter(x => x);
        if(objGroupindex.length > 0){
          objGroupindex.forEach( i => {
            items3[i].group = grpItem.id;
          });
        }
      });*/
      /*await console.log("Items3 After Update",...items3);
      await console.log(groups, groups3);*/
    }

  })();
  /*if(groups3.length > 0){
    groups3.forEach( grpItem => {
      var objGroupindex = items3.map((e,i) => e.group === grpItem.content ? i : undefined).filter(x => x);
      console.log("adada",...objGroupindex);
      if(objGroupindex.length > 0){
        objGroupindex.forEach( i => {
          items3[i].group = grpItem.id;
        });
      }
    });
  }*/
  /*console.log(groups, groups3,  rfID, items1, items3, itemDates);*/
  return {
    groups,
    groups3,
    items1,
    items3,
    itemDates
  }
};

export default modifyingData;