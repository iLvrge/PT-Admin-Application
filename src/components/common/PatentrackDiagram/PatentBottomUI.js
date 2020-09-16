import React from 'react'
import ReactDOM from 'react-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faFilter, faList, faShareAlt, faChevronUp, faChevronDown, faFastBackward, faFastForward, faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
    
import * as d3 from 'd3'

class PatentBottomUI extends React.Component {
    
  constructor(props_) {
       
    super(props_);
    this.wrapperRef = React.createRef();
      
    this.state = { expand: true, filters: false, legend: false };
    this.update = this.update.bind(this);
    this.filtersExpanded = false;
    this.legendExpanded = false;
    this.showPopup = this.showPopup.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
      
    this.filtersHandler = React.createRef();
    this.filtersPopup = React.createRef();
    this.legendHandler = React.createRef();
    
         
  }
    
  componentDidMount() { 
      
      document.addEventListener('mousedown', this.handleClickOutside);
      
  }

  componentWillUnmount() { 
      
      document.removeEventListener('mousedown', this.handleClickOutside); 
  
  }
    
  update () {
    
    this.setState({ expand: !this.state.expand });

  }
    
  showPopup(e_){
                
       if(e_.target.id == 'PatentrackMultiCheckbox' || e_.target.parentElement.id == 'PatentrackMultiCheckbox'){
           
            this.setState({ filters: true, legend: false });
       
       }
       else if(e_.target.id == 'PatentrackLegend' || e_.target.parentNode.id == 'PatentrackLegend' ){
        
            
            this.setState({ filters: false, legend: true });

       }
            
  }
    
  hidePopup(e_){
   
        this.setState({ filters: false, legend: false });
      
  }
    
  handleClickOutside(e_) {
      
    
    if(this.wrapperRef && !this.wrapperRef.current.contains(e_.target)) {

        this.setState({ filters: false, legend: false });
               
    }
      
  }

