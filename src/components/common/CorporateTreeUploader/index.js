import React, { useState, useRef, forwardRef  } from "react";
import {connect} from 'react-redux';
import useStyles from "./styles";

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { treeFileUpload} from "../../../actions/patenTrackActions";



function CorporateTreeUploader(props) {
    const classes = useStyles();
    const formUploadRef = useRef();
    const frameRef = useRef();


    const htmlTreeFileChange = (uploadFrm) => {
        let form = new FormData(uploadFrm);
        props.treeFileUpload(form);
    }

    const frameLoaded = (frame) => {
        console.log(frame.contentWindow)
       frame.style.height = frame.parentElement.offsetHeight+'px';
    }

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
            <div
                className={classes.container}
            >
                <div className={classes.context}>
                    <Grid
                        container
                        className={classes.container}
                        style={{maxHeight: '50px', border: 0}}
                    >
                        <Grid
                        item lg={12} md={12} sm={12} xs={12}
                        className={classes.flexColumn}              
                        >
                            <form noValidate autoComplete="off" ref={formUploadRef} className={classes.form} onSubmit={e => { e.preventDefault(); }} encType={`multipart/form-data`}>
                                <Button
                                    variant="contained"
                                    component="label"
                                >
                                    Upload Tree HTML File
                                    <input
                                    name="file"
                                    type="file"
                                    style={{ display: "none" }}
                                    onChange={() => htmlTreeFileChange(formUploadRef.current)}
                                    />
                                </Button>
                            </form>
                        </Grid>
                    </Grid>
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
                                <iframe src={props.corporate_html_file} ref={frameRef} style={{width:'100%'}} onLoad={() => frameLoaded(frameRef.current)}></iframe>
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
    treeFileUpload
};

export default connect(mapStateToProps, mapDispatchToProps)(CorporateTreeUploader);