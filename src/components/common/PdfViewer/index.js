import React, { useState } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';

import useStyles from "./styles";
import FullWidthSwitcher from "../FullWidthSwitcher";
import TabsContainer from "../Tabs";
import {connect} from 'react-redux';
import { setPdfTabIndex } from "../../../actions/patenTrackActions";

let pdfFile = "";

function PdfViewer(props) {
  const { pdfTab, setPdfTabIndex } = props;
  const classes = useStyles();
  const [showSwitcher, setShowSwitcher] = useState(0);
  
  console.log("props.display", props.display);
  const checkHeight = (t) => {
    /*console.log("t", t);
    console.log("window.innerHeight", window.innerHeight);*/
    const containerName = t == 1 ? "iframe_agreement" : "iframe_form";
    const iframeElement = document.getElementById(containerName);
    const parentElement = document.getElementById("pdfViewer");
    const height = window.innerHeight - 111;
    iframeElement.style.height = height + "px";
    parentElement.style.height = height + "px";
  };
  let fullView = "";
  if(props.display == 'true') {
    fullView = classes.fullView;
  }

  const closeViewer = () => {
    const element = document.getElementById("pdfViewer");
    element.parentElement.parentElement.style.display = 'none';
    element.querySelector('#iframe_agreement').setAttribute('src', '');
    element.style.display = 'none';
  }
  return (
    <div
      className     = {classes.pdfContainer}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={`${classes.pdfWrapper} ${fullView}`} id={"pdfViewer"}  style={{display: props.display == 'true' ? 'block' : 'none'}}>
        <span className={classes.close} onClick={closeViewer}><i className={"fal fa-times-circle"}></i></span>
        <div className={classes.container}>
          {
            pdfTab === 0 &&
            <div style={{position: 'relative', height: '100%'}}>
              <PerfectScrollbar
                options={{
                  suppressScrollX: true,
                  minScrollbarLength: 30,
                  maxScrollbarLength: 50,
                }}
                className={classes.scrollbar}>
                 <iframe id={"iframe_agreement"} title='agreement iframe' onLoad={() => checkHeight(1)} className={classes.outsource} src={pdfFile !== "" && pdfFile !== undefined ? pdfFile.replace(".pdf","_agreement.pdf") : 'about:blank'}/>
              </PerfectScrollbar>              
            </div>
          }
          {
            pdfTab === 1 &&
            <div>
              <div >
                <iframe id={"iframe_form"} title='form iframe' className={classes.outsource} onLoad={() => checkHeight(2)} src={pdfFile !== "" && pdfFile !== undefined ? pdfFile.replace(".pdf","_form.pdf") : 'about:blank'}/>
              </div>
            </div>
          }          
        </div>
        <div style={{marginBottom: 5}}>
          <TabsContainer
            activeTabId={pdfTab}
            setActiveTabId={setPdfTabIndex}
            tabs={['Agreement', 'Form']}
          />
        </div>
      </div>
      <FullWidthSwitcher
        show={showSwitcher}
        widget="agreement"
      />
    </div>
  );
}


const mapStateToProps = state => {
    if(window.pdf !== '') {
        pdfFile = window.pdf
    }
    return {
      pdfTab: state.patenTrack.pdfTab
    };
};

const mapDispatchToProps = {
    setPdfTabIndex
};

export default connect(mapStateToProps, mapDispatchToProps)(PdfViewer);
