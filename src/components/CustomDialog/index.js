import React from 'react';
import { 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button 
} from '@material-ui/core'; 

const CustomDialog = ({ open, onClose, title, children, PaperComponent }) => {
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
            <Button autoFocus onClick={onClose} style={{ marginRight: 20 }}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
