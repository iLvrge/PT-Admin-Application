import React, { useState, useEffect } from "react";
import {connect} from 'react-redux';
import useStyles, { useMatStyles } from "./styles";
import FullWidthSwitcher from "../FullWidthSwitcher";
import PerfectScrollbar from 'react-perfect-scrollbar';
import classnames from 'classnames';
import Loader from "../Loader";
import TabsContainer from "../Tabs";
import CustomTab from "../CustomTab";
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import {getErrorItems, setFixItTabIndex, setCurrentCollectionID,
  setCurrentAsset,
  setCurrentAssetType,
  setIllustrationUrl,
  getComments,
  getAssetsOutsource,
  getAssets,
  getCollectionIllustration,setTimelineTabIndex} from "../../../actions/patenTrackActions";


const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const  getComparator = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const stableSort = (array, comparator)=>{
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const classesMat = useMatStyles();
  const headCells = [
    { id: 'id', numeric: true, disablePadding: false, label: '#' },
    { id: 'asset', numeric: false, disablePadding: false, label: 'Asset' },
    { id: 'comment', numeric: false, disablePadding: false, label: 'Comment' },
    { id: 'firm_name', numeric: false, disablePadding: false, label: 'Company Name' },
    { id: 'telephone', numeric: false, disablePadding: false, label: 'Telephone' },
    { id: 'created_at', numeric: false, disablePadding: false, label: 'Created At' },
  ];


  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className={classesMat.tablehHeaderRow}>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            className={classnames(classesMat.tableHeader) }
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}



