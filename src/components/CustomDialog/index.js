import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button 
} from '@material-ui/core'; 

const CustomDialog = ({ open, onClose, title, children, PaperComponent, showClearButton, onClickClear }) => {
  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      disableEscapeKeyDown={true}
    >
        <DialogTitle style={{ cursor: 'move', padding: 5, color: '#fff' }} id="draggable-dialog-title">
            {title}
        </DialogTitle>
        <DialogContent dividers={true} style={{ padding: 5 }}>
            {children}
        </DialogContent>
        <DialogActions style={{ padding: 5, color: '#fff' }}>
            {
                showClearButton === true && (
                    <Button autoFocus onClick={onClickClear} style={{ marginRight: 20, color: 'white' }}>
                        Clear
                    </Button>
                )
            }
            <Button autoFocus onClick={onClose} style={{ marginRight: 20, color: 'white' }}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
