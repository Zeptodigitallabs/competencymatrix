import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  useTheme,
  useMediaQuery,
  Box
} from '@mui/material';

const AlertDialog = ({
  open,
  onClose,
  title,
  titleStyle,
  ContentText,
  ContentTextStyle,
  action,
  cancelable,
  maxWidth = 'sm',
  type = 'info',
  ...props
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const getColor = () => {
    switch (type) {
      case 'error':
        return theme.palette.error.main;
      case 'success':
        return theme.palette.success.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={maxWidth}
      open={open}
      onClose={onClose || cancelable}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...props}
    >
      {title && (
        <DialogTitle id="alert-dialog-title" style={titleStyle}>
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        <DialogContentText 
          id="alert-dialog-description"
          style={ContentTextStyle}
        >
          {ContentText}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {action && Array.isArray(action) ? (
          action.map((btn, index) => (
            <Button
              key={index}
              onClick={btn.onPress}
              color={type}
              variant={index === 0 ? 'contained' : 'outlined'}
              style={index === 0 ? { backgroundColor: getColor() } : {}}
            >
              {btn.text}
            </Button>
          ))
        ) : (
          <Button onClick={onClose} color="primary" autoFocus>
            OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