function FixItemsContainer(props) {
  const { fixitTab, setFixItTabIndex } = props;
  const classes = useStyles();
  const isExpanded = props.currentWidget === 'fixItems';
  const [showSwitcher, setShowSwitcher] = useState(0);
  const [toDoFixItemList, setToDoFixItemList] = useState([]);
  const [sortDate, setSortDate] = useState('asc');
  const [sortAsset, setSortAsset] = useState('asc');
  const [sortName, setSortName] = useState('asc');
  const [itemList, setItemList] = useState([]);
  const [errorList, setErrorList] = useState([]);
  const [currentRecords, setCurrentRecords] = useState(0);
  const [toDoInventItemList, setToDoInventList] = useState([]); 
  const [toDoAssignItemList, setToDoAssignItemList] = useState([]);
  const [toDoCorrItemList, setToDoCorrItemList] = useState([]);
  const [toDoAddressItemList, setToDoAddressItemList] = useState([]);
  const [toDoSecurityItemList, setToDoSecurityItemList] = useState([]);
  
  const classesMat = useMatStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('Asset');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const errorsType = ['Uspto', 'Patents', 'Total'];

  const [counter, setCounter] = useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  const  sortMe = (e) =>{
    const col = e.target.getAttribute('data-col');
    const direction = e.target.getAttribute('data-sort');
    const type = e.target.getAttribute('data-type');
    const newItems = [...props.fixItemList[type]];
    switch(col) {
      case 'created_at': 
        newItems.sort((a, b) => {
          var key = new Date(a.created_at);
          var key1 = new Date(b.created_at);
          if (key < key1) {
            return direction === 'asc' ? -1 : 1;
          }
          if (key > key1) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        }); 
        break;
      case 'asset':
        newItems.sort((a, b) => {
          if (a[col] < b[col]) {
            return direction === 'asc' ? -1 : 1;
          }
          if (a[col] > b[col]) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
        break;
      case 'name':
        newItems.sort((a, b) => {
          var key = a.company_lawyer.first_name;
          var key1 = b.company_lawyer.first_name;
          if (key < key1) {
            return direction === 'asc' ? -1 : 1;
          }
          if (key > key1) {
            return direction === 'asc' ? 1 : -1;
          }
          return 0;
        }); 
        break;
    }
    col === 'created_at' ? setSortDate(direction=== 'asc' ? 'desc' : 'asc') : col === 'asset' ? setSortAsset(direction=== 'asc' ? 'desc' : 'asc') : setSortName(direction=== 'asc' ? 'desc' : 'asc') ;
    setItemList(Object.assign({}, {
      ...props.fixItemList,
      [type]: newItems
    }))
  }
  
  function CustomHeader(props){
    return (
      <TableContainer>
        <Table aria-labelledby="Table Heading"
          size={'small'}
          aria-label="Table Heading"
          className={classes.sortTable}
        >
          <TableHead>
            <TableRow>
              <TableCell align="left" onClick={sortMe} data-type={props.type} data-col={'created_at'} data-sort={sortDate}>Date</TableCell>
              <TableCell align="center" onClick={sortMe} data-type={props.type} data-col={'asset'} data-sort={sortAsset}>Asset</TableCell>
              <TableCell align="right" onClick={sortMe} data-type={props.type} data-col={'name'} data-sort={sortName}>Lawyer</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    );
  }

  useEffect(() => {
    let totalRecord = props.fixItemCount.uspto + props.fixItemCount.patent;
    setCounter(totalRecord);
    if(props.fixItemList && props.fixItemList['invent'].length > 0){     
      setCurrentRecords(props.fixItemList['invent'].length);      
      setToDoInventList(props.fixItemList['invent']);
    }
    if(props.fixItemList && props.fixItemList['assign'].length > 0){      
      const toDoAssignItems = props.fixItemList['assign'].map(item => ({
        id: item.error_id,
        asset: item.appno_doc_num,          
        name: item.name, 
        created_at: new Intl.DateTimeFormat('en-US').format(new Date(item.record_dt))
      }));
      setToDoAssignItemList(toDoAssignItems); 
    }
    if(props.fixItemList && props.fixItemList['corr'].length > 0){      
      const toDoCorrItems = props.fixItemList['corr'].map(item => ({
        id: item.error_id,
        asset: item.appno_doc_num,          
        name: item.name, 
        created_at: new Intl.DateTimeFormat('en-US').format(new Date(item.record_dt))
      }));
      setToDoCorrItemList(toDoCorrItems);
    }
    if(props.fixItemList && props.fixItemList['address'].length > 0){      
      const toDoAddressItems = props.fixItemList['address'].map(item => ({
        id: item.error_id,
        asset: item.appno_doc_num,          
        name: item.name, 
        created_at: new Intl.DateTimeFormat('en-US').format(new Date(item.record_dt))
      }));
      setToDoAddressItemList(toDoAddressItems);
    }
    if(props.fixItemList && props.fixItemList['security'] &&  props.fixItemList['security'].length > 0){      
      const toDoSecurityItems = props.fixItemList['security'].map(item => ({
        id: item.error_id,
        asset: item.appno_doc_num,          
        name: item.name, 
        created_at: new Intl.DateTimeFormat('en-US').format(new Date(item.record_dt))
      }));
      setToDoSecurityItemList(toDoSecurityItems);
    }
  },[props.fixItemList, props.fixItemCount]);

  const openTimelineIllustration = (event) => {
    /*console.log("Illustration", event.target.parentElement.parentElement, event.currentTarget);*/
    let pElement =  event.currentTarget;
    if(pElement.getAttribute('data-subject') != null && pElement.getAttribute('data-subject') != undefined) {
      const subject = pElement.getAttribute('data-subject');
      props.setCurrentCollectionID('');
      props.setCurrentAsset(subject);  
      props.setCurrentAssetType(0);
      props.setIllustrationUrl('about:blank');
      props.getComments(0, subject);
      props.getAssetsOutsource(1, subject);
      props.getAssets(subject);
      props.setTimelineTabIndex(1);
    }
  }

  const renderItemList = ( type ) => {
    const items = type == 'invent' ? toDoInventItemList : type == 'assign' ? toDoAssignItemList : type == 'corr' ? toDoCorrItemList : type == 'address' ? toDoAddressItemList : toDoSecurityItemList;
    
    if(!isExpanded) {
      return (
      <div className={`todo-list ${classes.column}`}>
        {
          items
          ?            
          <Table
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="short table"
            className={classes.sortTable}
            stickyHeader
          >        
          <TableHead>
            <TableRow>
              <TableCell align="center" onClick={sortMe} data-type={type} data-col={'created_at'} data-sort={sortDate}>Date</TableCell>
              <TableCell align="center" className={classes.fixedColumn} onClick={sortMe} data-type={type} data-col={'asset'} data-sort={sortAsset}>Asset</TableCell>
              <TableCell align="center" onClick={sortMe} data-type={type} data-col={'name'} data-sort={sortName}>Lawyer</TableCell>
            </TableRow>
          </TableHead>    
          <TableBody> 
            {
              items.map(item => {
				      const createdAt = item.created_at != '00/00/0000' ? new Date(item.created_at) : '00-00-0000';
                return (
                  <TableRow hover tabIndex={-1} key={item.id} onClick={openTimelineIllustration} data-subject={item.asset}>
                    <TableCell align="center">
                      <span className={`white ${classnames(classes.displayBlock, classes.ellipsis)}`}>{createdAt != '00-00-0000' ? new Intl.DateTimeFormat('en-US').format(createdAt) : '00-00-0000'}</span>
                    </TableCell>
                    <TableCell align="center" className={classes.fixedColumn}>                      
                      <span className={`grey ${classnames(classes.displayBlock, classes.ellipsis, classes.width100)}`}>{item.asset}</span>
                    </TableCell>
                    <TableCell align="center">
                      <span className={`grey ${classnames(classes.displayBlock, classes.ellipsis)}`}>{`<p>${item.name}</p><p>${item.lawyer_name}</p>`}</span>
                    </TableCell>
                  </TableRow>
                );
              })
            }         
          </TableBody>
        </Table>
        :
        ''
        }
      </div>);
    }
    return (
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >            
          </Table>
        </TableContainer>
    );
  };

  let classFull = "";
  if(props.display == 'true'){
    classFull = classes.expandMode;
  }

  return (
    <div
      className     = {classes.fixItemsContainer}
      onMouseOver   = {() => {setShowSwitcher(true)}}
      onMouseLeave  = {() => {setShowSwitcher(false)}}
    >
      <div className={classes.container}>
        <div className={classes.context_main}>
          <div className={classes.tableContainer}>
            <div className={`info-box  ${classes.wrapper} ${classFull}`}>
              {
                props.isLoading
                ?
                <Loader/>
                :
                <TableContainer component={Paper}>
                  <Table className={`head_box_table `} size="small" aria-label="a dense table">
                    <TableBody>                    
                      <TableRow key={1}>
                        <TableCell align="center" colSpan={2}>                            
                          <Typography variant="h6" className={"white"}>
                            {`Errors: ${counter.toLocaleString()}`}
                          </Typography>  
                        </TableCell>
                      </TableRow>
                      <TableRow key={2}>
                        <TableCell>
                          <Typography variant="body1" className={"white"} align="left">
                            {`Uspto: `}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className={"white"} align="right">
                            {props.fixItemCount.uspto.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow key={3}>
                        <TableCell>
                          <Typography variant="body1" className={"white"} align="left">
                            {`Patents: `}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" className={"white"} align="right">
                            {props.fixItemCount.patent.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>     
                      <TableRow key={4}>
                        <TableCell>
                          <Typography variant="body1" className={"white"} align="left">
                            {`Total: `}
                          </Typography>
                        </TableCell>
                        <TableCell>                            
                          <Typography variant="body1" className={"white"} align="right">
                            {counter.toLocaleString()}
                          </Typography>
                        </TableCell>
                      </TableRow>                  
                    </TableBody>
                  </Table>
                </TableContainer>
              }
            </div>          
          </div>  
        </div> 
        {
          fixitTab === 0 &&                     
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar                      
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('invent', 0)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          fixitTab === 1 &&                     
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('assign', 1)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          fixitTab === 2 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('corr', 2)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          fixitTab === 3 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('address', 3)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div> 
        }
        {
          fixitTab === 4 &&
          <div className={classes.context}>
            <div className={classes.tableContainer}>
              <div className={`info-box userSettings ${classes.wrapper}`}> 
                <div className={classes.scrollbar}>
                {
                  props.isLoading
                    ?
                    <Loader/>
                    :                  
                    <PerfectScrollbar
                      className={(isExpanded) ? classesMat.enhancedTableContainer: ''}
                      options={{
                        suppressScrollX: true,
                        minScrollbarLength: 20,
                        maxScrollbarLength: 25
                      }}
                    >
                      {renderItemList('security', 4)}
                    </PerfectScrollbar>                
                }
                </div>
              </div>
            </div>
          </div>
        }
        {
          !isExpanded && (props.screenWidth < 1335 || props.screenHeight < 420)
          ?
            <div style={{width: '100%'}}>
              <CustomTab
                activeTabId={fixitTab}
                setActiveTabId={setFixItTabIndex}
                tabs={['Invent', 'Assign.', 'Corr', 'Address', 'Security']}
              />
            </div>
          :
            <TabsContainer
              activeTabId={fixitTab}
              setActiveTabId={setFixItTabIndex}
              tabs={['Invent', 'Assign.', 'Corr', 'Address', 'Security']}
            />
        }
      </div>      
      <FullWidthSwitcher show={showSwitcher} widget={"fixItems"}/>
    </div>
  )
}

const mapStateToProps = state => {
  const errorItems = state.patenTrack.errorItems;
  return {
    fixItemCount: errorItems && errorItems.count ? errorItems.count : {uspto: 0, patent: 0},
    fixItemList: (errorItems && errorItems.list) ? errorItems.list : { invent: [], assign: [], corr: [], address: [], security: []},
    currentWidget: state.patenTrack.currentWidget,
    isLoading: state.patenTrack.errorItemsLoading,
    screenWidth: state.patenTrack.screenWidth,
    screenHeight: state.patenTrack.screenHeight,
    fixitTab: state.patenTrack.fixitTab,
  };
};

const mapDispatchToProps = {
  getErrorItems,
  setFixItTabIndex,
  setCurrentCollectionID,
  setCurrentAsset,
  setCurrentAssetType,
  setIllustrationUrl,
  getComments,
  getAssetsOutsource,
  getAssets,
  getCollectionIllustration,
  setTimelineTabIndex
};

export default connect(mapStateToProps, mapDispatchToProps)(FixItemsContainer);