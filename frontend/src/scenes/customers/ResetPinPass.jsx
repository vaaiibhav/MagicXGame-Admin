import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Toaster, toast } from "sonner";

import {
  Box,
  Button,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
const ResetPinPass = (props) => {
  const [pinDialog, setPinDialog] = useState(false);
  const [pinDialogData, setPinDialogData] = useState({
    password: "",
    pin: "",
  });

  useEffect(() => {
    setPinDialog(props.pinOpen);
  }, [props.pinOpen]);
  const pinDialogSet = () => {
    console.log("Pin Set:", props);
  };
  const handlePinClose = () => {
    setPinDialog(false);
  };
  return (
    <>
      {/* Customer Pin and Password Dialog Start */}
      <Dialog open={pinDialog} onClose={handlePinClose}>
        <DialogTitle>Customer Pin and Password</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="pin"
            name="pin"
            label="PIN"
            type="password"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            size="medium"
            onClick={handlePinClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="medium"
            onClick={pinDialogSet}
          >
            Set
          </Button>
        </DialogActions>
      </Dialog>
      {/* Customer Pin and Password Dialog Ends */}
    </>
  );
};

export default ResetPinPass;
