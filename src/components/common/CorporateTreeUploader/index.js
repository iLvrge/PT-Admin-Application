import React, { useEffect, useRef, useState  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import useMutationObserver from './hooks/useMutationObserver';

import { treeFileUpload, setUploadTreeFile, setSearchHeight, setTreeHeight} from "../../../actions/patenTrackActions";



function CorporateTreeUploader(props) {
    const classes = useStyles();
    const formUploadRef = useRef();
    const frameRef = useRef();

    const [isMutationObserverActive, setIsMutationObserverActive] = useState(false);

    useEffect(() => {
        if(props.corporate_html_file != "") {  
           setTimeout(() => {
            const targetNode = document.getElementById('observedNode');
            const allSpan = targetNode.querySelectorAll('span');
            allSpan.forEach(span => {
                span.addEventListener("click", () => {
                    if(span.className != "" && span.className.indexOf('selected') >= 0) {
                        const companyName = span.innerText;
                        const searchElement = document.getElementById('search_company');
                        searchElement.focus();
                        searchElement.value = companyName;                        
                    }
                } ,false);
            });
           }, 1000);
        }
    },[props.corporate_html_file]);

    const handleCloseTree = () => {
        props.setUploadTreeFile(false);
        props.setSearchHeight('100%');
        props.setTreeHeight('0%');
    }
/*
    useMutationObserver(isMutationObserverActive, mutations =>
        console.log('mutations', mutations)
    );*/

    const getChildData = childItems => {
        return childItems.map( childItemData => {
        let children = undefined;
        if (childItemData.child && childItemData.child.length > 0) {
            children = getChildData(childItemData.child);
        }
        const items = [];
        for(let i = 1; i <= childItemData.level; i++){
            items.push(<td className={i == childItemData.level ? '' : classes.width10}>{i == childItemData.level ? childItemData.name : ''}</td>)
        }
        return(
            <>
            <table className={classes.tableView}>
                <tbody>
                <tr>
                    {items}
                </tr>
                </tbody>
            </table>
            {
                childItemData.child.length > 0 ? getChildData(childItemData.child) : ''
            }
            </>
        )
        });
    };

    function CorporateTree(props){
        return(
            <div style={{overflow:'auto', height: props.height - 153}}>
                <table className={classes.tableView}>
                <tbody>
                    <tr>
                    <td className={classes.width10}></td>
                    <td className={classes.width10}></td>
                    <td>{props.data.name}</td>
                    </tr>
                </tbody>
                </table>
                {getChildData(props.data.child)}
            </div>
        )
    }

    return (
        <div
      className={classes.searchContainer}
        >
            <span  
                className     = {classes.switcher}
                onClick       = {handleCloseTree}><img src="/assets/images/inward_icon.svg" alt={''}/></span>
            <div
                className={classes.container}
            >
                <div className={classes.context}>                    
                    <div className={`search-list ${classes.scrollbar}`} >
                        <PerfectScrollbar
                            options={{
                            suppressScrollX: true,
                            minScrollbarLength: 20,
                            maxScrollbarLength: 25
                            }}
                        >
                            {
                                props.corporate_tree.length > 0
                                ?
                                <CorporateTree data={props.corporate_tree[0]} height={props.height} />
                                :
                                ''
                            }
                            {
                                props.corporate_html_file != ''
                                ?
                                
                                <div id={"observedNode"} dangerouslySetInnerHTML={{__html: props.corporate_html_file}} style={{height: props.height - 100,overflow: 'auto'}}/>
                                :
                                ''
                            }
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        </div>
    );
}


const mapStateToProps = state => {
    return {
        width: state.patenTrack.screenWidth,
        height: state.patenTrack.screenHeight,
        corporate_tree: state.patenTrack.corporate_tree,
        corporate_html_file: state.patenTrack.corporate_html_file,
    }
};

const mapDispatchToProps = {
    treeFileUpload,
    setUploadTreeFile,
    setSearchHeight,
    setTreeHeight
};

export default connect(mapStateToProps, mapDispatchToProps)(CorporateTreeUploader);