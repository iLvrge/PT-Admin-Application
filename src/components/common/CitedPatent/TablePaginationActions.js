import React from 'react'
import { Box, IconButton } from '@mui/material';
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage"; 
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft"; 
import { useTheme } from "@mui/material/styles";

const TablePaginationActions = (props) => {
    const theme = useTheme();
    console.log(props)
    const { count, page, rowsPerPage, onChangePage } = props;
  
    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };  
  
    return (
        <Box style={{ flexShrink: 0, marginLeft: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
                size="large">
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
                size="large">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
                size="large">
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
                size="large">
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

export default TablePaginationActions;