  render () {
            
    let showFilters = this.state.filters ? { display: 'inline-block', transform: 'translate(0%, -55%)' } : { display: 'none' };
    let showLegend = this.state.legend ? { display: 'inline-block', transform: 'translate(0%, -55%)' } : { display: 'none' };

    let legend = Object.keys(this.props.colorScheme).map((category_, i_) =>{
        
        let legendElement = (category_.charAt(0).toUpperCase() + category_.slice(1)).replace(/([A-Z])/g, ' $1').trim();
        let hex = this.props.colorScheme[category_];
        
        return (
            
            <li key={'PatentrackDiagramLegendElement_' + i_} style={{textAlign: 'left', color: hex}}><label>{legendElement}</label></li>
            
        )
        
    });

    return this.state.expand ? (
        
            <div ref={this.wrapperRef} id='bottomUIToolbarContainer' style={{ bottom: this.props.toolbarBottom, width: this.props.width  + 'px' }}>
                <div id='bottomUIToolbarExpanded'>
                    <div id='toolbarUIGap0' className='toolbarUIGap'></div>
                    <div id='expandOnOff' className='toolbarUIElement' onClick={this.update}><FontAwesomeIcon title='toolbar is on' icon={faChevronUp}/></div>
                    <div id='toolbarUIGap1' className='toolbarUIGap'></div>
                    <div id='fastBackward' className='toolbarUIElement'><FontAwesomeIcon title='go to start' icon={faFastBackward} onClick={this.props.update}/></div>
                    <div id='fastForward' className='toolbarUIElement'><FontAwesomeIcon title='go to end' icon={faFastForward} onClick={this.props.update}/></div>
                    <div id='toolbarUIGap2' className='toolbarUIGap'></div>
                    <div id='prevAssignment' className='toolbarUIElement'><FontAwesomeIcon title='go to previous assignment' icon={faAngleDoubleLeft} onClick={this.props.update}/></div>
                    <div id='assignmentQuantative' className='toolbarUIQuantative'>{this.props.quantatives.assignment.current} / {this.props.quantatives.assignment.total}</div>
                    <div id='nextAssignment' className='toolbarUIElement'><FontAwesomeIcon title='go to next assignment' icon={faAngleDoubleRight} onClick={this.props.update}/></div>
                    <div id='toolbarUIGap3' className='toolbarUIGap'></div>
                    <div id='prevAssignee' className='toolbarUIElement'><FontAwesomeIcon title='go to previous assignee' icon={faAngleLeft} onClick={this.props.update}/></div>
                    <div id='assigneeQuantative' className='toolbarUIQuantative'>{this.props.quantatives.assignee.current} / {this.props.quantatives.assignee.total}</div>
                    <div id='nextAssignee' className='toolbarUIElement'><FontAwesomeIcon title='go to next assignee' icon={faAngleRight} onClick={this.props.update}/></div>
                    <div id='toolbarUIGap4' className='toolbarUIGap'></div>
                    <div id='PatentrackMultiCheckbox' ref={this.filtersHandler} className='toolbarUIElement' onMouseEnter={this.showPopup} onMouseLeave={this.hidePopup} onClick={this.showPopup}>
                    <FontAwesomeIcon title='go to filters' icon={faFilter}/>
                    <div id='PatentrackFilters' ref={this.filtersPopup} className='toolbarUIPopup' style={showFilters}>
                        <ul>
                            <li><label title='ownership filter is on'><input type='checkbox' id='Ownership' onChange={this.props.update} defaultChecked='true' /><span>Ownership</span></label></li>
                            <li><label title='security filter is on'><input type='checkbox' id='Security' onChange={this.props.update} defaultChecked='true' /><span>Security</span></label></li>
                            <li><label title='release filter is on'><input type='checkbox' id='Release' onChange={this.props.update} defaultChecked='true' /><span>Release</span></label></li>
                            <li><label title='license filter is on'><input type='checkbox' id='License' onChange={this.props.update} defaultChecked='true' /><span>License</span></label></li>
                            <li><label title='license End filter is on'><input type='checkbox' id='LicenseEnd' onChange={this.props.update} defaultChecked='true' /><span>License End</span></label></li>
                        </ul>
                     </div> 
                    </div>
                    <div id='toolbarUIGap5' className='toolbarUIGap'></div>
                    <div id='PatentrackLegend' ref={this.legendHandler} className='toolbarUIElement' onMouseEnter={this.showPopup} onMouseLeave={this.hidePopup}  onClick={this.showPopup}>
                    <FontAwesomeIcon title='go to legend' icon={faList}/>
                    <div id='PatentrackLegend' className='toolbarUIPopup' style={showLegend}>
                        <ul>
                            {legend}
                        </ul>
                    </div> 
                    </div>
                    <div id='toolbarUIGap6' className='toolbarUIGap'></div>
                    <div id='horizontalExtenderA' className='toolbarUIElement'></div>
                    <div id='horizontallExtenderB' className='toolbarUIElement'></div>
                    <div id='zoomDiagram' className='toolbarUIElement'></div>
                    <div id='toolbarUIGap7' className='toolbarUIGap'></div>
                    <div id='commentDiagram' className='toolbarUIElement'><FontAwesomeIcon title='comment diagram' icon={faComment} onClick={() => this.props.comment(this.props.commentContent)}/></div>
                    <div id='shareDiagram' className='toolbarUIElement'><FontAwesomeIcon title='share diagram' icon={faShareAlt} onClick={() => this.props.share(this.props.patent)}/></div>
                </div>
             </div>

        ) :
    
        (
        
            <div ref={this.wrapperRef} id='bottomUIToolbarContainer' style={{ bottom: this.props.toolbarBottom }}>
                <div id='bottomUIToolbarClosed'>
                    <div id='toolbarUIGap0' className='toolbarUIGap'></div>
                    <div id='expandOnOff' className='toolbarUIElement' onClick={this.update}><FontAwesomeIcon title='toolbar is on' icon={faAngleRight}/></div>
                </div>
            </div>

        )
        
  }
    
}

export default PatentBottomUI;