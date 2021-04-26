import React, { useState, useEffect, forwardRef  } from 'react';
import {connect} from 'react-redux';
import {Column, Table, SortDirection, SortIndicator, AutoSizer } from 'react-virtualized';
import useStyles from "./styles";

function Reports(props) {
    const classes = useStyles();
    const [sortBy, setSortBy] = useState('representative_name')
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC)
    const [rows, setRows] = useState([])

    useEffect(() => {
        setRows(props.companyReports)
    }, [ props.companyReports ])

    const numberWithCommas = (x) => {
        return x != undefined ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
    }

    const sort = ({ sortBy, sortDirection }) => {
        setSortBy(sortBy);
        setSortDirection(sortDirection);

        let newItems = [...rows];
        newItems.sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === SortDirection.ASC ? -1 : 1;
            }
            if (a[sortBy] > b[sortBy]) {
                return sortDirection === SortDirection.ASC ? 1 : -1;
            }
            return 0;
        });
        setRows(newItems); 
    }

    const formatNumber = ({ dataKey, cellData, columnIndex = null, rowIndex }) => {
        return (
            numberWithCommas(cellData)
        )
    }

    return (
        <div
          className  = {classes.userItemsContainer}
        >
          <AutoSizer>
            {({ width, height}) => (           
                <Table
                width={width}
                height={height}
                headerHeight={30}            
                rowHeight={40}
                sort={sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                rowCount={rows.length}           
                rowGetter={({index}) => rows[index]}>
                <Column width={width * 0.30} label="Name" dataKey="representative_name" />
                <Column width={width * 0.15} label="Transactions" dataKey="no_of_transactions" cellRenderer={formatNumber}/>
                <Column width={width * 0.15} label="Parties" dataKey="no_of_parties"  cellRenderer={formatNumber}/>
                <Column width={width * 0.15} label="Assets" dataKey="assets"  cellRenderer={formatNumber}/>
                <Column width={width * 0.25} label="Product" dataKey="product"  cellRenderer={formatNumber}/>
            </Table>
            )}
            </AutoSizer>
        </div>
      );

}

const mapStateToProps = state => {
    return {
        width: state.patenTrack.screenWidth,
        height: state.patenTrack.screenHeight,
        companyReports: state.patenTrack.companyReports
    };
};
  
const mapDispatchToProps = {
    
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Reports);